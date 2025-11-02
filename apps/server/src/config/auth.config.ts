import { envShared } from '@workspace/config/env.shared';

export const AUTH_COOKIE_PREFIX = envShared.AUTH_COOKIE_PREFIX;
export const AUTH_COOKIE_SUFFIX = envShared.AUTH_COOKIE_SUFFIX;
export const AUTH_COOKIE_NAME = `${AUTH_COOKIE_PREFIX}.${AUTH_COOKIE_SUFFIX}` as const;

// Cookie deletion attributes - must match Better Auth's cookie settings exactly
// except Max-Age=0 for deletion
const isProduction = envShared.NODE_ENV === 'production';
export const COOKIE_DELETE_ATTRIBUTES = [
  'Max-Age=0',
  'Path=/',
  'HttpOnly',
  'SameSite=Lax',
  ...(isProduction ? ['Secure'] : []),
].join('; ');
