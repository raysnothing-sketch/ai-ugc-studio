import { NextRequest, NextResponse } from 'next/server';
import { AIProviderManager } from '@/server/providers/ai-provider-manager';
import { verifyAuthOrReject } from '@/server/auth/studio-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  const manager = AIProviderManager.getInstance();
  const mode = manager.getStudioMode();
  const spent = await manager.getMonthlySpentEur();

  return NextResponse.json({
    success: true,
    mode,
    isAutonomousFree: mode === 'autonomous_free',
    monthlySpentEur: spent,
    monthlyBudgetLimitEur: manager.getMonthlyBudgetLimit(),
    activeProviders: {
      voice: mode === 'autonomous_free' ? 'Studio-Free-Voice (0.00 €)' : 'ElevenLabs / OpenAI',
      video: mode === 'autonomous_free' ? 'ComfyUI Local & Open Library (0.00 €)' : 'HeyGen / Runway',
      rendering: 'Remotion Web Engine (0.00 €)'
    },
    message: mode === 'autonomous_free'
      ? 'Mode 100% Autonome & Gratuit actif — Zéro abonnement, zéro token débité.'
      : 'Mode Cloud Payant actif.'
  });
}

export async function POST(req: NextRequest) {
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const targetMode = body.mode === 'cloud_paid' ? 'cloud_paid' : 'autonomous_free';

    const manager = AIProviderManager.getInstance();
    manager.setStudioMode(targetMode);

    return NextResponse.json({
      success: true,
      mode: targetMode,
      isAutonomousFree: targetMode === 'autonomous_free',
      message: targetMode === 'autonomous_free'
        ? 'Studio basculé avec succès en Mode 100% Autonome & Gratuit.'
        : 'Studio basculé en Mode Cloud API (Requiert vos clés payantes).'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
