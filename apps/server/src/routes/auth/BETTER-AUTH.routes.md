# 🔐 Better Auth API Routes Documentation

This document outlines all available Better Auth endpoints in your Hono.js server, formatted in an OpenAPI-style documentation.

## 📋 **Base URL**

```
http://localhost:4040/api/auth
```

## 🔧 **Authentication**

All endpoints use session-based authentication via HTTP-only cookies (`auth_token`).

---

## 📚 **Available Endpoints**

### 1. **Session Management**

#### `GET /api/auth/session`

**Description:** Retrieve current user session and user data

**Headers:**

```http
Cookie: auth_token=<session_token>
```

**Response (Authenticated):**

```json
{
  "user": {
    "id": "71892e7b-64d0-4bb4-9241-0e7919adc560",
    "email": "admin@example.com",
    "name": "Admin User",
    "image": null,
    "emailVerified": false,
    "createdAt": "2025-10-03T21:06:57.000Z",
    "updatedAt": "2025-10-03T21:06:57.000Z"
  },
  "session": {
    "id": "4f86e668-6e74-4728-9484-203374f27eb3",
    "userId": "71892e7b-64d0-4bb4-9241-0e7919adc560",
    "expiresAt": "2025-11-02T23:17:00.000Z",
    "token": "aR713AQscoNO9olCMryQTMem98EPgqTE",
    "createdAt": "2025-10-03T23:17:00.000Z",
    "updatedAt": "2025-10-03T23:17:00.000Z",
    "ipAddress": "",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)..."
  }
}
```

**Response (Not Authenticated):**

```json
{
  "user": null,
  "session": null
}
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

### 2. **Authentication**

#### `POST /api/auth/sign-in/email`

**Description:** Sign in with email and password

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (Success):**

```json
{
  "redirect": false,
  "token": "gDI9QLhnNaMpIdLA3DIpF3bdwF3vjkGj",
  "user": {
    "id": "71892e7b-64d0-4bb4-9241-0e7919adc560",
    "email": "admin@example.com",
    "name": "Admin User",
    "image": null,
    "emailVerified": false,
    "createdAt": "2025-10-03T21:06:57.000Z",
    "updatedAt": "2025-10-03T21:06:57.000Z"
  }
}
```

**Response Headers:**

```http
Set-Cookie: touch-monorepo.session_token=<token>; Max-Age=2592000; Path=/; HttpOnly; SameSite=Lax
```

**Status Codes:**
- `200 OK` - Sign in successful
- `400 Bad Request` - Invalid credentials
- `401 Unauthorized` - Authentication failed

---

#### `POST /api/auth/sign-up/email`

**Description:** Register new user with email and password

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User"
}
```

**Response (Success):**

```json
{
  "token": "4f5nKSEOPG4bMPneAKzlp56ai0sVMNwT",
  "user": {
    "id": "646c10c2-bc0c-49b0-8ec0-ef9bb10fb6f9",
    "email": "newuser@example.com",
    "name": "New User",
    "image": null,
    "emailVerified": false,
    "createdAt": "2025-10-03T23:34:16.000Z",
    "updatedAt": "2025-10-03T23:34:16.000Z"
  }
}
```

**Response Headers:**

```http
Set-Cookie: touch-monorepo.session_token=<token>; Max-Age=2592000; Path=/; HttpOnly; SameSite=Lax
```

**Status Codes:**
- `200 OK` - Registration successful
- `400 Bad Request` - Invalid input or user already exists
- `422 Unprocessable Entity` - Validation error

---

#### `POST /api/auth/sign-out`

**Description:** Sign out current user and invalidate session

**Headers:**

```http
Cookie: auth_token=<session_token>
```

**Response (Success):**

```json
{
  "message": "Signed out successfully"
}
```

**Response Headers:**

```http
Set-Cookie: touch-monorepo.session_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax
```

**Status Codes:**
- `200 OK` - Sign out successful
- `401 Unauthorized` - Not authenticated

---

### 3. **Email Verification** (If Enabled)

#### `POST /api/auth/verify`

**Description:** Verify email address with verification token

**Request Body:**

```json
{
  "token": "verification_token_here"
}
```

**Response (Success):**

```json
{
  "message": "Email verified successfully"
}
```

**Status Codes:**
- `200 OK` - Verification successful
- `400 Bad Request` - Invalid or expired token
- `404 Not Found` - Token not found

---

### 4. **Password Reset** (If Enabled)

#### `POST /api/auth/reset-password`

**Description:** Request password reset email

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response (Success):**

```json
{
  "message": "Password reset email sent"
}
```

**Status Codes:**
- `200 OK` - Reset email sent
- `400 Bad Request` - Invalid email
- `404 Not Found` - User not found

---

#### `POST /api/auth/reset-password/confirm`

**Description:** Confirm password reset with token

**Request Body:**

```json
{
  "token": "reset_token_here",
  "password": "new_password123"
}
```

**Response (Success):**

```json
{
  "message": "Password reset successfully"
}
```

**Status Codes:**
- `200 OK` - Password reset successful
- `400 Bad Request` - Invalid token or password
- `404 Not Found` - Token not found

---

## 🧪 **Testing Examples**

### Test Session Endpoint

```bash
curl -v http://localhost:4040/api/auth/session
```

### Test Sign In

```bash
curl -v -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  http://localhost:4040/api/auth/sign-in/email
```

### Test Sign Up

```bash
curl -v -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}' \
  http://localhost:4040/api/auth/sign-up/email
```

### Test Sign Out (with cookie)

```bash
curl -v -X POST \
  -H "Cookie: auth_token=YOUR_SESSION_TOKEN" \
  http://localhost:4040/api/auth/sign-out
```

---

## 🔧 **Implementation Details**

### Route Handling

- **`/api/auth/session`** - Custom implementation using `auth.api.getSession()`
- **All other routes** - Handled automatically by `auth.handler()` via `router.all('/auth/*')`

### Session Cookie

- **Name:** `touch-monorepo.session_token`
- **Type:** HTTP-only cookie
- **Security:** `HttpOnly`, `SameSite=Lax`
- **Expiration:** 30 days (configurable)
- **Path:** `/` (available across entire domain)

### Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "status": 400
}
```

---

## 📝 **Notes**

1. **Session Persistence:** Sessions are stored in the database and validated on each request
2. **Security:** All session cookies are HTTP-only for security
3. **CORS:** Endpoints support CORS with credentials
4. **Debug Mode:** Server logs all auth requests when `debug: true`
5. **Database:** Uses SQLite with Drizzle ORM for session storage

---

## 🚀 **Future Enhancements**

When you install the Better Auth OpenAPI plugin, this documentation will be automatically generated and kept in sync with your actual API endpoints.

**Available Plugins:**
- OpenAPI/Swagger documentation
- JWT token support
- OAuth providers (Google, GitHub, etc.)
- Multi-factor authentication
- Account linking

---

**Last Updated:** October 3, 2025
**Better Auth Version:** Latest
**Server:** Hono.js + Drizzle ORM + SQLite
