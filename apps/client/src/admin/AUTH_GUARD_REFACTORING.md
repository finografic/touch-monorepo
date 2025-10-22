# Auth Guard Refactoring - Dynamic Route Protection

## 🎯 Overview

Removed the redundant `ProtectedAdminRoutes` component and consolidated all route protection logic into `AuthDialogGuard`, which now uses **dynamic route protection** based on the `admin.routes.map.ts` configuration.

---

## 📊 Changes Summary

### **Before** - Dual Protection System

```
routes.tsx
  └── AdminLayout
      └── ProtectedAdminRoutes ❌ (React Router guard)
          └── Admin Pages
              └── AuthDialogGuard ❌ (Dialog-based guard)

Issues:
- Two separate protection mechanisms
- Static path checking (location.pathname.includes('/admin'))
- Redundant logic in ProtectedAdminRoutes
- Shows UnauthorizedPage instead of login dialog
```

### **After** - Single Dynamic Guard

```
routes.tsx
  └── AdminLayout
      └── Admin Pages (no wrapper needed)
          └── AuthDialogGuard ✅ (Single source of truth)

Benefits:
- Single protection mechanism
- Dynamic role-based checking via admin.routes.map.ts
- Consistent login dialog UX
- No duplicate authorization logic
```

---

## 🔧 Files Modified

### 1. **`admin/config/admin.routes.selectors.ts`** - New Helper Functions

Added three new functions for dynamic route protection:

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

**How it works:**
- Looks up the route in `ADMIN_ENTRIES`
- Checks if `element[role]` is `null`
- Returns `true` if blocked, `false` if accessible

**Examples:**

```typescript
// For /admin/orders
isRouteProtected('/admin/orders', 'public')  // → true (blocked)
isRouteProtected('/admin/orders', 'admin')   // → false (allowed)

// For /admin/languages
isRouteProtected('/admin/languages', 'public')  // → false (allowed)
isRouteProtected('/admin/languages', 'admin')   // → false (allowed)
```

#### `getProtectedAdminRoutes()`

```typescript
/**
 * Get all admin route paths that require admin authentication
 * (paths where public: null and admin: Component)
 */
export function getProtectedAdminRoutes(): string[] {
  return ADMIN_ENTRIES
    .filter((entry) => entry.element.public === null && entry.element.admin !== null)
    .map((entry) => entry.path);
}
```

**Returns:**

```typescript
['/admin/orders']  // Currently only orders requires admin auth
```

---

### 2. **`components/Dialog/dialogs/AuthLoginDialog/AuthDialogGuard.tsx`** - Dynamic Protection

#### Before - Static Path Checking

```typescript
const deferToLogin = useMemo(
  () => location.pathname.includes('/admin') && !isAuthenticated,
  [location.pathname, isAuthenticated],
);
```

**Issues:**
- Blocks ALL `/admin` routes if not authenticated
- Doesn't respect role-based access (public vs. admin)
- No awareness of `admin.routes.map.ts` configuration

#### After - Dynamic Role-Based Checking

```typescript
const deferToLogin = useMemo(() => {
  // Special case: Always allow /admin dashboard (index route)
  if (location.pathname === '/admin') {
    return false;
  }

  // Determine user role (admin if authenticated as admin, otherwise public)
  const userRole = isAuthenticated && user?.role === 'admin' ? 'admin' : 'public';

  // Check if this route is protected for this role
  return isRouteProtected(location.pathname, userRole);
}, [location.pathname, isAuthenticated, user?.role]);
```

**Benefits:**
- ✅ Respects role-based access from `admin.routes.map.ts`
- ✅ Public users can access public admin routes
- ✅ Admin routes show login dialog only when needed
- ✅ Single source of truth for route protection

---

### 3. **`routes/routes.tsx`** - Removed ProtectedAdminRoutes Wrapper

#### Before

```typescript
import { ProtectedAdminRoutes } from './auth/ProtectedAdminRoutes';

{
  path: '/admin',
  element: <AdminLayout />,
  children: [
    {
      element: <ProtectedAdminRoutes />,  // ❌ Wrapper no longer needed
      children: [
        { index: true, element: <AdminDashboardPage /> },
        { path: 'orders', element: <AdminOrdersPage /> },
        // ... more routes
      ],
    },
  ],
}
```

#### After

```typescript
// No import needed

{
  path: '/admin',
  element: <AdminLayout />,
  children: [
    { index: true, element: <AdminDashboardPage /> },
    { path: 'orders', element: <AdminOrdersPage /> },
    { path: 'translations', element: <AdminTranslationsPage /> },
    // ... more routes - all directly accessible
  ],
}
```

**Benefits:**
- ✅ Cleaner route structure (one less level of nesting)
- ✅ Protection handled by `AuthDialogGuard` at layout level
- ✅ No need for `<Outlet />` wrapper component

---

## 🔒 How Route Protection Works Now

### Flow Diagram

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

---

## ✨ Benefits of This Approach

| Benefit | Description |
|---------|-------------|
| **Single Source of Truth** | All route protection defined in `admin.routes.map.ts` |
| **Dynamic & Flexible** | Add/remove protected routes by editing config only |
| **Better UX** | Login dialog instead of "Unauthorized" page |
| **Less Code** | Removed entire `ProtectedAdminRoutes` component |
| **Type-Safe** | Uses TypeScript `AuthRoles` type throughout |
| **Clearer Intent** | Route config clearly shows who can access what |

---

## 🎯 Example: Adding a New Protected Route

### Before (Old System)

1. Add route to `routes.tsx` inside `ProtectedAdminRoutes` children
2. Add check in `ProtectedAdminRoutes.tsx` logic
3. Add to `AuthDialogGuard` path checking
4. Update multiple files

### After (New System)

1. **Only edit `admin.routes.map.ts`:**

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

## 🚀 Result

### **Protection Matrix** (Auto-Generated from Config)

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

## 📝 Summary

### Removed Files

- ✅ `routes/auth/ProtectedAdminRoutes.tsx` - No longer needed

### Modified Files

- ✅ `admin/config/admin.routes.selectors.ts` - Added dynamic helpers
- ✅ `components/Dialog/dialogs/AuthLoginDialog/AuthDialogGuard.tsx` - Dynamic role checking
- ✅ `routes/routes.tsx` - Removed wrapper, flattened structure

### Key Improvements

- ✅ **Single source of truth** - All protection logic in `admin.routes.map.ts`
- ✅ **Dynamic & maintainable** - Add/change routes without touching guard logic
- ✅ **Better UX** - Login dialog instead of error page
- ✅ **Cleaner code** - Less nesting, less duplication
- ✅ **Type-safe** - Full TypeScript support throughout

**The authentication system is now simpler, more maintainable, and entirely driven by configuration!** 🎉

