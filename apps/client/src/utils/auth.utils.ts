import { STORAGE_KEYS } from 'config/app';

/**
 * Clears the auth session token cookie
 * This removes the cookie set by Better Auth during login
 *
 * NOTE: Multiple variations are set to handle edge cases across browsers/OSes
 */
export const clearAuthSessionToken = (): void => {
  const cookieName = STORAGE_KEYS.AUTH_SESSION_TOKEN;

  // Clear the cookie with multiple variations to ensure deletion across all browsers/OSes
  // This is especially important for older Windows machines

  // Variation 1: Path=/ (most common)
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`;

  // Variation 2: Path=/ with domain
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; SameSite=Lax;`;

  // Variation 3: No path (in case cookie was set without explicit path)
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax;`;

  // Variation 4: Max-Age method (alternative to expires)
  document.cookie = `${cookieName}=; max-age=0; path=/; SameSite=Lax;`;

  // Also clear any sessionStorage entries (just in case)
  sessionStorage.removeItem(cookieName);
};
