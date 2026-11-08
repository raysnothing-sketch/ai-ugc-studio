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
    const {
      prompt = '',
      script = '',
      aspectRatio = '9:16',
      durationSec = 15,
      avatarId = 'anna-in-studio',
      voiceId = '21m00Tcm4TlvDq8ikWAM'
    } = body;

    const effectivePrompt = script || prompt;
    if (!effectivePrompt || typeof effectivePrompt !== 'string') {
      return NextResponse.json({ error: 'Script ou prompt requis pour la vidéo' }, { status: 400 });
    }

    const result = await aiProviderManager.generateVideo(effectivePrompt, {
      aspectRatio,
      durationSec,
      avatarId,
      voiceId
    });

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Video generation failed' }, { status: 500 });
  }
}
