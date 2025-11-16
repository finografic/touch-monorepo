# 🔐 Authentication & Session Management

📅 Oct 16, 2025

> **Complete guide** to authentication, session management, and route protection in the Touch Monorepo using BetterAuth with HttpOnly cookies.

---

## 📋 Table of Contents

1. [Cookie & Session Architecture](#cookie--session-architecture)
2. [Login Flow](#-login-flow)
3. [Logout Flow](#-logout-flow)
4. [Route Protection](#-route-protection)
5. [Access Control](#-access-control)

---

## 🍪 Cookie & Session Architecture

### **Your Cookie is Working Correctly!**

| Property | Value | Meaning |
|----------|-------|---------|
| **Name** | `touch-monorepo.session_token` | Auth session cookie |
| **Value** | `g7wdnZxDcUKvL...` | Session token (JWT/UUID) |
| **HttpOnly** | ✅ Checked | Can't access via JavaScript |
| **Secure** | (empty) | Not HTTPS (dev mode only) |
| **SameSite** | `Lax` | CSRF protection |
| **Expires** | `2025-11-15` | 30-day session |
| **Size** | `113 bytes` | Just the token, nothing else |

### **What's IN the Cookie**

```
g7wdnZxDcUKvLEmA7OCYSjz8VRtaPiVk.g+2BOBbvdzw2KIeSivOh2ssBiLUWEy5v+3i6/KHev9p8QM=
```

This is just a **session token** (like a UUID/hash). It contains:
- ✅ Random unique identifier
- ❌ **NO user data**
- ❌ **NO role**
- ❌ **NO email**
- ❌ **NO permissions**

### **What's IN the Database**

When the server receives this token, it looks up in the `session` table:

```sql
-- Simplified example
SELECT * FROM session WHERE token = 'g7wdnZx...'
-- Returns:
-- session_id: abc-123
-- user_id: user-456
-- created_at: 2025-01-15
-- expires_at: 2025-02-15
```

Then it fetches the user:

```sql
SELECT * FROM user WHERE id = 'user-456'
-- Returns:
-- id: user-456
-- email: admin@example.com
-- name: Admin User
-- role: admin  ← This is what you see in console.log!
-- emailVerified: false
```

### **Why You Can't See It in JavaScript**

```javascript
// ❌ This will be empty (or only show non-HttpOnly cookies)
console.log(document.cookie);
// → ""

// ✅ But the browser still SENDS it with every request
fetch('http://localhost:4040/api/auth/session', {
  credentials: 'include'
});
// → Browser automatically includes: Cookie: touch-monorepo.session_token=g7wdnZx...
```

The `HttpOnly` flag is a **security feature** that prevents:
- ❌ XSS attacks from stealing your session
- ❌ Malicious scripts from reading the cookie
- ❌ Browser extensions from accessing the cookie

But the browser **still sends the cookie automatically** with every request that has `credentials: 'include'`!

### **Architecture Diagram**

```
┌─────────────┐
│   Browser   │
│             │
│ Cookie:     │
│ session_    │
│ token =     │
│ g7wdnZx...  │  ← Just a random token
└──────┬──────┘
       │ credentials: 'include'
       │ Sends cookie automatically
       ▼
┌─────────────┐
│   Server    │
│             │
│ 1. Read     │
│    cookie   │
│             │
│ 2. Query    │
│    database │
│             │
│ SELECT *    │
│ FROM user   │
│ WHERE       │
│ session =   │
│ 'g7wdnZx'   │
│             │
│ 3. Return   │
│    { user,  │
│      role:  │
│     'admin' │← Role comes from database, not cookie!
│    }        │
└─────────────┘
```

### **Cookie vs State**

```typescript
// 🍪 COOKIE (HttpOnly - can't read with JS)
touch-monorepo.session_token = "g7wdnZx..."

// 📦 ZUSTAND STATE (in-memory, JS-accessible)
{
  user: {
    id: "user-456",
    email: "admin@example.com",
    role: "admin"  ← This is what you see in console.log!
  },
  isAuthenticated: true,
  isAdmin: true
}
```

---

## 🔐 **LOGIN Flow**

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. User enters credentials                                     │
│     email: "admin@example.com"                                  │
│     password: "password123"                                     │
│                                                                 │
│  2. signIn() called                                            │
│     ↓                                                           │
│     fetch('http://localhost:4040/api/auth/sign-in/email', {    │
│       method: 'POST',                                           │
│       credentials: 'include', ← Tell browser to accept cookies  │
│       body: { email, password }                                 │
│     })                                                          │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ POST /api/auth/sign-in/email
                       │ { email, password }
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SERVER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  3. Validate credentials                                        │
│     ↓                                                           │
│     SELECT * FROM user                                          │
│     WHERE email = 'admin@example.com'                           │
│     ↓                                                           │
│     Compare password hash                                       │
│     ↓                                                           │
│     ✅ Valid!                                                    │
│                                                                 │
│  4. Create session in database                                  │
│     ↓                                                           │
│     INSERT INTO session (                                       │
│       id: 'g7wdnZx...',           ← Random session token        │
│       user_id: 'user-456',                                      │
│       expires_at: '2025-02-15',                                 │
│       created_at: '2025-01-15'                                  │
│     )                                                           │
│                                                                 │
│  5. Set HttpOnly cookie in response                             │
│     ↓                                                           │
│     Set-Cookie: touch-monorepo.session_token=g7wdnZx...;        │
│                 HttpOnly;                                       │
│                 SameSite=Lax;                                   │
│                 Path=/;                                         │
│                 Max-Age=2592000                                 │
│                                                                 │
│  6. Return user data in JSON body                               │
│     ↓                                                           │
│     {                                                           │
│       user: {                                                   │
│         id: "user-456",                                         │
│         email: "admin@example.com",                             │
│         name: "Admin User",                                     │
│         role: "admin",        ← Role from database              │
│         emailVerified: false                                    │
│       },                                                        │
│       session: { ... }                                          │
│     }                                                           │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ Response:
                       │ • Cookie: touch-monorepo.session_token=g7wdnZx...
                       │ • Body: { user: { role: "admin", ... }, session }
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  7. Browser automatically stores cookie                         │
│     🍪 touch-monorepo.session_token = g7wdnZx...                │
│        (HttpOnly - can't access via JavaScript)                 │
│                                                                 │
│  8. Parse response JSON                                         │
│     ↓                                                           │
│     const result = await response.json();                       │
│     // result.user.role = "admin"                               │
│                                                                 │
│  9. Store in Zustand state                                      │
│     ↓                                                           │
│     set({                                                       │
│       session: result,                                          │
│       user: result.user,                                        │
│       isAuthenticated: true,                                    │
│       isAdmin: result.user.role === 'admin', ← From response   │
│       isLoading: false                                          │
│     })                                                          │
│                                                                 │
│  10. ✅ User is now logged in!                                  │
│      • Cookie stored in browser (automatic)                     │
│      • User data stored in Zustand (manual)                     │
│      • UI updates to show admin dashboard                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚪 **LOGOUT Flow**

```
┌──────────────────────────────┐
│             Client           │
│                              │
│ 1. Call /sign-out            │
│                              │
│ 2. Clear Zustand state       │
│                              │
└───────────────┬──────────────┘
                │
                ▼
┌───────────────────────────────┐
│            Server             │
│                               │
│ 1. Delete session from DB     │
│                               │
│ 2. Send Set-Cookie: Max-Age=0 │ ← Clears the cookie
│                               │
└───────────────────────────────┘
```

---

## 🔄 **Subsequent Authenticated Requests**

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT                                 │
│                                                                 │
│  User clicks "Settings" or navigates to /admin                  │
│  ↓                                                              │
│  fetch('http://localhost:4040/api/auth/session', {             │
│    credentials: 'include' ← Browser auto-sends cookie           │
│  })                                                             │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ Cookie: touch-monorepo.session_token=g7wdnZx...
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SERVER                                 │
│                                                                 │
│  1. Read cookie from request                                    │
│     token = 'g7wdnZx...'                                        │
│                                                                 │
│  2. Validate session                                            │
│     ↓                                                           │
│     SELECT * FROM session                                       │
│     WHERE id = 'g7wdnZx...'                                     │
│     AND expires_at > NOW()                                      │
│     ↓                                                           │
│     user_id = 'user-456'                                        │
│                                                                 │
│  3. Fetch user data                                             │
│     ↓                                                           │
│     SELECT * FROM user                                          │
│     WHERE id = 'user-456'                                       │
│     ↓                                                           │
│     { role: "admin", email: "admin@...", ... }                  │
│                                                                 │
│  4. Return user + session                                       │
│     ↓                                                           │
│     { user: { role: "admin", ... }, session: { ... } }          │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ { user: { role: "admin", ... } }
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT                                 │
│                                                                 │
│  User data updated in state                                     │
│  ✅ Access granted to admin routes                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔒 **Route Protection**

The app uses **dynamic route protection** based on `admin.routes.map.ts` configuration.

### **How It Works**

```
User navigates to /admin/orders
        ↓
AuthDialogGuard intercepts
        ↓
Determine user role:
  - isAuthenticated && user.role === 'admin' ? 'admin' : 'public'
        ↓
Call isRouteProtected('/admin/orders', role)
        ↓
Lookup in admin.routes.map.ts:
  {
    path: '/admin/orders',
    element: {
      public: null,     ← Public blocked
      admin: Component  ← Admin allowed
    }
  }
        ↓
If element[role] === null:
  → Show <AuthLoginDialog />
Else:
  → Render children (allow access)
```

### **Key Functions**

#### `isRouteProtected(path, role)`

```typescript
/**
 * Check if a route requires authentication based on user role
 * @param path - The route path to check
 * @param role - The user's role (defaults to 'public' if not authenticated)
 * @returns true if the route is blocked for this role, false if accessible
 */
export function isRouteProtected(path: string, role: AuthRoles = 'public'): boolean {
  const entry = getAdminEntryByPath(path);

  if (!entry) {
    // No route config found - allow access
    return false;
  }

  // Route is protected if the user's role doesn't have a component defined
  return entry.element[role] === null;
}
```

**Examples:**

```typescript
// For /admin/orders
isRouteProtected('/admin/orders', 'public')  // → true (blocked)
isRouteProtected('/admin/orders', 'admin')   // → false (allowed)

// For /admin/languages
isRouteProtected('/admin/languages', 'public')  // → false (allowed)
isRouteProtected('/admin/languages', 'admin')   // → false (allowed)
```

### **Adding a New Protected Route**

1. **Edit `admin.routes.map.ts`:**

```typescript
{
  key: 'settings',
  path: '/admin/settings',
  element: {
    public: null,           // ← Block public access
    admin: AdminSettingsPage // ← Allow admin access
  },
  hasNav: { public: false, admin: true },
  hasCard: { public: false, admin: true },
  icon: SettingsIcon,
  color: 'orange',
}
```

2. **Add route to `routes.tsx`:**

```typescript
{
  path: 'settings',
  element: <AdminSettingsPage />,
}
```

**Done!** `AuthDialogGuard` automatically protects it.

---

## 🔐 **Access Control**

The app uses a **two-tier access control system**: `'public' | 'admin'`

### **Public Access** (No login required)

- `/admin` - Dashboard
- `/admin/languages` - Language settings (basic page)
- `/admin/sounds` - Sound configuration (basic page)
- `/admin/mode` - Mode configuration (basic page)
- `/admin/translations` - Translation editor
- `/admin/ui-labels` - UI labels editor
- `/admin/maintenance` - Maintenance mode
- `/admin/slot-config` - Slot configuration
- `/admin/filter-analysis` - Filter analysis
- `/admin/relays` - Relay control (basic page)

### **Admin-Only Access** (Requires admin login)

- `/admin/orders` - Order management

### **Admin-Enhanced Views** (Public + Admin versions)

- **Languages**: Public → `AdminLanguagesBasicPage`, Admin → `AdminLanguagesPage`
- **Relays**: Public → `AdminRelaysBasicPage`, Admin → `AdminRelaysPage`

### **Protection Matrix**

| Route | Public Access | Admin Access |
|-------|---------------|--------------|
| `/admin` | ✅ Dashboard | ✅ Dashboard |
| `/admin/languages` | ✅ Basic Page | ✅ Full Page |
| `/admin/sounds` | ✅ Basic Page | ✅ Basic Page |
| `/admin/mode` | ✅ Basic Page | ❌ Hidden |
| `/admin/translations` | ✅ Full Page | ✅ Full Page |
| `/admin/ui-labels` | ✅ Full Page | ✅ Full Page |
| `/admin/maintenance` | ✅ Full Page | ❌ Hidden |
| `/admin/slot-config` | ✅ Full Page | ✅ Full Page |
| `/admin/filter-analysis` | ✅ Full Page | ✅ Full Page |
| `/admin/relays` | ✅ Basic Page | ✅ Full Page |
| `/admin/orders` | 🔒 **Login Required** | ✅ Full Page |

---

## ✅ **Summary**

You have **exactly the right setup**:

1. ✅ Cookie exists: `touch-monorepo.session_token`
2. ✅ Cookie is HttpOnly (secure, can't be read by JS)
3. ✅ Cookie contains **only a session token** (not role/data)
4. ✅ Role is stored in the **database**
5. ✅ Server validates token and fetches role on each request
6. ✅ Client receives role in API response, stores in state
7. ✅ Browser auto-sends cookie with `credentials: 'include'`
8. ✅ Route protection is dynamic and configuration-driven
9. ✅ Two-tier access control: public vs. admin

This is **industry best practice** for session-based authentication! 🎉

---

## 🔑 **Key Security Points**

1. **Cookie**: Server validates on every request
2. **Role**: Always fetched from database (can't be tampered with)
3. **Client state**: Just for UI/UX (doesn't control access)
4. **Server**: Final authority on authentication & authorization
5. **Route protection**: Single source of truth in `admin.routes.map.ts`

The reason you see the cookie in DevTools but not `document.cookie` is **by design** - it's working exactly as it should for security.

---

## 📚 **Related Documentation**

- **[BetterAuth Server Setup](../../server/src/lib/BETTER-AUTH.README.md)** - Server-side configuration
- **[Auth Routes Documentation](../../server/src/routes/auth/BETTER-AUTH.routes.md)** - API endpoints reference
- **[Auth Dialog Guard](../components/Dialog/dialogs/AuthLoginDialog/AuthDialogGuard.tsx)** - Route protection implementation
