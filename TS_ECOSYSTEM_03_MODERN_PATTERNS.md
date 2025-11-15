# TypeScript Ecosystem Part 3: Modern Patterns & Libraries

## Overview

This guide covers modern TypeScript patterns and lightweight utility libraries that enhance type safety and developer experience.

---

## 1. Branded Types (ts-brand)

### DIY Branding (Zero Dependencies)

```typescript
// Pattern 1: Basic brand
type UserId = number & { readonly __brand: 'UserId' };

function userId(id: number): UserId {
  return id as UserId;
}

// Pattern 2: Generic brand helper
type Brand<T, BrandName> = T & { readonly __brand: BrandName };

type Email = Brand<string, 'Email'>;
type URL = Brand<string, 'URL'>;
```

**When to use DIY**: Simple use cases, want zero dependencies

### ts-brand Library

```typescript
import { Brand } from 'ts-brand';

// Create branded types
type UserId = Brand<number, 'UserId'>;
type Email = Brand<string, 'Email'>;

// Type-safe utilities included
import { make, check } from 'ts-brand';

const userId = make<UserId>(123);

if (check<UserId>(value)) {
  // value is branded as UserId
}
```

**When to use ts-brand**: Need utilities, managing many branded types

**📦 Install**: `npm install ts-brand`  
**📘 Docs**: https://github.com/kourge/ts-brand

---

## 2. Type-Fest (Utility Types)

**Collection of 100+ advanced utility types** for TypeScript

```typescript
import type {
  Simplify,
  Merge,
  PartialDeep,
  RequireAtLeastOne,
  SetOptional,
  CamelCase,
  KebabCase,
} from 'type-fest';

// Simplify complex intersection types
type Complex = { a: number } & { b: string } & { c: boolean };
type Simple = Simplify<Complex>; // { a: number; b: string; c: boolean }

// Deep partial
type Config = {
  api: {
    url: string;
    timeout: number;
  };
};
type PartialConfig = PartialDeep<Config>;
// { api?: { url?: string; timeout?: number } }

// Require at least one property
type UpdateUser = RequireAtLeastOne<{
  name?: string;
  email?: string;
  age?: number;
}, 'name' | 'email'>;
// At least name OR email must be provided

// Case transformations
type UserID = CamelCase<'user_id'>; // 'userId'
type UserName = KebabCase<'userName'>; // 'user-name'
```

### Popular Type-Fest Types

| Type | Purpose | Example |
|------|---------|---------|
| `Simplify<T>` | Flatten intersection types | Complex → Simple |
| `Merge<A, B>` | Merge two types | User + Admin → UserAdmin |
| `PartialDeep<T>` | Deep optional | Config → All nested optional |
| `RequireAtLeastOne<T, K>` | At least one required | Flexible options |
| `SetOptional<T, K>` | Make specific keys optional | Partial updates |
| `Opaque<T, Token>` | Branded types | UserId, Email |
| `CamelCase` / `SnakeCase` | Case conversion | API transformations |
| `JsonValue` | Valid JSON types | API responses |

**📦 Install**: `npm install type-fest`  
**📘 Docs**: https://github.com/sindresorhus/type-fest

---

## 3. TS-Extras (Runtime Utilities)

**Runtime utilities** that complement type-fest (same author!)

```typescript
import { isObject, isPlainObject, assert, assertNever } from 'ts-extras';

// Type-safe object checks
if (isPlainObject(value)) {
  // value is Record<string, unknown>
}

// Assertions
assert(typeof value === 'string', 'Value must be string');

// Exhaustiveness checking
function handleStatus(status: 'loading' | 'success' | 'error') {
  switch (status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return 'Success!';
    case 'error':
      return 'Error!';
    default:
      assertNever(status); // Compile error if case is missed!
  }
}
```

**📦 Install**: `npm install ts-extras`  
**📘 Docs**: https://github.com/sindresorhus/ts-extras

---

## 4. Modern Pattern: Result Types

**Pattern**: Represent success/failure without exceptions

```typescript
// Simple Result type
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Usage
function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return { ok: false, error: new Error('Division by zero') };
  }
  return { ok: true, value: a / b };
}

const result = divide(10, 2);
if (result.ok) {
  console.log(result.value); // ✅ TypeScript knows value exists
} else {
  console.error(result.error); // ✅ TypeScript knows error exists
}
```

**Why Result types**:
- ✅ Explicit error handling
- ✅ No hidden exceptions
- ✅ Type-safe success/failure paths
- ✅ Composable (can be chained)

---

## 5. Modern Pattern: Builder Pattern

**Pattern**: Type-safe object construction

```typescript
class UserBuilder {
  private user: Partial<User> = {};

  setId(id: number): this {
    this.user.id = id;
    return this;
  }

  setEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  setName(name: string): this {
    this.user.name = name;
    return this;
  }

  build(): User {
    if (!this.user.id || !this.user.email || !this.user.name) {
      throw new Error('Missing required fields');
    }
    return this.user as User;
  }
}

// Usage
const user = new UserBuilder()
  .setId(1)
  .setEmail('user@example.com')
  .setName('John')
  .build();
```

---

## 6. Modern Pattern: Type-Safe Event Emitters

```typescript
type Events = {
  userCreated: { id: number; name: string };
  userDeleted: { id: number };
  errorOccurred: { message: string };
};

class TypedEventEmitter<T extends Record<string, any>> {
  private listeners: {
    [K in keyof T]?: Array<(data: T[K]) => void>;
  } = {};

  on<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.listeners[event]?.forEach(callback => callback(data));
  }
}

// Usage
const emitter = new TypedEventEmitter<Events>();

emitter.on('userCreated', (data) => {
  console.log(data.id, data.name); // ✅ Fully typed!
});

emitter.emit('userCreated', { id: 1, name: 'John' }); // ✅ Type-safe
emitter.emit('userCreated', { id: 1 }); // ❌ Error: missing 'name'
```

---

## 7. Modern Pattern: Type-Safe State Machines

```typescript
type State = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: string }
  | { status: 'error'; error: Error };

type Action =
  | { type: 'FETCH' }
  | { type: 'SUCCESS'; data: string }
  | { type: 'ERROR'; error: Error }
  | { type: 'RESET' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH':
      return { status: 'loading' };
    case 'SUCCESS':
      return { status: 'success', data: action.data };
    case 'ERROR':
      return { status: 'error', error: action.error };
    case 'RESET':
      return { status: 'idle' };
  }
}
```

**Why state machines**:
- ✅ Impossible states are impossible
- ✅ All transitions are explicit
- ✅ Easy to reason about
- ✅ Perfect for async operations

---

## 8. Modern Pattern: Phantom Types

**Pattern**: Encode additional information in types without runtime cost

```typescript
type Sorted<T> = T & { readonly __sorted: unique symbol };
type Validated<T> = T & { readonly __validated: unique symbol };

function sort<T>(arr: T[]): Sorted<T[]> {
  return arr.sort() as Sorted<T[]>;
}

function binarySearch<T>(arr: Sorted<T[]>, target: T): number {
  // Implementation assumes array is sorted
  return -1;
}

const numbers = [3, 1, 2];
binarySearch(numbers, 2); // ❌ Error: not sorted!

const sorted = sort(numbers);
binarySearch(sorted, 2); // ✅ Works!
```

---

## Comparison: When to Use What

| Need | Solution | Complexity |
|------|----------|------------|
| **Distinct types from primitives** | Branded types (DIY) | ⭐ Simple |
| **Many branded types** | ts-brand library | ⭐⭐ Easy |
| **Advanced type utilities** | type-fest | ⭐ Simple |
| **Runtime utilities** | ts-extras | ⭐ Simple |
| **Runtime validation** | zod | ⭐⭐ Easy |
| **Functional programming** | fp-ts | ⭐⭐⭐⭐ Advanced |
| **Effect system** | Effect-TS | ⭐⭐⭐⭐⭐ Expert |

---

## Recommended Stack

### Minimal (Start Here) ✅

```json
{
  "dependencies": {
    "zod": "^3.22.4"          // Runtime validation
  },
  "devDependencies": {
    "type-fest": "^4.10.0"    // Utility types
  }
}
```

**Use**: Branded types (DIY), Zod for validation, type-fest for types

### Modern (Most Projects) ⭐

```json
{
  "dependencies": {
    "zod": "^3.22.4",
    "ts-extras": "^0.10.0"
  },
  "devDependencies": {
    "type-fest": "^4.10.0",
    "ts-brand": "^0.0.2"
  }
}
```

**Use**: All of minimal + ts-extras runtime utils + ts-brand

### Advanced (Functional) 🚀

```json
{
  "dependencies": {
    "zod": "^3.22.4",
    "fp-ts": "^2.16.0",       // Functional programming
    "io-ts": "^2.2.20"        // FP validation
  }
}
```

**Use**: Functional programming patterns (see Part 4)

---

## Key Takeaways

🎯 **Start simple**:
- DIY branded types
- Zod for validation
- type-fest for utility types

🎯 **Add as needed**:
- ts-brand for many branded types
- ts-extras for runtime utilities
- Modern patterns (Result, State machines)

🎯 **Avoid over-engineering**:
- Don't use fp-ts/Effect-TS unless you need it
- Simple solutions often better than clever ones

---

## Next in Series

- **Part 1**: [Native TypeScript](./TYPESCRIPT_ECOSYSTEM_01_NATIVE.md)
- **Part 2**: [Runtime Validation](./TYPESCRIPT_ECOSYSTEM_02_VALIDATION.md)
- **Part 4**: [Advanced: fp-ts & Effect-TS](./TYPESCRIPT_ECOSYSTEM_04_ADVANCED.md)

---

## Resources

- 📘 [Type-Fest on GitHub](https://github.com/sindresorhus/type-fest)
- 📘 [TS-Extras on GitHub](https://github.com/sindresorhus/ts-extras)
- 📘 [ts-brand on GitHub](https://github.com/kourge/ts-brand)
- 📘 [TypeScript Branding Guide](./TYPESCRIPT_BRANDING.md)

