# Cookie Deletion Fix for __Secure- Cookies

## Problem

On Windows 10 machines running the application over HTTPS, cookies were prefixed with `__Secure-`. These cookies **cannot be deleted** without including the `Secure` attribute in the deletion command.

### Why This Happens

According to [RFC 6265 Section 4.1.2.7](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.2.7) and [Chrome's cookie handling](https://developer.chrome.com/docs/privacy-sandbox/3pcd/):

1. **`__Secure-` prefix** - Browsers (especially Chrome on Windows) automatically prefix cookies with `__Secure-` when they have the `Secure` attribute.
2. **Mandatory Secure attribute** - Cookies with the `__Secure-` prefix MUST be deleted with the `Secure` attribute present.
3. **Deletion fails silently** - If you don't include `Secure`, the browser ignores the deletion command (no error thrown).

### Evidence from Screenshots

- Screenshot 1: Cookie name shows `__Secure-touch-monorepo-production.session_token` with `Secure: ✓` checked
- Screenshot 2: Cookie shows `HttpOnly: ✓`, `Secure: ✓`, `SameSite: Lax`
- Screenshot 3: Cookie shows `Secure` checkbox **unchecked** (local development without HTTPS)

## Solution

### 1. Updated Client-Side Cookie Deletion (`src/utils/auth.utils.ts`)

Added `Secure` attribute to all cookie deletion attempts:

```typescript
export const clearAuthSessionToken = (): void => {
  const cookieName = STORAGE_KEYS.AUTH_COOKIE_NAME;
  const secureCookieName = `__Secure-${cookieName}`;

  // Clear regular cookies (development/localhost)
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`;
  // ... more variations

  // CRITICAL: Clear secure cookies (production/HTTPS)
  // Secure cookies MUST include the Secure attribute to be deleted
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Lax;`;
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; Secure; SameSite=Lax;`;
  document.cookie = `${cookieName}=; max-age=0; path=/; Secure; SameSite=Lax;`;

  // Also handle browser auto-prefixed __Secure- cookies
  document.cookie = `${secureCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Lax;`;
  // ... more variations

  console.log(`Attempted to clear cookies: ${cookieName} and ${secureCookieName}`);
};
```

### 2. Updated AuthContext to Call Cookie Cleanup

Uncommented the `clearAuthSessionToken()` call in the `signOut` action:

```typescript
if (result && result.data.success) {
  set({ ...defaultValue });
  clearAuthSessionToken(); // Clear session cookie (now handles __Secure- cookies)
  return { success: true, message: 'Signed out successfully' };
}
```

### 3. Updated Server Configuration (`apps/server/src/lib/auth.ts`)

Changed `SameSite` from `'none'` to `'lax'` for consistency across environments:

```typescript
cookies: {
  sessionToken: {
    name: 'auth_token',
    attributes: {
      httpOnly: true,
      sameSite: env.NODE_ENV === 'production' ? 'lax' : 'lax', // Use 'lax' for consistency
      secure: env.NODE_ENV === 'production', // HTTPS only in production
      path: '/',
    },
  },
},
```

## How It Works

### Cookie Deletion Strategy

1. **Try regular deletion** - First attempts to delete without `Secure` (works in dev)
2. **Try secure deletion** - Includes `Secure` attribute (works in production)
3. **Try with domain** - Includes domain attribute for subdomains
4. **Try browser prefixes** - Handles `__Secure-` prefix that Chrome adds
5. **Log attempts** - Console logs show which cookies were targeted

### Multiple Variations

The deletion tries multiple combinations to handle:
- Different browsers (Chrome adds `__Secure-` prefix automatically)
- Different environments (dev vs production)
- Different cookie attributes (path, domain, Secure, SameSite)
- Edge cases (Windows 10, older browsers, CORS issues)

## Testing

### Development (Localhost)

- Cookie name: `touch-monorepo.session_token`
- No `Secure` attribute
- Deletion works with regular commands

### Production (HTTPS)

- Cookie name: `__Secure-touch-monorepo.session_token`
- Has `Secure` attribute
- Deletion **requires** `Secure` attribute

### Verification

1. Login on Windows 10 machine over HTTPS
2. Check DevTools → Application → Cookies
3. Verify cookie name starts with `__Secure-`
4. Log out
5. Check DevTools → Cookies (should be empty)
6. Check console log: "Attempted to clear cookies: ..."

## References

- [Better Auth Session Management](https://www.better-auth.com/docs/concepts/session-management)
- [Better Auth Plugins](https://www.better-auth.com/docs/concepts/plugins)
- [RFC 6265 - HTTP State Management Mechanism](https://datatracker.ietf.org/doc/html/rfc6265)
- [Chrome's Cookie Handling](https://developer.chrome.com/docs/privacy-sandbox/3pcd/)

