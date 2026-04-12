import { env } from 'env.server';
import { randomBytes } from 'node:crypto';
import pc from 'picocolors';

/**
 * JWT sessions are signed with AUTH_SECRET. Rotating the secret each time the API
 * process starts invalidates every existing session cookie (without touching the DB).
 *
 * Env: `AUTH_INVALIDATE_JWT_ON_SERVER_BOOT`
 * - `true` — always use a new random secret per process (dev or prod).
 * - `false` — always use `AUTH_SECRET` from the environment (stable across restarts).
 * - unset — in **development**, default to ephemeral; in **production**, use `AUTH_SECRET`.
 */
function shouldUseEphemeralJwtSecret(): boolean {
  const flag = process.env.AUTH_INVALIDATE_JWT_ON_SERVER_BOOT;
  if (flag === 'true') return true;
  if (flag === 'false') return false;

  return process.env.NODE_ENV === 'development';
}

const useEphemeralJwtSecret = shouldUseEphemeralJwtSecret();

export const runtimeAuthSecret: string = useEphemeralJwtSecret
  ? randomBytes(32).toString('hex')
  : env.AUTH_SECRET;

if (useEphemeralJwtSecret) {
  console.log(
    pc.dim('[auth]'),
    pc.yellow('Ephemeral JWT signing secret'),
    pc.dim(
      '(sessions do not survive API server restart; set AUTH_INVALIDATE_JWT_ON_SERVER_BOOT=false to keep stable JWTs in dev)',
    ),
  );
}
