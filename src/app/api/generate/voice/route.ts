import { NextRequest, NextResponse } from 'next/server';
import { aiProviderManager } from '@/server/providers/ai-provider-manager';
import { verifyAuthOrReject } from '@/server/auth/studio-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // 1. Enforce Authentication
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { text, voiceId = '21m00Tcm4TlvDq8ikWAM', language = 'fr' } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texte requis pour la synthèse vocale' }, { status: 400 });
    }

    const result = await aiProviderManager.generateVoice(text, {
      voiceId,
      language
    });

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}
