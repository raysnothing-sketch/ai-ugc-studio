import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthOrReject } from '@/server/auth/studio-auth';
import { aiProviderManager } from '@/server/providers/ai-provider-manager';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ success: false, error: 'Identifiant jobId requis' }, { status: 400 });
    }

    const statusResult = await aiProviderManager.checkVideoStatus(jobId);
    return NextResponse.json({ success: true, ...statusResult });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
