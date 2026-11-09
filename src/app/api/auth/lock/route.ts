import { NextRequest, NextResponse } from 'next/server';
import { StudioAuthService } from '@/server/auth/studio-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get(StudioAuthService.getCookieName());
    if (cookie?.value) {
      StudioAuthService.revokeSession(cookie.value);
    }

    const res = NextResponse.json({ success: true, message: 'Session révoquée et studio verrouillé' });
    res.cookies.delete(StudioAuthService.getCookieName());
    return res;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
