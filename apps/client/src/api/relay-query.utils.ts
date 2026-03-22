import { getQueryErrorMessage } from '@workspace/core/api';

/**
 * True when the error text looks like a transport / server-unavailable problem
 * (used to disable polling and show “server stopped” copy).
 */
export function isRelayNetworkLikeError(error: unknown): boolean {
  const msg = getQueryErrorMessage(error) ?? '';
  return (
    msg.includes('Network Error') ||
    msg.includes('RPC Request Failed') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('fetch')
  );
}

export { getQueryErrorMessage };
