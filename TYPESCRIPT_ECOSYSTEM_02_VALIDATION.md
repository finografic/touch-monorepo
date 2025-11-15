# TypeScript Ecosystem Part 2: Runtime Validation

## The Problem

TypeScript types exist **only at compile time**. They're erased when compiled to JavaScript:

```typescript
interface User {
  id: number;
  email: string;
}

// ✅ Compile time - TypeScript checks this
const user: User = { id: 1, email: 'user@example.com' };

// ❌ Runtime - No validation!
const apiResponse = await fetch('/api/user').then(r => r.json());
const user: User = apiResponse; // TypeScript trusts you, but data could be anything!
```

**The gap**: API responses, user input, file uploads - all need **runtime validation**.

---

## Solution: Runtime Validation Libraries

### 1. Zod (Most Popular) ⭐

**Best for**: Modern apps, schema validation, type inference

```typescript
import { z } from 'zod';

// Define schema
const UserSchema = z.object({
  id: z.number().positive(),
  email: z.string().email(),
  age: z.number().min(0).max(150).optional(),
  role: z.enum(['user', 'admin', 'guest']),
});

// Infer TypeScript type from schema
type User = z.infer<typeof UserSchema>;
// Result: { id: number; email: string; age?: number; role: 'user' | 'admin' | 'guest' }

// Validate at runtime
const result = UserSchema.safeParse(apiResponse);

if (result.success) {
  console.log(result.data); // ✅ Type-safe User
} else {
  console.error(result.error); // ❌ Validation errors
}
```

**Why Zod is Great**:
- ✅ Schema = types (write once)
- ✅ Excellent error messages
- ✅ Composable schemas
- ✅ Built-in transformations
- ✅ Works with React Hook Form, tRPC

**📦 Install**: `npm install zod`  
**📘 Docs**: https://zod.dev/

---

### 2. io-ts (Functional Approach)

**Best for**: Functional programming, fp-ts integration

```typescript
import * as t from 'io-ts';
import { isRight } from 'fp-ts/Either';

// Define codec
const UserCodec = t.type({
  id: t.number,
  email: t.string,
  age: t.union([t.number, t.undefined]),
  role: t.keyof({ user: null, admin: null, guest: null }),
});

// Infer type
type User = t.TypeOf<typeof UserCodec>;

// Validate
const result = UserCodec.decode(apiResponse);

if (isRight(result)) {
  console.log(result.right); // ✅ Valid User
} else {
  console.error(result.left); // ❌ Validation errors
}
```

**Why io-ts**:
- ✅ Functional programming style
- ✅ Integrates with fp-ts ecosystem
- ✅ Encoder/decoder pattern
- ✅ Composable codecs

**📦 Install**: `npm install io-ts fp-ts`  
**📘 Docs**: https://gcanti.github.io/io-ts/

---

### 3. Comparison: Zod vs io-ts

| Feature | Zod | io-ts |
|---------|-----|-------|
| **Learning Curve** | ✅ Easy | ⚠️  Steep (FP concepts) |
| **Syntax** | Modern, fluent API | Functional style |
| **Error Messages** | ✅ Excellent | ⚠️  Technical |
| **Ecosystem** | React, tRPC, Next.js | fp-ts, Effect-TS |
| **Transformations** | ✅ Built-in | Custom encoders |
| **Bundle Size** | ~12kb | ~8kb |
| **Best For** | General apps | FP codebases |

**Recommendation**: **Use Zod** unless you're already using fp-ts.

---

## Common Validation Patterns

### API Response Validation

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
});

async function fetchUser(id: number) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  
  // Validate before using
  return UserSchema.parse(data); // Throws if invalid
}

// Or with error handling
async function fetchUserSafe(id: number) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  
  const result = UserSchema.safeParse(data);
  
  if (!result.success) {
    console.error('Invalid API response:', result.error);
    return null;
  }
  
  return result.data;
}
```

---

### Form Validation

```typescript
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const SignupSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

type SignupForm = z.infer<typeof SignupSchema>;

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = (data: SignupForm) => {
    // ✅ Data is validated!
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} />
      {errors.username && <span>{errors.username.message}</span>}
      {/* ... */}
    </form>
  );
}
```

---

### Environment Variables

```typescript
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  API_URL: z.string().url(),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
});

// Validate at startup
const env = EnvSchema.parse(process.env);

export default env;
```

---

### File Upload Validation

```typescript
import { z } from 'zod';

const ImageUploadSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, 'Max 5MB')
    .refine(file => ['image/jpeg', 'image/png'].includes(file.type), 'Only JPEG/PNG'),
  alt: z.string().min(1).max(200),
});

function validateUpload(data: unknown) {
  return ImageUploadSchema.safeParse(data);
}
```

---

## Advanced Zod Features

### Transformations

```typescript
const DateSchema = z.string().transform(str => new Date(str));

const result = DateSchema.parse('2024-01-15');
// Result: Date object

// With validation
const SafeDateSchema = z.string()
  .refine(str => !isNaN(Date.parse(str)), 'Invalid date')
  .transform(str => new Date(str));
```

### Branded Types with Zod

```typescript
import { z } from 'zod';

const PositiveIntSchema = z.number().int().positive().brand('PositiveInt');
type PositiveInt = z.infer<typeof PositiveIntSchema>;

const value = PositiveIntSchema.parse(42); // ✅ branded PositiveInt
const invalid = PositiveIntSchema.parse(-1); // ❌ throws
```

### Recursive Schemas

```typescript
type Category = {
  id: number;
  name: string;
  children?: Category[];
};

const CategorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    id: z.number(),
    name: z.string(),
    children: z.array(CategorySchema).optional(),
  })
);
```

---

## When to Use Runtime Validation

### Always Validate ✅

- **API responses** - Never trust external data
- **User input** - Forms, file uploads, search queries
- **Environment variables** - Fail fast on startup
- **External configs** - JSON files, YAML, etc.
- **Database queries** - Validate before/after DB operations

### Optional ⚠️ 

- **Internal functions** - If types are sufficient
- **Build-time constants** - Known at compile time
- **Performance-critical paths** - Validation has cost

---

## Performance Considerations

```typescript
// ❌ BAD - Validates on every render
function Component({ data }: { data: unknown }) {
  const validated = UserSchema.parse(data); // Expensive!
  return <div>{validated.name}</div>;
}

// ✅ GOOD - Validate once at boundary
function Component({ user }: { user: User }) {
  // Already validated at API boundary
  return <div>{user.name}</div>;
}

// Validate at API layer
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return UserSchema.parse(await response.json()); // ✅ Validate once
}
```

---

## Key Takeaways

🎯 **Use Zod for**:
- API response validation
- Form validation
- Environment variables
- General runtime type checking

🎯 **Use io-ts for**:
- Functional programming codebases
- Integration with fp-ts
- Advanced codec patterns

🎯 **Best Practices**:
- Validate at system boundaries (API, user input)
- Cache validation results when possible
- Use `.safeParse()` for expected errors
- Use `.parse()` when errors should throw

---

## Next in Series

- **Part 1**: [Native TypeScript](./TYPESCRIPT_ECOSYSTEM_01_NATIVE.md)
- **Part 3**: [Functional Programming (fp-ts)](./TYPESCRIPT_ECOSYSTEM_03_FUNCTIONAL.md)
- **Part 4**: [Effect System (Effect-TS)](./TYPESCRIPT_ECOSYSTEM_04_EFFECT.md)
- **Part 5**: [Branding & Utilities (ts-brand)](./TYPESCRIPT_ECOSYSTEM_05_UTILITIES.md)

---

## Resources

- 📘 [Zod Documentation](https://zod.dev/)
- 📘 [io-ts Documentation](https://gcanti.github.io/io-ts/)
- 📘 [Zod vs Yup vs Joi](https://zod.dev/?id=comparison) - Comparison guide
- 📦 [zodResolver for React Hook Form](https://github.com/react-hook-form/resolvers#zod)

