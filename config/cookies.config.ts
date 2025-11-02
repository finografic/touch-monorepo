import { envShared } from '@workspace/config/env.shared';

export const COOKIES = {
  COOKIE_PREFIX: envShared.AUTH_COOKIE_PREFIX, // remains if 'session_token' is removed is set
  TOKEN_COOKIE: `${envShared.AUTH_COOKIE_PREFIX}.${envShared.TOKEN_COOKIE_SUFFIX}`, // remains if 'session_token' is removed is set
  DATA_COOKIE: `${envShared.AUTH_COOKIE_PREFIX}.${envShared.DATA_COOKIE_SUFFIX}`, // remains if 'session_token' is removed is set
} as const;

export const COOKIE_DELETE_ATTRIBUTES = [
  'Max-Age=0',
  'Path=/',
  'HttpOnly',
  'SameSite=Lax',
  ...(envShared.NODE_ENV === 'production' ? ['Secure'] : []),
].join('; ');
