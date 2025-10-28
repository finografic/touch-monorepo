import { AUTH_COOKIE_NAME } from 'providers/AuthProvider/AuthContext';

/**
 * Clears the auth session token cookie
 * This removes the cookie set by Better Auth during login
 *
 * NOTE: Multiple variations are set to handle edge cases across browsers/OSes
 * CRITICAL: Cookie deletion requires exact matching of attributes
 */
export const clearAuthSessionToken = (): void => {
  const cookieName = AUTH_COOKIE_NAME;

  console.log('🧹 Starting cookie deletion...', { cookieName, hostname: window.location.hostname });
  console.log('📋 Current cookies:', document.cookie);

  // Try the most common deletion methods
  const hostname = window.location.hostname;

  const deletions = [
    `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`,
    `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=None`,
    `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict`,
    `${cookieName}=; path=/; SameSite=Lax; domain=${hostname}`,
    `${cookieName}=; path=/; SameSite=None; domain=${hostname}`,
    `${cookieName}=; path=/; SameSite=Strict; domain=${hostname}`,
    `${cookieName}=; path=/; max-age=0; SameSite=Lax`,
    `${cookieName}=; path=/; max-age=0; SameSite=None`,
    `${cookieName}=; path=/; max-age=0; SameSite=Strict`,
  ];

  const secureDeletions = [
    `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Lax`,
    `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None`,
    `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict`,
    `${cookieName}=; path=/; Secure; max-age=0; SameSite=Lax`,
    `${cookieName}=; path=/; Secure; max-age=0; SameSite=None`,
    `${cookieName}=; path=/; Secure; max-age=0; SameSite=Strict`,
  ];

  const __SecureDeletions = [
    `__Secure-${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Lax`,
    `__Secure-${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None`,
    `__Secure-${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict`,
    `__Secure-${cookieName}=; path=/; Secure; max-age=0; SameSite=Lax`,
    `__Secure-${cookieName}=; path=/; Secure; max-age=0; SameSite=None`,
    `__Secure-${cookieName}=; path=/; Secure; max-age=0; SameSite=Strict`,
  ];

  [...deletions, ...secureDeletions, ...__SecureDeletions].forEach((cmd) => {
    document.cookie = cmd;
  });

  sessionStorage.removeItem(cookieName);

  const cookiesAfter = document.cookie;
  console.log('📋 Cookies after deletion:', cookiesAfter);

  if (cookiesAfter.includes(cookieName)) {
    console.error('❌ Cookie deletion FAILED! Cookie still exists.');
    console.error(
      '🔍 Remaining cookie:',
      cookiesAfter.split(';').find((c) => c.includes(cookieName)),
    );
  } else {
    console.log('✅ Cookie successfully deleted!');
  }
};
