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
  const hostname = window.location.hostname;
  const COOKIES = process.env.COOKIES;
  const cookiePrefix = COOKIES.COOKIE_PREFIX; // "touch-monorepo"

  // All possible cookie name variations to delete
  const cookieVariations = [
    // Direct names from env
    COOKIES.TOKEN_COOKIE,
    COOKIES.DATA_COOKIE,
    // With __Secure- prefix (Windows/production)
    `__Secure-${COOKIES.TOKEN_COOKIE}`,
    `__Secure-${COOKIES.DATA_COOKIE}`,
    // With __Host- prefix (some browsers)
    `__Host-${COOKIES.TOKEN_COOKIE}`,
    `__Host-${COOKIES.DATA_COOKIE}`,
    // Just the suffix (in case prefix is wrong)
    'session_token',
    'session_data',
    'auth_token',
    // With prefix variations
    `${cookiePrefix}.session_token`,
    `${cookiePrefix}.session_data`,
    `__Secure-${cookiePrefix}.session_token`,
    `__Secure-${cookiePrefix}.session_data`,
    `__Host-${cookiePrefix}.session_token`,
    `__Host-${cookiePrefix}.session_data`,
  ];

  // All possible deletion attribute combinations
  const deletionAttributes = [
    'path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC',
    'path=/; max-age=0',
    `path=/; domain=${hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC`,
    `path=/; domain=.${hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC`,
    'path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure',
    'path=/; max-age=0; Secure',
    'path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax',
    'path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=None',
    'path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict',
    'path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Lax',
    'path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None',
    'path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict',
    'path=/; max-age=0; Secure; SameSite=Lax',
    'path=/; max-age=0; Secure; SameSite=None',
    'path=/; max-age=0; Secure; SameSite=Strict',
  ];

  // Try every combination of cookie name + deletion attributes
  const deletionStrategies: string[] = [];
  cookieVariations.forEach((cookieName) => {
    deletionAttributes.forEach((attrs) => {
      deletionStrategies.push(`${cookieName}=; ${attrs}`);
    });
  });

  // Attempt all deletion strategies
  deletionStrategies.forEach((deletion) => {
    document.cookie = deletion;
  });

  // Clear from browser storage (these WILL work)
  cookieVariations.forEach((cookieName) => {
    sessionStorage.removeItem(cookieName);
    localStorage.removeItem(cookieName);
  });

  // Check results
  const cookiesAfter = document.cookie;

  // Check if any auth-related cookies still exist
  const authCookiePatterns = [cookiePrefix, 'session', 'auth', '__Secure-', '__Host-'];
  const remainingAuthCookies = cookiesAfter
    .split(';')
    .map((c) => c.trim())
    .filter((c) => authCookiePatterns.some((pattern) => c.includes(pattern)));

  if (remainingAuthCookies.length > 0) {
    console.warn('%c⚠️  Some cookies still exist (likely HttpOnly):', 'color:orange', remainingAuthCookies);
  }
};

/**
 * Server-side nuclear cookie deletion
 *
 * This calls the server's /api/auth/clear-all-cookies endpoint which uses
 * Set-Cookie headers to delete HttpOnly cookies (which JavaScript cannot access).
 *
 * USE CASES:
 * - When sign-out fails but cookies remain
 * - Before login when corrupted cookies exist
 * - Development/debugging to force clean state
 * - When __Secure- or __Host- prefixed cookies persist
 */
export const clearAllAuthCookiesServer = async (): Promise<boolean> => {
  try {
    console.log('%c🧨 [NUCLEAR] Calling server to delete all auth cookies...', 'color:grey');

    const { getApiBaseUrl } = await import('../api/fetch.client');
    const response = await fetch(`${getApiBaseUrl()}/api/auth/clear-all-cookies`, {
      method: 'POST',
      credentials: 'include', // Include cookies in request
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Also run client-side cleanup for non-HttpOnly cookies
      forceDeleteAuthCookies();
      return true;
    } else {
      console.error('❌ Server cookie deletion failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Server cookie deletion error:', error);
    // Fallback to client-side cleanup
    forceDeleteAuthCookies();
    return false;
  }
};
