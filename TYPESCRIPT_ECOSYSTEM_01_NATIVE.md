# TypeScript Ecosystem Part 1: Native TypeScript

## Overview

This guide covers **native TypeScript features** - what's built into the language without external libraries.

---

## Native Type System Features

### 1. Structural Typing (Default)

TypeScript uses **structural typing** - types are compatible based on their shape, not their name.

```typescript
interface Point {
  x: number;
  y: number;
}

interface Vector {
  x: number;
  y: number;
}

const point: Point = { x: 10, y: 20 };
const vector: Vector = point; // ✅ Compatible (same shape)
```

**Pros**: Flexible, duck-typing friendly  
**Cons**: Can't distinguish semantically different types with same structure

---

### 2. Utility Types (Built-in)

TypeScript provides **utility types** for common type transformations:

```typescript
// Partial<T> - Make all properties optional
type User = { id: number; name: string; email: string };
type PartialUser = Partial<User>; // { id?: number; name?: string; email?: string }

// Required<T> - Make all properties required
type RequiredUser = Required<PartialUser>; // { id: number; name: string; email: string }

// Readonly<T> - Make all properties readonly
type ImmutableUser = Readonly<User>; // { readonly id: number; ... }

// Pick<T, K> - Select specific properties
type UserName = Pick<User, 'id' | 'name'>; // { id: number; name: string }

// Omit<T, K> - Remove specific properties
type UserWithoutEmail = Omit<User, 'email'>; // { id: number; name: string }

// Record<K, T> - Create object type with specific keys
type UserRoles = Record<'admin' | 'user' | 'guest', boolean>;
// { admin: boolean; user: boolean; guest: boolean }

// ReturnType<T> - Extract return type of function
type Result = ReturnType<typeof myFunction>;

// Parameters<T> - Extract parameter types as tuple
type Params = Parameters<typeof myFunction>;
```

**📘 Full list**: [TypeScript Utility Types Docs](https://www.typescriptlang.org/docs/handbook/utility-types.html)

---

### 3. Template Literal Types

Create types from string patterns:

```typescript
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = '/users' | '/products' | '/orders';

// Combine with template literals
type APIRoute = `${HTTPMethod} ${Endpoint}`;
// Result: 'GET /users' | 'GET /products' | ... | 'DELETE /orders'

// Uppercase/Lowercase transformations
type EventName = 'click' | 'focus' | 'blur';
type Handler = `on${Capitalize<EventName>}`;
// Result: 'onClick' | 'onFocus' | 'onBlur'
```

---

### 4. Conditional Types

Types that depend on conditions:

```typescript
// Basic conditional
type IsString<T> = T extends string ? true : false;
type A = IsString<'hello'>; // true
type B = IsString<42>;      // false

// Exclude null/undefined
type NonNullable<T> = T extends null | undefined ? never : T;
type SafeString = NonNullable<string | null>; // string

// Extract array element type
type ArrayElement<T> = T extends (infer U)[] ? U : never;
type Numbers = ArrayElement<number[]>; // number
```

---

### 5. Mapped Types

Transform properties of existing types:

```typescript
// Make properties optional
type Optional<T> = {
  [K in keyof T]?: T[K];
};

// Make properties readonly
type Immutable<T> = {
  readonly [K in keyof T]: T[K];
};

// Prefix all keys
type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}${string & K}`]: T[K];
};

type User = { id: number; name: string };
type PrefixedUser = Prefixed<User, 'user_'>;
// { user_id: number; user_name: string }
```

---

### 6. Type Guards

Runtime type checking:

```typescript
// typeof guard
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// instanceof guard
function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

// Custom type guard
interface User { id: number; name: string }
interface Admin extends User { permissions: string[] }

function isAdmin(user: User): user is Admin {
  return 'permissions' in user;
}

// Usage
const user: User | Admin = getUser();
if (isAdmin(user)) {
  console.log(user.permissions); // ✅ TypeScript knows it's Admin
}
```

---

### 7. Discriminated Unions

Type-safe state machines:

```typescript
type LoadingState = 
  | { status: 'loading' }
  | { status: 'success'; data: string }
  | { status: 'error'; error: Error };

function handleState(state: LoadingState) {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return state.data; // ✅ TypeScript knows data exists
    case 'error':
      return state.error.message; // ✅ TypeScript knows error exists
  }
}
```

---

### 8. Const Assertions

Make values deeply readonly:

```typescript
// Without const assertion
const colors = ['red', 'green', 'blue'];
// Type: string[]

// With const assertion
const colors = ['red', 'green', 'blue'] as const;
// Type: readonly ['red', 'green', 'blue']

// Objects
const config = {
  api: 'https://api.example.com',
  timeout: 5000,
} as const;
// All properties are readonly
```

---

### 9. Satisfies Operator (TypeScript 4.9+)

Validate types without widening:

```typescript
type Color = 'red' | 'green' | 'blue';

// ❌ Without satisfies - type is widened
const color: Color = 'red';
const upper = color.toUpperCase(); // ❌ Error: Property doesn't exist on 'Color'

// ✅ With satisfies - keeps literal type
const color = 'red' satisfies Color;
const upper = color.toUpperCase(); // ✅ Works! Type is 'red', not Color
```

---

## Native TypeScript Limitations

### What TypeScript CAN'T Do Natively

❌ **Runtime type validation** - Types are erased at compile time  
❌ **Nominal typing** - Can't distinguish types with same structure (need branding)  
❌ **Numeric range types** - Can't express `1-10` range  
❌ **Regex types** - Can't validate strings against patterns  
❌ **Deep runtime guarantees** - Can't ensure data from APIs matches types  

This is where **external libraries** come in! (See Parts 2-4)

---

## When to Use Native TypeScript

✅ **Always start with native TypeScript first!**

Use native features when:
- ✅ Building internal application logic
- ✅ Type transformations and utilities
- ✅ API contracts within your codebase
- ✅ Component props and state types
- ✅ General type safety

Consider libraries when:
- ⚠️  Need runtime validation (API responses, user input)
- ⚠️  Need nominal typing (branding IDs, units)
- ⚠️  Building functional programming patterns
- ⚠️  Need schema-based validation

---

## Key Takeaways

🎯 **Native TypeScript provides**:
- Powerful compile-time type checking
- Rich utility types
- Template literals and conditional types
- Type guards and discriminated unions
- Zero runtime overhead

🎯 **Native TypeScript does NOT provide**:
- Runtime validation
- Nominal typing (by default)
- Complex schema validation
- Functional programming utilities

---

## Next in Series

- **Part 2**: [Runtime Validation (io-ts, zod)](./TYPESCRIPT_ECOSYSTEM_02_VALIDATION.md)
- **Part 3**: [Functional Programming (fp-ts)](./TYPESCRIPT_ECOSYSTEM_03_FUNCTIONAL.md)
- **Part 4**: [Effect System (Effect-TS)](./TYPESCRIPT_ECOSYSTEM_04_EFFECT.md)
- **Part 5**: [Branding & Utilities (ts-brand)](./TYPESCRIPT_ECOSYSTEM_05_UTILITIES.md)

---

## Resources

- 📘 [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- 📘 [TypeScript Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- 📘 [TypeScript 5.0 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/overview.html)
- 📘 [Type Challenges](https://github.com/type-challenges/type-challenges) - Practice TypeScript types

