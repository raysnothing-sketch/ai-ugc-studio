/**
 * File Validation Utility with Magic Bytes Verification & Disguised File Detection
 * 
 * Prevents:
 * 1. Disguised executable / script uploads (e.g. evil.exe renamed to evil.png).
 * 2. SVG-based stored Cross-Site Scripting (XSS) and XML Entity attacks (SVG rejected by default).
 * 3. Denial of Service via oversized files (> 50 MB).
 * 4. Directory traversal / path injection via malicious filenames.
 * 5. Upload flooding via IP-based rate limiting.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  detectedMime?: string;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 Megabytes

// Allowed MIME types mapped to their byte-level validator
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/m4a',
  'audio/x-m4a',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'application/pdf'
]);

// Upload rate limiter: IP -> { count: number, windowStart: number }
interface UploadRateRecord {
  count: number;
  windowStart: number;
}
const uploadRateMap = new Map<string, UploadRateRecord>();
const UPLOAD_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_UPLOADS_PER_WINDOW = 30; // Max 30 uploads per 10 min

export function checkUploadRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = uploadRateMap.get(ip) || { count: 0, windowStart: now };

  if (now - record.windowStart > UPLOAD_WINDOW_MS) {
    record.count = 1;
    record.windowStart = now;
    uploadRateMap.set(ip, record);
    return { allowed: true, remaining: MAX_UPLOADS_PER_WINDOW - 1 };
  }

  if (record.count >= MAX_UPLOADS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  uploadRateMap.set(ip, record);
  return { allowed: true, remaining: MAX_UPLOADS_PER_WINDOW - record.count };
}

/**
 * Validates buffer against file signatures (magic bytes)
 */
export function verifyMagicBytes(buffer: Buffer, declaredMime: string): ValidationResult {
  if (buffer.length < 8) {
    return { valid: false, error: 'Fichier vide ou corrompu' };
  }

  // 1. Explicitly reject SVG and HTML uploads to prevent XSS
  if (declaredMime.includes('svg') || declaredMime.includes('xml') || declaredMime.includes('html')) {
    return {
      valid: false,
      error: 'Les fichiers SVG, HTML et XML sont strictement interdits pour des raisons de sécurité (vecteur XSS).'
    };
  }

  // Check JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    if (['image/jpeg', 'image/jpg'].includes(declaredMime)) {
      return { valid: true, detectedMime: 'image/jpeg' };
    }
  }

  // Check PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    if (declaredMime === 'image/png') {
      return { valid: true, detectedMime: 'image/png' };
    }
  }

  // Check WebP / WAV: RIFF header
  if (
    buffer[0] === 0x52 && // R
    buffer[1] === 0x49 && // I
    buffer[2] === 0x46 && // F
    buffer[3] === 0x46    // F
  ) {
    if (buffer.length >= 12) {
      const format = buffer.toString('ascii', 8, 12);
      if (format === 'WEBP' && declaredMime === 'image/webp') {
        return { valid: true, detectedMime: 'image/webp' };
      }
      if (format === 'WAVE' && ['audio/wav', 'audio/x-wav'].includes(declaredMime)) {
        return { valid: true, detectedMime: 'audio/wav' };
      }
    }
  }

  // Check GIF: GIF87a or GIF89a
  if (buffer.toString('ascii', 0, 3) === 'GIF') {
    if (declaredMime === 'image/gif') {
      return { valid: true, detectedMime: 'image/gif' };
    }
  }

  // Check MP4 / MOV / QuickTime: 'ftyp' at bytes 4..7
  if (buffer.length >= 12) {
    const ftyp = buffer.toString('ascii', 4, 8);
    if (ftyp === 'ftyp' || ftyp === 'moov') {
      if (['video/mp4', 'video/quicktime', 'audio/m4a', 'audio/x-m4a'].includes(declaredMime)) {
        return { valid: true, detectedMime: declaredMime };
      }
    }
  }

  // Check WebM / MKV: 1A 45 DF A3 (EBML)
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    if (['video/webm', 'audio/webm'].includes(declaredMime)) {
      return { valid: true, detectedMime: 'video/webm' };
    }
  }

  // Check MP3: ID3 tag or sync frame FF FB / FF F3
  if (
    (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) || // ID3
    (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0) // MPEG frame sync
  ) {
    if (['audio/mpeg', 'audio/mp3'].includes(declaredMime)) {
      return { valid: true, detectedMime: 'audio/mpeg' };
    }
  }

  // Check OGG: OggS
  if (buffer.toString('ascii', 0, 4) === 'OggS') {
    if (['audio/ogg', 'video/ogg'].includes(declaredMime)) {
      return { valid: true, detectedMime: declaredMime };
    }
  }

  // Check PDF: %PDF-
  if (buffer.toString('ascii', 0, 5) === '%PDF-') {
    if (declaredMime === 'application/pdf') {
      return { valid: true, detectedMime: 'application/pdf' };
    }
  }

  // If MIME was whitelisted but magic bytes didn't match
  if (ALLOWED_MIME_TYPES.has(declaredMime)) {
    return {
      valid: false,
      error: `Incohérence détectée : le contenu réel du fichier ne correspond pas au format déclaré (${declaredMime}). Upload rejeté.`
    };
  }

  return {
    valid: false,
    error: `Format de fichier non pris en charge (${declaredMime}). Formats acceptés : JPG, PNG, WEBP, MP3, WAV, MP4, WEBM, PDF.`
  };
}

/**
 * Validates complete file payload
 */
export function validateUploadFile(
  buffer: Buffer,
  fileName: string,
  declaredMime: string,
  clientIp: string
): ValidationResult {
  // 1. Rate Limiting
  const rateLimit = checkUploadRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return {
      valid: false,
      error: 'Limite d\'uploads atteinte (30 uploads max par tranche de 10 min). Veuillez patienter.'
    };
  }

  // 2. Size limit
  if (buffer.length > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Fichier trop volumineux (${(buffer.length / 1024 / 1024).toFixed(1)} Mo). Plafond maximum : 50 Mo.`
    };
  }

  // 3. Sanitized filename
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.+/g, '.');
  if (!cleanName || cleanName.startsWith('.')) {
    return { valid: false, error: 'Nom de fichier invalide.' };
  }

  // 4. Magic Bytes Check
  const mimeCheck = (declaredMime || '').toLowerCase().trim();
  return verifyMagicBytes(buffer, mimeCheck);
}
