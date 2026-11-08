import { NextRequest, NextResponse } from 'next/server';
import { StudioAuthService } from '@/server/auth/studio-auth';

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();

    if (!passcode || !StudioAuthService.verifyPasscode(passcode)) {
      return NextResponse.json({ error: 'Code d\'accès incorrect' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, message: 'Studio déverrouillé' });
    res.cookies.set(StudioAuthService.getCookieName(), StudioAuthService.getSessionCookieValue(), {
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
