# Auth API

📅 Apr 5, 2025

```sh
Request: /api/auth/signup
Request body: {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
}
Signup result: {
  id: '2tGPVVSonuAzsNBxZc6TX',
  email: 'test@example.com',
  name: 'Test User',
  image: null,
  emailVerified: false,
  createdAt: 2024-12-22T00:26:23.000Z,
  updatedAt: 2024-12-22T00:26:23.000Z
}
Request completed
  res: {
    "status": 200,
    "headers": {}
  }
  req: {
    "url": "/api/auth/signup",
    "method": "POST",
    "headers": {
      "accept": "application/json",
      "content-length": "93",
      "content-type": "application/json",
      "host": "localhost:4040",
      "user-agent": "curl/8.11.0"
    }
  }
  reqId: "50d5e5ff-6408-4667-8dfd-9d83ef7b9a6f"
  responseTime: 43
}
```

---

## NEW USER via Signup

### ✅ sign up via api

```sh
curl -v -X POST http://localhost:4040/api/auth/signup -H "Content-Type: application/json" -H "Accept: application/json" -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### ✅ login - signed-up via api

```sh
curl -v -X POST 'http://localhost:4040/api/auth/login' -H 'Content-Type: application/json' -H 'Accept: application/json' -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## NEW USER via Signup II

### ✅ login - signed-up via seez

```sh
curl -v -X POST 'http://localhost:4040/api/auth/login' -H 'Content-Type: application/json' -H 'Accept: application/json' -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```
