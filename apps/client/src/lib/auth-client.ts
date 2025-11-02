import { createAuthClient } from 'better-auth/client';
import { adminClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.API_URL,
  plugins: [adminClient()],
});

export type AuthClient = typeof authClient;

// TODO: inspect these internal better-auth client hooks
// useSession
// useAuthQuery
