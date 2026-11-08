import { NextRequest, NextResponse } from 'next/server';
import { aiProviderManager } from '@/server/providers/ai-provider-manager';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voiceId = 'v-1', language = 'fr' } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
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
