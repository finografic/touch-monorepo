# TypeScript Ecosystem Part 4: Advanced (fp-ts & Effect-TS)

## ⚠️  Read This First

**This is ADVANCED material.** You likely don't need these libraries unless:

✅ Building complex business logic  
✅ Need sophisticated error handling  
✅ Team experienced with functional programming  
✅ Working on large-scale systems  

**For most projects**: Stick to **Parts 1-3** (Native TS, Zod, type-fest). 

---

## 1. fp-ts (Functional Programming)

### What is fp-ts?

**fp-ts** brings functional programming concepts to TypeScript:
- Monads (Option, Either, Task)
- Functors and Applicatives
- Pipelines and composition
- Immutable data structures

**📦 Install**: `npm install fp-ts`  
**📘 Docs**: https://gcanti.github.io/fp-ts/

---

### Core Concepts

#### Option (Maybe) - Handle Null/Undefined

```typescript
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

// Instead of: string | null
type User = { name: string; email: O.Option<string> };

const user: User = {
  name: 'John',
  email: O.some('john@example.com'),
};

// Safe access
const emailUpper = pipe(
  user.email,
  O.map(email => email.toUpperCase()),
  O.getOrElse(() => 'NO EMAIL'),
);
```

#### Either - Error Handling

```typescript
import * as E from 'fp-ts/Either';

function divide(a: number, b: number): E.Either<Error, number> {
  return b === 0
    ? E.left(new Error('Division by zero'))
    : E.right(a / b);
}

const result = divide(10, 2);

pipe(
  result,
  E.fold(
    error => console.error(error.message),
    value => console.log(value),
  ),
);
```

#### Task - Async Operations

```typescript
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';

// TaskEither<Error, User> = async operation that can fail
const fetchUser = (id: number): TE.TaskEither<Error, User> =>
  TE.tryCatch(
    () => fetch(`/api/users/${id}`).then(r => r.json()),
    (error) => new Error(String(error)),
  );

// Composable!
const program = pipe(
  fetchUser(1),
  TE.chain(user => updateUser(user)),
  TE.map(user => user.name),
);

// Execute
program()
  .then(result => {
    if (E.isRight(result)) {
      console.log(result.right); // Success
    } else {
      console.error(result.left); // Error
    }
  });
```

---

### When to Use fp-ts

✅ **Good fit**:
- Complex business logic with many edge cases
- Need composable error handling
- Team experienced with FP
- Integrating with io-ts for validation

❌ **Avoid if**:
- Team new to FP (steep learning curve)
- Simple CRUD apps
- Prototyping (too much boilerplate)
- Performance-critical (extra abstraction cost)

---

## 2. Effect-TS (Modern FP System)

### What is Effect-TS?

**Effect-TS** is a next-generation functional programming library:
- Unified effect system
- Built-in dependency injection
- Structured concurrency
- Type-safe errors
- Resource management

**📦 Install**: `npm install effect`  
**📘 Docs**: https://effect.website/

---

### Core Concepts

#### Effect - The Main Type

```typescript
import { Effect, Console } from 'effect';

// Effect<Success, Error, Requirements>
type Program = Effect.Effect<number, Error, never>;

const program: Program = Effect.gen(function* (_) {
  yield* _(Console.log('Starting...'));
  const result = yield* _(Effect.succeed(42));
  return result * 2;
});

// Run
Effect.runPromise(program).then(console.log); // 84
```

#### Type-Safe Errors

```typescript
import { Effect, Data } from 'effect';

class NetworkError extends Data.TaggedError('NetworkError')<{
  reason: string;
}> {}

class ValidationError extends Data.TaggedError('ValidationError')<{
  field: string;
}> {}

const fetchUser = (id: number): Effect.Effect<User, NetworkError> =>
  Effect.tryPromise({
    try: () => fetch(`/api/users/${id}`).then(r => r.json()),
    catch: (error) => new NetworkError({ reason: String(error) }),
  });

// Handle specific errors
const program = pipe(
  fetchUser(1),
  Effect.catchTag('NetworkError', error => {
    console.error('Network failed:', error.reason);
    return Effect.succeed(defaultUser);
  }),
);
```

#### Dependency Injection

```typescript
import { Effect, Context, Layer } from 'effect';

// Define service
interface Database {
  query: (sql: string) => Effect.Effect<any[], Error>;
}

const Database = Context.GenericTag<Database>('Database');

// Use service
const getUsers = Effect.gen(function* (_) {
  const db = yield* _(Database);
  const users = yield* _(db.query('SELECT * FROM users'));
  return users;
});

// Provide implementation
const DatabaseLive = Layer.succeed(Database, {
  query: (sql) => Effect.succeed([/* mock data */]),
});

// Run with dependencies
Effect.runPromise(
  Effect.provide(getUsers, DatabaseLive)
);
```

---

### Effect-TS vs fp-ts

| Feature | fp-ts | Effect-TS |
|---------|-------|-----------|
| **Learning Curve** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Error Handling** | Either | Tagged errors |
| **Async** | TaskEither | Effect (built-in) |
| **DI** | Manual | Built-in |
| **Ecosystem** | Mature | Growing |
| **Bundle Size** | ~20kb | ~60kb |
| **Performance** | Good | Excellent |

---

### When to Use Effect-TS

✅ **Good fit**:
- Large-scale applications
- Complex dependency graphs
- Need structured concurrency
- Advanced error handling
- Team ready for cutting-edge FP

❌ **Avoid if**:
- Learning TypeScript/React
- Small to medium projects
- Quick prototypes
- Team unfamiliar with FP concepts

---

## Comparison: Simple vs Advanced

### Simple Approach (Recommended for Most)

```typescript
import { z } from 'zod';

// Validation
const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
});

// Async with try/catch
async function getUser(id: number): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    return UserSchema.parse(data);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}
```

**Pros**: ✅ Simple, ✅ Familiar, ✅ Easy to debug  
**Cons**: ⚠️  Exceptions, ⚠️  Less composable

---

### fp-ts Approach

```typescript
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

const getUser = (id: number): TE.TaskEither<Error, User> =>
  pipe(
    TE.tryCatch(
      () => fetch(`/api/users/${id}`).then(r => r.json()),
      E.toError,
    ),
    TE.chainEitherK(data => UserCodec.decode(data)),
  );

// Usage
getUser(1)().then(result =>
  pipe(
    result,
    E.fold(
      error => console.error(error),
      user => console.log(user),
    ),
  ),
);
```

**Pros**: ✅ Composable, ✅ No exceptions, ✅ Type-safe errors  
**Cons**: ⚠️  Steep learning curve, ⚠️  Verbose

---

### Effect-TS Approach

```typescript
import { Effect } from 'effect';

const getUser = (id: number): Effect.Effect<User, Error> =>
  Effect.gen(function* (_) {
    const response = yield* _(
      Effect.tryPromise({
        try: () => fetch(`/api/users/${id}`).then(r => r.json()),
        catch: E.toError,
      })
    );
    return yield* _(Effect.try(() => UserSchema.parse(response)));
  });

// Usage
Effect.runPromise(getUser(1))
  .then(console.log)
  .catch(console.error);
```

**Pros**: ✅ Powerful, ✅ DI built-in, ✅ Modern syntax  
**Cons**: ⚠️  Very steep curve, ⚠️  Large bundle

---

## Should You Use These?

### Decision Tree

```
Do you have complex business logic?
├─ No → Use native TypeScript + Zod ✅
└─ Yes
    │
    Is your team experienced with FP?
    ├─ No → Stick with Zod + modern patterns ✅
    └─ Yes
        │
        Need advanced features (DI, concurrency)?
        ├─ No → Consider fp-ts ⚠️ 
        └─ Yes → Consider Effect-TS ⚠️⚠️
```

### Honest Recommendation

**For 90% of projects**: 
- ✅ Native TypeScript (Part 1)
- ✅ Zod for validation (Part 2)
- ✅ type-fest for utilities (Part 3)
- ✅ DIY branded types

**For 9% of projects**:
- ⚠️  Add fp-ts if team knows FP

**For 1% of projects**:
- ⚠️⚠️  Effect-TS for cutting-edge systems

---

## Learning Path

If you want to explore FP in TypeScript:

1. **Start**: Master native TypeScript (Part 1)
2. **Then**: Learn Zod and runtime validation (Part 2)
3. **Next**: Use modern patterns - Result types, state machines (Part 3)
4. **Maybe**: Try fp-ts basics (Option, Either) in one module
5. **Finally**: If it clicks, gradually adopt more FP patterns
6. **Expert**: Explore Effect-TS only if fp-ts feels limiting

**Don't jump to fp-ts/Effect-TS too early!** The learning curve is real.

---

## Key Takeaways

🎯 **fp-ts**:
- Functional programming for TypeScript
- Composable error handling
- Steep learning curve
- Use if team experienced with FP

🎯 **Effect-TS**:
- Next-gen effect system
- Built-in DI and concurrency
- Very steep learning curve
- Use only for complex systems

🎯 **For most projects**:
- Native TypeScript is enough
- Add Zod for validation
- Use modern patterns
- Keep it simple!

---

## Resources

### fp-ts
- 📘 [Official Docs](https://gcanti.github.io/fp-ts/)
- 📘 [Learning Resources](https://github.com/gcanti/fp-ts/blob/master/docs/learning-resources.md)
- 📹 [FP in TypeScript (Video)](https://www.youtube.com/watch?v=M6MtEqz7yxk)

### Effect-TS
- 📘 [Official Website](https://effect.website/)
- 📘 [Getting Started](https://effect.website/docs/getting-started)
- 💬 [Discord Community](https://discord.gg/effect-ts)

---

## Previous in Series

- **Part 1**: [Native TypeScript](./TYPESCRIPT_ECOSYSTEM_01_NATIVE.md)
- **Part 2**: [Runtime Validation](./TYPESCRIPT_ECOSYSTEM_02_VALIDATION.md)
- **Part 3**: [Modern Patterns](./TYPESCRIPT_ECOSYSTEM_03_MODERN_PATTERNS.md)

