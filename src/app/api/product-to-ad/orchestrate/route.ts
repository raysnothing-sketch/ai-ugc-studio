import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthOrReject } from '@/server/auth/studio-auth';
import { productToAdSchema } from '@/server/validation/schemas';
import { productToAdOrchestrator } from '@/server/services/product-to-ad-orchestrator';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // 1. Enforce Authentication
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  try {
    const rawBody = await req.json();

    // 2. Validate with Zod
    const parsed = productToAdSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: parsed.error.issues.map(i => i.message).join(' | ')
      }, { status: 400 });
    }

    // 3. Execute Real Product-to-Ad Orchestration
    const result = await productToAdOrchestrator.orchestrate(parsed.data);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    console.error('[API Product-to-Ad] Error:', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'Erreur lors de l\'orchestration Product-to-Ad'
    }, { status: 500 });
  }
}
