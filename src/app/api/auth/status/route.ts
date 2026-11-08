import { NextRequest, NextResponse } from 'next/server';
import { StudioAuthService } from '@/server/auth/studio-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const isRequired = StudioAuthService.isAuthRequired();
  const isUnlocked = StudioAuthService.hasValidSession(req);

  return NextResponse.json({
    isRequired,
    isUnlocked
  });
}
