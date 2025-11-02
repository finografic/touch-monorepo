import { STORAGE_KEYS } from 'config/app';

/**
 * Force-delete Better Auth cookies from the client side (LAST RESORT ONLY)
 *
 * ⚠️ IMPORTANT LIMITATIONS:
 * - HttpOnly cookies CANNOT be deleted from JavaScript (browser security)
 * - Better Auth cookies are HttpOnly, so this will likely NOT work for them
 * - This only works for non-HttpOnly cookies or client-side storage
 *
 * This utility is provided as a last resort fallback to attempt deletion of:
 * 1. Any non-HttpOnly session cookies that might exist
 * 2. Client-side storage (sessionStorage, localStorage)
 * 3. Any cached authentication state
 *
 * For proper cookie deletion, always use the server's sign-out endpoint which
 * sends Set-Cookie headers with Max-Age=0 to delete HttpOnly cookies.
 *
 * USE CASES:
 * - Clear cached/corrupted authentication state before login
 * - Development/debugging to force clean state
 * - Cleanup after failed authentication attempts
 */
export const forceDeleteAuthCookies = (): void => {
  const cookiePrefix = 'touch-monorepo';
  const sessionTokenCookie = `${cookiePrefix}.session_token`;
  const sessionDataCookie = `${cookiePrefix}.session_data`;

  console.log('🧹 [FORCE DELETE] Attempting client-side cookie deletion...');
  console.log('⚠️  Note: HttpOnly cookies cannot be deleted from JavaScript');
  console.log('📋 Current cookies:', document.cookie);

  const hostname = window.location.hostname;
  const cookiesToDelete = [sessionTokenCookie, sessionDataCookie];

  // Generate deletion commands for each cookie (including __Secure- prefix for Windows)
  const deletionStrategies = cookiesToDelete.flatMap((cookieName) => [
    // Standard deletion with expires
    `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`,
    `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=None`,
    `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict`,

    // With domain
    `${cookieName}=; path=/; domain=${hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`,

    // Max-Age method
    `${cookieName}=; path=/; max-age=0; SameSite=Lax`,
    `${cookieName}=; path=/; max-age=0; SameSite=None`,

    // With Secure flag (for HTTPS)
    `${cookieName}=; path=/; max-age=0; Secure; SameSite=Lax`,
    `${cookieName}=; path=/; max-age=0; Secure; SameSite=None`,

    // __Secure- prefix (Windows browsers may add this prefix)
    `__Secure-${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Lax`,
    `__Secure-${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None`,
    `__Secure-${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict`,
    `__Secure-${cookieName}=; path=/; Secure; max-age=0; SameSite=Lax`,
    `__Secure-${cookieName}=; path=/; Secure; max-age=0; SameSite=None`,
    `__Secure-${cookieName}=; path=/; Secure; max-age=0; SameSite=Strict`,
  ]);

  // Attempt all deletion strategies
  deletionStrategies.forEach((deletion) => {
    document.cookie = deletion;
  });

  // Clear from browser storage (these WILL work)
  sessionStorage.removeItem(sessionTokenCookie);
  sessionStorage.removeItem(sessionDataCookie);
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION_TOKEN);
  localStorage.removeItem(sessionTokenCookie);
  localStorage.removeItem(sessionDataCookie);
  localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION_TOKEN);

  // Check results
  const cookiesAfter = document.cookie;
  console.log('📋 Cookies after deletion attempt:', cookiesAfter);

  // Check for both standard and __Secure- prefixed cookies
  const allCookieVariants = [...cookiesToDelete, ...cookiesToDelete.map((name) => `__Secure-${name}`)];

  const stillExists = allCookieVariants.filter((name) => cookiesAfter.includes(name));
  if (stillExists.length > 0) {
    console.warn('⚠️  Some cookies still exist (likely HttpOnly):', stillExists.join(', '));
    console.info('💡 Use server-side sign-out endpoint for HttpOnly cookie deletion');
  } else {
    console.log('✅ All cookies cleared (or were already deleted by server)');
  }
};

/**
 * Legacy function for backwards compatibility
 * @deprecated Use forceDeleteAuthCookies() instead
 */
export const clearAuthSessionToken = (): void => {
  forceDeleteAuthCookies();
};
