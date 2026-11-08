import { NextRequest, NextResponse } from 'next/server';
import { StudioAuthService } from '@/server/auth/studio-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = StudioAuthService.getClientIp(req);

    // 1. Check Rate Limit
    const rateLimit = StudioAuthService.isIpRateLimited(ip);
    if (rateLimit.isLimited) {
      return NextResponse.json({
        error: `Trop de tentatives erronées. Veuillez patienter ${Math.ceil(rateLimit.remainingSec / 60)} minutes avant de réessayer.`
      }, { status: 429 });
    }

    const { passcode } = await req.json();

    // 2. Validate Passcode
    if (!passcode || !StudioAuthService.verifyPasscode(passcode)) {
      const attemptInfo = StudioAuthService.recordFailedAttempt(ip);
      if (attemptInfo.locked) {
        return NextResponse.json({
          error: 'Trop de tentatives erronées. Studio verrouillé pendant 15 minutes.'
        }, { status: 429 });
      }

      return NextResponse.json({
        error: `Code PIN incorrect. ${attemptInfo.attemptsLeft} tentative(s) restante(s).`
      }, { status: 401 });
    }

    // 3. Reset Rate Limit on success
    StudioAuthService.resetRateLimit(ip);

    // 4. Generate Cryptographically Signed Token
    const sessionToken = StudioAuthService.createSignedSessionToken();

    const res = NextResponse.json({ success: true, message: 'Studio déverrouillé' });
    res.cookies.set(StudioAuthService.getCookieName(), sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur d\'authentification' }, { status: 500 });
  }
}
