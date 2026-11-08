import { NextRequest, NextResponse } from 'next/server';
import { r2Storage } from '@/server/storage/r2-client';
import { verifyAuthOrReject } from '@/server/auth/studio-auth';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 Megabytes

const ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  // Audio
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/m4a',
  'audio/x-m4a',
  // Video
  'video/mp4',
  'video/webm',
  'video/quicktime',
  // Documents
  'application/pdf'
]);

export async function POST(req: NextRequest) {
  // 1. Enforce Authentication
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Fichier requis' }, { status: 400 });
    }

    // 2. Enforce File Size Limit
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        error: `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo). Limite autorisée : 50 Mo.`
      }, { status: 400 });
    }

    // 3. Enforce Allowed MIME Types Whitelist
    const mimeType = (file.type || '').toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json({
        error: `Format de fichier non autorisé (${mimeType || 'inconnu'}). Formats acceptés : JPG, PNG, WEBP, MP3, WAV, MP4, WEBM, PDF.`
      }, { status: 400 });
    }

    // 4. Sanitize Filename
    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.+/g, '.');
    const key = `studio/uploads/${Date.now()}-${sanitizedName}`;

    // 5. Upload to Cloudflare R2
    const result = await r2Storage.uploadFile(key, buffer, mimeType);

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      name: file.name,
      size: file.size,
      mimeType
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
