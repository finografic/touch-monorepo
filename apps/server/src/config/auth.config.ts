import { envShared } from '@workspace/config/env.shared';

export const AUTH_COOKIE_PREFIX = envShared.AUTH_COOKIE_PREFIX;
export const AUTH_COOKIE_SUFFIX = envShared.AUTH_COOKIE_SUFFIX;
export const AUTH_COOKIE_NAME = `${AUTH_COOKIE_PREFIX}.${AUTH_COOKIE_SUFFIX}` as const;

export const COOKIE_ATTRIBUTES_SECURE = 'Max-Age=0; Path=/; HttpOnly; SameSite=Lax; Secure' as const;
