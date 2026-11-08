import { cookies } from 'next/headers';

/**
 * Studio Private Access Gate.
 * Secures the personal studio so that unauthorized visitors cannot view confidential clients,
 * invoices or consume paid AI credits.
 */

const COOKIE_NAME = 'ai_ugc_studio_session';
const DEFAULT_PASSCODE = '1234';

export class StudioAuthService {
  public static getPasscode(): string {
    return process.env.STUDIO_PASSCODE || DEFAULT_PASSCODE;
  }

  public static isAuthRequired(): boolean {
    // Enabled by default in production or when explicitly configured
    return process.env.NODE_ENV === 'production' || !!process.env.STUDIO_PASSCODE;
  }

  public static verifyPasscode(inputPasscode: string): boolean {
    const valid = this.getPasscode();
    return inputPasscode.trim() === valid.trim();
  }

  public static hasValidSession(): boolean {
    try {
      const cookieStore = cookies();
      const session = cookieStore.get(COOKIE_NAME);
      if (!session) return false;
      return session.value === `valid-${this.getPasscode()}`;
    } catch {
      return false;
    }
  }

  public static getSessionCookieValue(): string {
    return `valid-${this.getPasscode()}`;
  }

  public static getCookieName(): string {
    return COOKIE_NAME;
  }
}
