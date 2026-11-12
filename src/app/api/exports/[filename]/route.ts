import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const safeFilename = path.basename(filename);

  const possiblePaths = [
    path.join(process.cwd(), 'public', 'exports', safeFilename),
    path.join('C:/Users/raysn/.gemini/antigravity/brain/7d3b33d0-b9ff-4bda-801f-3b5e983c83e9/exports', safeFilename)
  ];

  let filePath = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }

  if (!filePath) {
    return new NextResponse('Fichier introuvable', { status: 404 });
  }

  const ext = path.extname(safeFilename).toLowerCase();
  const contentType =
    ext === '.mp4' ? 'video/mp4' :
    ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
    ext === '.png' ? 'image/png' :
    ext === '.webp' ? 'image/webp' :
    'application/octet-stream';

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'public, max-age=86400, immutable'
    }
  });
}
