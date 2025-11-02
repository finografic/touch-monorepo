import { COOKIES } from '@workspace/config/cookies.config';

type CookieSameSite = 'Strict' | 'Lax' | 'None';

interface CookieOptions {
  secure?: boolean;
  sameSite?: CookieSameSite;
  maxAge?: number;
  path?: string;
  httpOnly?: boolean;
}

/**
 * Generates a `Set-Cookie` header string for a given cookie.
 * Automatically handles Secure + SameSite + Max-Age etc.
 */
export function buildCookieHeader(name: string, value: string, opts: CookieOptions = {}): string {
  const {
    secure = process.env.NODE_ENV === 'production',
    sameSite = 'Lax',
    maxAge,
    path = '/',
    httpOnly = true,
  } = opts;

  const parts = [`${name}=${value}`];

  if (httpOnly) parts.push('HttpOnly');
  if (secure) parts.push('Secure');
  if (sameSite) parts.push(`SameSite=${sameSite}`);
  if (path) parts.push(`Path=${path}`);
  if (typeof maxAge === 'number') parts.push(`Max-Age=${maxAge}`);

  return parts.join('; ');
}

/**
 * Generates a deletion cookie header with matching attributes.
 */
export function buildDeleteCookieHeader(name = COOKIES.TOKEN_COOKIE): string {
  const secure = process.env.NODE_ENV === 'production';
  const sameSite: CookieSameSite = 'Lax';

  const parts = [
    `${name}=`,
    'HttpOnly',
    `SameSite=${sameSite}`,
    'Path=/',
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ];

  if (secure) parts.push('Secure');

  return parts.join('; ');
}
