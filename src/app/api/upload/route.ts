import { NextRequest, NextResponse } from 'next/server';
import { r2Storage } from '@/server/storage/r2-client';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Fichier requis' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `studio/uploads/${Date.now()}-${sanitizedName}`;

    const result = await r2Storage.uploadFile(key, buffer, file.type || 'application/octet-stream');

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      name: file.name,
      size: file.size,
      mimeType: file.type
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
