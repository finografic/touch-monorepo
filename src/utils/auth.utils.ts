import { STORAGE_KEYS } from 'config/app';

/**
 * Clears the auth session token cookie
 * This removes the cookie set by Better Auth during login
 *
 * NOTE: Multiple variations are set to handle edge cases across browsers/OSes
 * CRITICAL: For __Secure- prefixed cookies (HTTPS), the Secure attribute MUST be included
 */
export const clearAuthSessionToken = (): void => {
  const cookieName = STORAGE_KEYS.AUTH_SESSION_TOKEN;
  const secureCookieName = `__Secure-${cookieName}`;

  // Clear regular cookies (development/localhost)
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`;
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; SameSite=Lax;`;
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax;`;
  document.cookie = `${cookieName}=; max-age=0; path=/; SameSite=Lax;`;

  // CRITICAL: Clear secure cookies (production/HTTPS)
  // Secure cookies MUST include the Secure attribute to be deleted
  // This is why the Windows 10 machine wasn't clearing the cookie
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Lax;`;
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; Secure; SameSite=Lax;`;
  document.cookie = `${cookieName}=; max-age=0; path=/; Secure; SameSite=Lax;`;

  // Also handle browser auto-prefixed __Secure- cookies (Chrome edge case)
  document.cookie = `${secureCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Lax;`;
  document.cookie = `${secureCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; Secure; SameSite=Lax;`;
  document.cookie = `${secureCookieName}=; max-age=0; path=/; Secure; SameSite=Lax;`;

  // Also clear any sessionStorage entries (just in case)
  sessionStorage.removeItem(cookieName);

  console.log(`Attempted to clear cookies: ${cookieName} and ${secureCookieName}`);
};
