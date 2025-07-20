import { createAuthClient } from 'better-auth/client';

// Create the auth client with explicit typing
const authClientInstance = createAuthClient({
  baseURL: 'http://localhost:4040/api/auth',
  debug: true,
});

// Export with explicit type annotation
export const authClient: ReturnType<typeof createAuthClient> = authClientInstance;

// Export the type
export type AuthClient = ReturnType<typeof createAuthClient>;
