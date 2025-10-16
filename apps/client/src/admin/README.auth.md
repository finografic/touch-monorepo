# 🔐 Authentication & Session Management

> **Overview**: This document explains how cookies, sessions, and user authentication work in this project using BetterAuth with HttpOnly cookies.
>
> For detailed **login/logout flow diagrams**, see [README.auth.login-logout.md](./README.auth.login-logout.md)

---

## ✅ **Your Cookie is Working Correctly!**

Looking at your screenshot:

| Property | Value | Meaning |
|----------|-------|---------|
| **Name** | `touch-monorepo.session_token` | Your auth cookie |
| **Value** | `g7wdnZxDcUKvL...` | Session token (JWT/UUID) |
| **HttpOnly** | ✅ Checked | Can't access via JavaScript |
| **Secure** | (empty) | Not HTTPS (dev mode only) |
| **SameSite** | `Lax` | CSRF protection |
| **Expires** | `2025-11-15` | 30-day session |
| **Size** | `113 bytes` | Just the token, nothing else |

---

## 🔐 **How It Works (You Got It Right!)**

### **What's IN the cookie:**

```
g7wdnZxDcUKvLEmA7OCYSjz8VRtaPiVk.g+2BOBbvdzw2KIeSivOh2ssBiLUWEy5v+3i6/KHev9p8QM=
```

This is just a **session token** (like a UUID/hash). It contains:
- ✅ Random unique identifier
- ❌ **NO user data**
- ❌ **NO role**
- ❌ **NO email**
- ❌ **NO permissions**

### **What's IN the database:**

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

---

## 🎯 **Why You Can't See It in JavaScript**

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

---

## 📊 **Your Architecture (Correct!)**

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

---

## 🔍 **What You're Seeing in Console**

Those console.logs showing `role: 'admin'` are coming from the **API response**, not the cookie:

```typescript
// In AuthContext.ts
const response = await fetch('http://localhost:4040/api/auth/sign-in/email', {
  credentials: 'include',
  body: JSON.stringify({ email, password }),
});

const result = await response.json();
console.log(result);
// ← This shows: { user: { role: 'admin', ... } }
```

The server:
1. Validated your credentials
2. Created a session in the database
3. Set the cookie with the session token
4. **Returned the full user object** (including role) in the JSON response
5. Your client stores this in Zustand state

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

This is **industry best practice** for session-based authentication! 🎉

The reason you see the cookie in DevTools but not `document.cookie` is **by design** - it's working exactly as it should for security.

---

## 📚 **Related Documentation**

- **[Login/Logout Flow Diagrams](./README.auth.login-logout.md)** - Detailed visual flows for authentication
- **[BetterAuth Server Setup](../../server/src/lib/BETTER-AUTH.README.md)** - Server-side configuration
- **[Auth Routes Documentation](../../server/src/routes/auth/BETTER-AUTH.routes.md)** - API endpoints reference
