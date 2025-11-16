# Authentication System Documentation

📅 Jul 20, 2025

The Touch Monorepo now includes a comprehensive authentication system built with BetterAuth, providing secure authentication for both frontend and admin sections. The system features dual-themed login pages, protected routes, and seamless session management.

## 🚀 Features

- **BetterAuth Integration**: Modern authentication with email/password
- **Dual Login Pages**: Frontend and admin-specific login interfaces
- **Protected Routes**: Role-based access control (to be implemented with BetterAuth plugins)
- **Session Management**: HTTP-only cookies with secure session handling
- **Database**: SQLite with user schema
- **TypeScript**: Full type safety throughout the system

## 📁 File Structure

```
apps/
├── client/src/
│   ├── auth/
│   │   ├── AuthContext.tsx          # Authentication context
│   │   └── AuthContext.types.ts     # Auth type definitions
│   ├── components/
│   │   ├── LoginForm/               # Reusable login component
│   │   └── ProtectedRoute/          # Route protection component
│   ├── pages/
│   │   ├── LoginPage/               # Frontend login page
│   │   └── AdminPages/
│   │       └── AdminLoginPage/      # Admin login page
│   ├── routes/
│   │   └── routes.tsx               # Route definitions with protection
│   └── lib/
│       └── auth-client.ts           # BetterAuth client configuration
└── server/src/
    ├── lib/
    │   └── auth.ts                  # BetterAuth server configuration
    ├── routes/
    │   └── auth/
    │       └── auth.routes.ts       # Authentication API routes
    └── db/
        └── schemas/
            └── auth_user.schema.ts  # User schema
```

## 🔐 Route Protection

### Route Categories

- **Public Routes**: Main app, login pages
- **Protected Routes**: Dashboard (requires authentication)
- **Admin Routes**: All `/admin/*` routes (requires admin role - to be implemented)

## 🎨 User Interface

### Login Pages

#### Frontend Login (`/login`)

- **Theme**: Dark theme matching main app
- **Features**: Sign-in and sign-up capabilities
- **Styling**: Consistent with existing design system
- **Redirect**: Returns to original destination after login

#### Admin Login (`/admin/login`)

- **Theme**: Light theme for professional admin interface
- **Features**: Sign-in only (no sign-up)
- **Styling**: Clean, minimal design
- **Redirect**: Returns to admin dashboard after login

### Admin Layout Enhancements

- **User Info**: Displays welcome message with user name
- **Logout Button**: Prominent logout functionality
- **Session Status**: Real-time authentication state

## 🛠️ Implementation Details

### Database Schema

```sql
-- Enhanced auth_user table
CREATE TABLE auth_user (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  emailVerified INTEGER NOT NULL,
  image TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
```

### BetterAuth Configuration

```typescript
// apps/server/src/lib/auth.ts
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: { user, account, session, verification },
  }),
  // Role functionality will be implemented using BetterAuth plugins
  // ... other configuration
});
```

### Protected Route Component

```typescript
// apps/client/src/components/ProtectedRoute/ProtectedRoute.tsx
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

## 🔧 API Endpoints

### Authentication Routes

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - User logout

### Example Usage

```bash
# Login
curl -X POST http://localhost:4040/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Signup
curl -X POST http://localhost:4040/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "new@example.com", "password": "password123", "name": "New User"}'
```

## 🎯 User Management

### Default Users

The system includes several default users for testing:

- **Admin User**: `admin@example.com` / `admin123`
- **New Admin**: `newadmin@example.com` / `admin123`
- **Regular User**: `user@example.com` / `user123`
- **Test User**: `test@example.com` / `test123`

### User Creation

Users can be created through:
- **Signup API**: `POST /api/auth/signup`
- **BetterAuth Admin Interface**: Future implementation
- **Database Seeding**: For development/testing

## 🔒 Security Features

- **HTTP-Only Cookies**: Secure session storage
- **CSRF Protection**: Built into BetterAuth
- **Password Hashing**: Automatic password security
- **Session Expiration**: Configurable session timeouts
- **Email Verification**: Configurable (currently disabled for development)

## 🚨 Troubleshooting

### Common Issues

#### Login Not Working

- Verify server is running on port 4040
- Check browser console for errors
- Ensure cookies are enabled
- Verify email/password combination

#### Session Not Persisting

- Check cookie settings in browser
- Verify CORS configuration
- Ensure HTTPS in production

#### Admin Access Issues

- Role functionality will be implemented with BetterAuth plugins
- Currently all authenticated users have basic access
- Admin routes will be protected when role system is implemented

## 🔮 Future Enhancements

- **Role-Based Access**: Implementation using BetterAuth organization plugin
- **Email Verification**: Enable email verification for production
- **Password Reset**: Implement password reset functionality
- **OAuth Integration**: Add social login options
- **Admin Dashboard**: Enhanced user management interface
- **Audit Logging**: Track authentication events
