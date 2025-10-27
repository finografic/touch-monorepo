import { createAuthClient } from 'better-auth/client';
import { adminClient } from 'better-auth/client/plugins';
import { env } from 'env.client';

export const authClient = createAuthClient({
  baseURL: `${env.API_PROTOCOL}://${env.API_HOST}:${env.API_PORT}`,
  plugins: [adminClient()],
});

export type AuthClient = typeof authClient;

// TODO: inspect these internal better-auth client hooks
// useSession
// useAuthQuery
