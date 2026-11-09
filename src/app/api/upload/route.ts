import { NextRequest, NextResponse } from 'next/server';
import { r2Storage } from '@/server/storage/r2-client';
import { StudioAuthService, verifyAuthOrReject } from '@/server/auth/studio-auth';
import { validateUploadFile } from '@/server/utils/file-validator';
import { db } from '@/server/db';
import { mediaAssetsTable } from '@/server/db/schema';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  // 1. Enforce Authentication
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  try {
    const clientIp = StudioAuthService.getClientIp(req);
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Fichier requis' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const declaredMime = (file.type || '').toLowerCase();

    // 2. Validate Magic Bytes, Disguised Extensions, Rate Limits, and Size
    const validation = validateUploadFile(buffer, file.name, declaredMime, clientIp);
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: validation.error || 'Fichier non valide.'
      }, { status: 400 });
    }

    const verifiedMime = validation.detectedMime || declaredMime;

    // 3. Sanitize Filename & generate unique key
    const sanitizedBase = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.+/g, '.');
    const assetId = crypto.randomUUID();
    const key = `studio/uploads/${assetId}-${sanitizedBase}`;

    // 4. Upload to Cloudflare R2
    const result = await r2Storage.uploadFile(key, buffer, verifiedMime);

    // 5. Register in Database if available
    try {
      await db.insert(mediaAssetsTable).values({
        id: assetId,
        name: file.name,
        type: verifiedMime.startsWith('image') ? 'image' : verifiedMime.startsWith('video') ? 'video' : verifiedMime.startsWith('audio') ? 'audio' : 'document',
        url: result.url,
        sizeBytes: file.size,
        sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(2)} Mo`,
        mimeType: verifiedMime,
        r2Key: result.key,
        createdAt: new Date().toISOString()
      });
    } catch (dbErr: any) {
      console.warn('[Upload] DB indexing warning:', dbErr.message);
    }

    return NextResponse.json({
      success: true,
      id: assetId,
      url: result.url,
      key: result.key,
      name: file.name,
      size: file.size,
      mimeType: verifiedMime
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
