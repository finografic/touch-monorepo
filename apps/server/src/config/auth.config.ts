export const AUTH_COOKIE_PREFIX = 'touch-monorepo';
export const AUTH_COOKIE_SUFFIX = 'auth_token';
export const AUTH_COOKIE_NAME = `${AUTH_COOKIE_PREFIX}.${AUTH_COOKIE_SUFFIX}`;
export const COOKIE_ATTRIBUTES_SECURE = 'Max-Age=0; Path=/; HttpOnly; SameSite=Lax; Secure' as const;
