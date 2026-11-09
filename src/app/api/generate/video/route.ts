import { NextRequest, NextResponse } from 'next/server';
import { aiProviderManager } from '@/server/providers/ai-provider-manager';
import { verifyAuthOrReject } from '@/server/auth/studio-auth';
import { videoGenerationSchema } from '@/server/validation/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // 1. Enforce Authentication
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  try {
    const rawBody = await req.json();

    // 2. Validate with Zod
    const parsed = videoGenerationSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: parsed.error.issues.map(i => i.message).join(' | ')
      }, { status: 400 });
    }

    const { prompt, aspectRatio, avatarId, voiceId } = parsed.data;

    const result = await aiProviderManager.generateVideo(prompt, {
      aspectRatio,
      durationSec: 15,
      avatarId: avatarId || 'anna-in-studio',
      voiceId: voiceId || '21m00Tcm4TlvDq8ikWAM'
    });

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Video generation failed'
    }, { status: 500 });
  }
}
