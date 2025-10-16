# 🔐 Authentication Flow Diagrams

> **Visual guide** to login, logout, and session management flows in the Touch Monorepo.
>
> For understanding **cookies and sessions**, see [README.auth.md](./README.auth.md)

---

# 🚪 **LOGOUT Flow**

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

# 🔐 **LOGIN Flow Diagram**

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

## 🔑 **Key Points**

### **Cookie Storage** (Steps 5 & 7)

- **Server**: Sets cookie via `Set-Cookie` header
- **Browser**: Automatically stores cookie (no JS needed)
- **Content**: Only session token `g7wdnZx...` (NOT user data, NOT role)
- **Security**: `HttpOnly` prevents JavaScript access

### **Role/User Data** (Steps 6 & 9)

- **Server**: Returns user object in JSON response body
- **Client**: Parses JSON and stores in Zustand state
- **Location**: `role: "admin"` comes from **database**, not cookie
- **Access**: Available in React via `useAuth()` hook

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

## 🎯 **Security Model**

1. **Cookie**: Server validates on every request
2. **Role**: Always fetched from database (can't be tampered with)
3. **Client state**: Just for UI/UX (doesn't control access)
4. **Server**: Final authority on authentication & authorization

This is why your console logs show `role: "admin"` even though the cookie doesn't contain it! 🎉

