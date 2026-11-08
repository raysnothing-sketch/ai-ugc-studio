import { NextResponse } from 'next/server';
import { StudioAuthService } from '@/server/auth/studio-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isRequired = StudioAuthService.isAuthRequired();
  const isUnlocked = !isRequired || StudioAuthService.hasValidSession();

  return NextResponse.json({
    isRequired,
    isUnlocked
  });
}
