import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * AI UGC Studio — Hardened Enterprise Security & Session Gate (Next.js 15 Edition)
 * 
 * Features:
 * 1. Cryptographically signed HMAC-SHA256 session tokens with timestamp, nonce, and rotation.
 * 2. Timing-safe comparison (crypto.timingSafeEqual) against side-channel timing attacks.
 * 3. Ephemeral 256-bit cryptosecret generation if STUDIO_SESSION_SECRET is omitted (no hardcoded fallback).
 * 4. Configurable session lifetime (STUDIO_SESSION_HOURS, default 24h).
 * 5. Instant session revocation support (logout / lock invalidation).
 * 6. IP rate limiting against brute-force passcode guessing (5 attempts max / 15 min).
 * 7. Hardened IP extraction & sanitization (cf-connecting-ip, x-real-ip, sanitized x-forwarded-for).
 * 8. Universal route guard `verifyAuthOrReject(req)` for all private endpoints.
 */

const COOKIE_NAME = 'ai_ugc_studio_session';
const DEFAULT_PASSCODE = '1234';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Retrieve signing secret without ever using a public hardcoded secret
function getSigningSecret(): string {
  if (process.env.STUDIO_SESSION_SECRET && process.env.STUDIO_SESSION_SECRET.trim().length >= 16) {
    return process.env.STUDIO_SESSION_SECRET.trim();
  }
  const g = globalThis as unknown as { __studioSessionSecret?: string };
  if (!g.__studioSessionSecret) {
    g.__studioSessionSecret = crypto.randomBytes(32).toString('hex');
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ [SECURITY] STUDIO_SESSION_SECRET absent en production. Clé éphémère 256-bit auto-générée.');
    }
  }
  return g.__studioSessionSecret;
}

// Configurable session duration (default: 24 hours)
function getSessionMaxAgeMs(): number {
  const hours = parseInt(process.env.STUDIO_SESSION_HOURS || '24', 10);
  return (isNaN(hours) || hours <= 0 ? 24 : hours) * 60 * 60 * 1000;
}

// Rate limiter storage: IP -> { attempts: number, lockUntil: number }
interface RateLimitRecord {
  attempts: number;
  lockUntil: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

// Revoked nonces registry (allows instant server-side revocation on lock/logout)
const gRevoke = globalThis as unknown as { __revokedNonces?: Set<string> };
if (!gRevoke.__revokedNonces) {
  gRevoke.__revokedNonces = new Set<string>();
}
const revokedNonces = gRevoke.__revokedNonces;

export class StudioAuthService {
  public static getPasscode(): string {
    return process.env.STUDIO_PASSCODE || DEFAULT_PASSCODE;
  }

  public static isAuthRequired(): boolean {
    return true;
  }

  public static getCookieName(): string {
    return COOKIE_NAME;
  }

  public static isWeakPasscode(): boolean {
    const code = this.getPasscode();
    return code === '1234' || code === '0000' || code.length < 4;
  }

  /**
   * Check if an IP address is currently locked out
   */
  public static isIpRateLimited(ip: string): { isLimited: boolean; remainingSec: number } {
    const record = rateLimitMap.get(ip);
    if (!record) return { isLimited: false, remainingSec: 0 };

    const now = Date.now();
    if (record.lockUntil > now) {
      const remainingSec = Math.ceil((record.lockUntil - now) / 1000);
      return { isLimited: true, remainingSec };
    }

    if (record.lockUntil > 0 && record.lockUntil <= now) {
      rateLimitMap.delete(ip);
    }

    return { isLimited: false, remainingSec: 0 };
  }

  /**
   * Record a failed passcode attempt
   */
  public static recordFailedAttempt(ip: string): { locked: boolean; attemptsLeft: number } {
    const now = Date.now();
    const record = rateLimitMap.get(ip) || { attempts: 0, lockUntil: 0 };
    record.attempts += 1;

    if (record.attempts >= MAX_ATTEMPTS) {
      record.lockUntil = now + LOCKOUT_DURATION_MS;
      rateLimitMap.set(ip, record);
      return { locked: true, attemptsLeft: 0 };
    }

    rateLimitMap.set(ip, record);
    return { locked: false, attemptsLeft: MAX_ATTEMPTS - record.attempts };
  }

  /**
   * Reset rate limit on successful authentication
   */
  public static resetRateLimit(ip: string): void {
    rateLimitMap.delete(ip);
  }

  /**
   * Verify input passcode using constant-time comparison
   */
  public static verifyPasscode(inputPasscode: string): boolean {
    if (!inputPasscode) return false;
    const valid = this.getPasscode();
    try {
      const a = Buffer.from(inputPasscode.trim());
      const b = Buffer.from(valid.trim());
      if (a.length !== b.length) return false;
      return crypto.timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }

  /**
   * Generate an unforgeable HMAC-SHA256 signed session token
   */
  public static createSignedSessionToken(): string {
    const nonce = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const passcodeHash = crypto.createHash('sha256').update(this.getPasscode()).digest('hex');
    const payload = `${passcodeHash}:${nonce}:${timestamp}`;
    const secret = getSigningSecret();
    const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    
    return Buffer.from(JSON.stringify({ payload, hmac })).toString('base64url');
  }

  /**
   * Validate a session token
   */
  public static verifySessionToken(tokenString: string): boolean {
    if (!tokenString) return false;
    try {
      const raw = Buffer.from(tokenString, 'base64url').toString('utf-8');
      const { payload, hmac } = JSON.parse(raw);
      if (!payload || !hmac) return false;

      const secret = getSigningSecret();
      const expectedHmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
      const hmacBuf = Buffer.from(hmac);
      const expectedBuf = Buffer.from(expectedHmac);

      if (hmacBuf.length !== expectedBuf.length) return false;
      if (!crypto.timingSafeEqual(hmacBuf, expectedBuf)) return false;

      const [storedPasscodeHash, nonce, timestampStr] = payload.split(':');
      
      // Check if session was revoked
      if (revokedNonces.has(nonce)) {
        return false;
      }

      // Check passcode hash match
      const currentPasscodeHash = crypto.createHash('sha256').update(this.getPasscode()).digest('hex');
      if (storedPasscodeHash !== currentPasscodeHash) return false;

      // Check expiration
      const timestamp = parseInt(timestampStr, 10);
      if (isNaN(timestamp) || Date.now() - timestamp > getSessionMaxAgeMs()) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Instantly revokes a session token
   */
  public static revokeSession(tokenString: string): void {
    if (!tokenString) return;
    try {
      const raw = Buffer.from(tokenString, 'base64url').toString('utf-8');
      const { payload } = JSON.parse(raw);
      if (payload) {
        const parts = payload.split(':');
        if (parts[1]) {
          revokedNonces.add(parts[1]);
          // Keep set bounded to prevent memory leaks
          if (revokedNonces.size > 10000) {
            const first = revokedNonces.values().next().value;
            if (first) revokedNonces.delete(first);
          }
        }
      }
    } catch {
      // Ignore malformed tokens
    }
  }

  /**
   * Extracts and sanitizes IP address from incoming Next.js request
   */
  public static getClientIp(req: NextRequest): string {
    const cfIp = req.headers.get('cf-connecting-ip');
    if (cfIp && /^[0-9a-fA-F:.]+$/.test(cfIp.trim())) {
      return cfIp.trim();
    }

    const realIp = req.headers.get('x-real-ip');
    if (realIp && /^[0-9a-fA-F:.]+$/.test(realIp.trim())) {
      return realIp.trim();
    }

    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
      const candidate = forwarded.split(',')[0].trim();
      if (/^[0-9a-fA-F:.]+$/.test(candidate)) {
        return candidate;
      }
    }

    return '127.0.0.1';
  }

  /**
   * Checks whether the request holds a valid signed session cookie
   */
  public static hasValidSession(req?: NextRequest): boolean {
    try {
      if (req) {
        const cookie = req.cookies.get(COOKIE_NAME);
        if (!cookie?.value) return false;
        return this.verifySessionToken(cookie.value);
      }
      return false;
    } catch {
      return false;
    }
  }
}

/**
 * Universal Route Guard
 * Returns a 401 response if unauthenticated, or null if authorized.
 */
export function verifyAuthOrReject(req: NextRequest): NextResponse | null {
  const isValid = StudioAuthService.hasValidSession(req);
  if (!isValid) {
    return NextResponse.json({
      success: false,
      error: 'Non autorisé. Veuillez déverrouiller le studio avec votre code PIN.'
    }, { status: 401 });
  }
  return null;
}
