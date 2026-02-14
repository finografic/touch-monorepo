import { createAuthClient } from 'better-auth/client';
import { adminClient } from 'better-auth/client/plugins';

import { getApiBaseUrl } from '../api/fetch.client';

// Use API_BASE_URL (http://host:4040) instead of API_URL (http://host:4040/api)
// because Better Auth adds /auth path itself based on server's basePath config
export const authClient = createAuthClient({
  baseURL: getApiBaseUrl(),
  plugins: [adminClient()],
});

export type AuthClient = typeof authClient;

// TODO: inspect these internal better-auth client hooks
// useSession
// useAuthQuery
