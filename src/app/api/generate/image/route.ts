import { NextRequest, NextResponse } from 'next/server';
import { aiProviderManager } from '@/server/providers/ai-provider-manager';
import { verifyAuthOrReject } from '@/server/auth/studio-auth';
import { imageGenerationSchema } from '@/server/validation/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // 1. Enforce Authentication
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  try {
    const rawBody = await req.json();

    // 2. Validate with Zod
    const parsed = imageGenerationSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: parsed.error.issues.map(i => i.message).join(' | ')
      }, { status: 400 });
    }

    const { prompt, aspectRatio, style } = parsed.data;

    // 3. Generate Image via Free Autonomous Engine / Local ComfyUI
    const result = await aiProviderManager.generateImage(prompt, {
      aspectRatio,
      style
    });

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Image generation failed'
    }, { status: 500 });
  }
}
