import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * AI UGC Studio — Hardened Enterprise Security & Session Gate
 * 
 * Features:
 * 1. Cryptographically signed HMAC-SHA256 session tokens with timestamp & nonce.
 * 2. Timing-safe comparison to prevent side-channel timing attacks.
 * 3. In-memory IP rate limiting to prevent brute-force passcode guessing (5 attempts max / 15 min).
 * 4. Universal route guard `verifyAuthOrReject(req)` for API endpoints.
 */

const COOKIE_NAME = 'ai_ugc_studio_session';
const DEFAULT_PASSCODE = '1234';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Secret key for HMAC signing (derived from env or strong fallback)
const SESSION_SECRET = process.env.STUDIO_SESSION_SECRET || 'ai-ugc-studio-secret-vault-2026-production';

// Rate limiter storage: IP -> { attempts: number, lockUntil: number }
interface RateLimitRecord {
  attempts: number;
  lockUntil: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

export class StudioAuthService {
  public static getPasscode(): string {
    return process.env.STUDIO_PASSCODE || DEFAULT_PASSCODE;
  }

  public static isAuthRequired(): boolean {
    return true; // Enforce everywhere
  }

  public static getCookieName(): string {
    return COOKIE_NAME;
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

    // Reset if lockout duration has passed
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
    const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
    
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

      const expectedHmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
      const hmacBuf = Buffer.from(hmac);
      const expectedBuf = Buffer.from(expectedHmac);

      if (hmacBuf.length !== expectedBuf.length) return false;
      if (!crypto.timingSafeEqual(hmacBuf, expectedBuf)) return false;

      const [storedPasscodeHash, , timestampStr] = payload.split(':');
      const currentPasscodeHash = crypto.createHash('sha256').update(this.getPasscode()).digest('hex');
      if (storedPasscodeHash !== currentPasscodeHash) return false;

      const timestamp = parseInt(timestampStr, 10);
      if (isNaN(timestamp) || Date.now() - timestamp > SESSION_MAX_AGE_MS) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Extracts IP address from incoming Next.js request
   */
  public static getClientIp(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    const realIp = req.headers.get('x-real-ip');
    if (realIp) return realIp.trim();
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
