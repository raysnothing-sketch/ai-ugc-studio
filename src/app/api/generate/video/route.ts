import { NextRequest, NextResponse } from 'next/server';
import { aiProviderManager } from '@/server/providers/ai-provider-manager';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt = '', aspectRatio = '9:16', durationSec = 15 } = body;

    const result = await aiProviderManager.generateVideo(prompt, {
      aspectRatio,
      durationSec
    });

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Video generation failed' }, { status: 500 });
  }
}
