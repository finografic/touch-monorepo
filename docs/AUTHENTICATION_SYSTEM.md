# Authentication System Documentation

## Overview

The Touch Monorepo now includes a comprehensive authentication system built with BetterAuth, providing role-based access control for both frontend and admin sections. The system features dual-themed login pages, protected routes, and seamless session management.

## 🏗️ Architecture

### Technology Stack

- **Backend**: BetterAuth with Drizzle ORM
- **Frontend**: React with TypeScript, Emotion CSS
- **Database**: SQLite with role-based user schema
- **Session Management**: HTTP-only cookies with secure defaults

### Key Components

```
apps/
├── client/
│   ├── src/
│   │   ├── providers/AuthProvider/     # Authentication context
│   │   ├── components/
│   │   │   ├── LoginForm/             # Reusable login component
│   │   │   ├── ProtectedRoute/        # Route protection
│   │   │   └── Input/                 # Styled input component
│   │   ├── pages/
│   │   │   ├── LoginPage/             # Dark theme login
│   │   │   ├── AdminLoginPage/        # Light theme login
│   │   │   ├── UnauthorizedPage/      # Access denied page
│   │   │   └── AuthTestPage/          # Debug/testing page
│   │   └── lib/auth-client.ts         # BetterAuth client
└── server/
    └── src/
        ├── lib/auth.ts                # BetterAuth configuration
        ├── db/schemas/auth_user.schema.ts  # User schema with roles
        └── routes/auth/               # Authentication endpoints
```

## 🔐 Authentication Features

### User Roles

- **`user`**: Standard user access
- **`admin`**: Administrative access to admin panel

### Session Management

- **Duration**: 30 days with 24-hour update age
- **Security**: HTTP-only cookies with secure defaults
- **Persistence**: Automatic session restoration on page reload

### Route Protection

- **Public Routes**: Main app, login pages
- **Protected Routes**: Dashboard (requires authentication)
- **Admin Routes**: All `/admin/*` routes (requires admin role)

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
  plugins: [
    customSession(async ({ user, session }) => {
      return {
        user: {
          ...user,
          role: user.role || 'user', // Include role in session
        },
        session,
      };
    }),
  ],
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
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={`${redirectTo}?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- SQLite database (automatically created)
- BetterAuth packages installed

### Installation

The authentication system is already integrated into the monorepo. No additional installation required.

### Database Setup

```bash
# Run migrations (already done)
cd apps/server
pnpm drizzle-kit migrate

# Create admin user (if needed)
npx tsx src/scripts/create-new-admin.ts
```

### Default Admin Credentials

- **Email**: `newadmin@example.com`
- **Password**: `admin123`
- **Role**: `admin`

## 📱 Usage Examples

### Basic Authentication Check

```typescript
import { useAuth } from 'providers/AuthProvider/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      {isAdmin && <p>You have admin privileges</p>}
      <button onClick={signOut}>Logout</button>
    </div>
  );
};
```

### Protected Route Usage

```typescript
// Regular protected route
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// Admin-only route
<ProtectedRoute requireAdmin={true} redirectTo="/admin/login">
  <AdminLayout />
</ProtectedRoute>
```

### Custom Login Form

```typescript
import { LoginForm } from 'components/LoginForm/LoginForm';

const CustomLogin = () => (
  <LoginForm
    variant="dark" // or "light"
    title="Custom Login"
    subtitle="Enter your credentials"
    showSignUp={true}
    onSuccess={() => console.log('Login successful!')}
  />
);
```

## 🔧 Configuration

### Environment Variables

```bash
# apps/server/.env.development
NODE_ENV=development
AUTH_SECRET=your-secret-key-here
```

### Customization Options

#### Session Duration

```typescript
// apps/server/src/lib/auth.ts
session: {
  expiresIn: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60,       // 24 hours
}
```

#### Password Requirements

```typescript
emailAndPassword: {
  minPasswordLength: 8,
  maxPasswordLength: 32,
}
```

#### Cookie Settings

```typescript
advanced: {
  useSecureCookies: env.NODE_ENV === 'production',
  cookies: {
    session_token: {
      attributes: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      },
    },
  },
}
```

## 🧪 Testing

### Test Routes

- **`/auth-test`**: Authentication state debug page
- **`/login`**: Frontend login page
- **`/admin/login`**: Admin login page
- **`/unauthorized`**: Access denied page

### API Testing

```bash
# Test login
curl -X POST http://localhost:4040/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"newadmin@example.com","password":"admin123"}'

# Test session
curl http://localhost:4040/api/auth/session \
  -b cookies.txt

# Test logout
curl -X POST http://localhost:4040/api/auth/signout \
  -b cookies.txt
```

### Database Queries

```bash
# Check admin user
cd apps/server
npx tsx src/scripts/check-new-admin.ts

# Create new admin
npx tsx src/scripts/create-new-admin.ts
```

## 🔒 Security Features

### Session Security

- **HTTP-only Cookies**: Prevents XSS attacks
- **Secure Cookies**: HTTPS-only in production
- **SameSite**: Lax policy for CSRF protection
- **Automatic Expiration**: Sessions expire after 30 days

### Password Security

- **Hashing**: BetterAuth handles secure password hashing
- **Length Requirements**: 8-32 character minimum/maximum
- **No Plain Text**: Passwords never stored in plain text

### Route Protection

- **Server-side Validation**: All protected routes validated server-side
- **Client-side Guards**: Additional client-side protection
- **Role-based Access**: Fine-grained permission control

## 🐛 Troubleshooting

### Common Issues

#### Session Not Persisting

- Check cookie settings in browser dev tools
- Verify `AUTH_SECRET` environment variable
- Ensure HTTPS in production

#### Admin Role Not Working

- Verify user has `role: 'admin'` in database
- Check session includes role field
- Restart server after schema changes

#### Login Fails

- Verify user exists in database
- Check password requirements
- Review server logs for errors

### Debug Commands

```bash
# Check user in database
cd apps/server
npx tsx src/scripts/check-new-admin.ts

# Test API endpoints
curl -v http://localhost:4040/api/auth/session

# Check browser cookies
# Open DevTools > Application > Cookies
```

## 🔄 Future Enhancements

### Potential Improvements

1. **BetterAuth Admin Plugin**: Integrate official admin plugin
2. **OAuth Providers**: Add Google, GitHub, etc.
3. **Two-Factor Authentication**: Implement 2FA
4. **Password Reset**: Email-based password recovery
5. **User Management**: Admin interface for user management
6. **Audit Logging**: Track authentication events
7. **Rate Limiting**: Prevent brute force attacks

### BetterAuth Admin Plugin Integration

```typescript
// Future implementation
import { adminPlugin } from 'better-auth/plugins/admin';

export const auth = betterAuth({
  plugins: [
    adminPlugin({
      // Admin plugin configuration
    }),
    // ... other plugins
  ],
});
```

## 📚 Additional Resources

### Documentation

- [BetterAuth Documentation](https://www.better-auth.com/docs)
- [BetterAuth Admin Plugin](https://www.better-auth.com/docs/plugins/admin)
- [BetterAuth Plugins](https://www.better-auth.com/docs/concepts/plugins)

### Related Files

- `apps/client/src/providers/AuthProvider/AuthContext.tsx` - Main auth context
- `apps/server/src/lib/auth.ts` - BetterAuth configuration
- `apps/server/src/db/schemas/auth_user.schema.ts` - User schema
- `apps/client/src/components/ProtectedRoute/ProtectedRoute.tsx` - Route protection

---

**Last Updated**: July 20, 2025
**Version**: 1.0.0
**Maintainer**: Touch Monorepo Team
