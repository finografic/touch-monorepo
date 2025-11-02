import { createAuthClient } from 'better-auth/client';
import { adminClient } from 'better-auth/client/plugins';

// Use API_BASE_URL (http://localhost:4040) instead of API_URL (http://localhost:4040/api)
// because Better Auth adds /auth path itself based on server's basePath config
export const authClient = createAuthClient({
  baseURL: process.env.API_BASE_URL,
  plugins: [adminClient()],
});

export type AuthClient = typeof authClient;

// TODO: inspect these internal better-auth client hooks
// useSession
// useAuthQuery
