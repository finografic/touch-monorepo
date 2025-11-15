# TypeScript Branded Types (Nominal Typing)

## What is Type Branding?

**Branded types** (also called **nominal types** or **opaque types**) are a TypeScript pattern that creates **distinct types from primitive types** to prevent accidental misuse.

TypeScript uses **structural typing** by default - two types are compatible if their structure matches. Branding adds a **unique marker** to make types incompatible even when structurally identical.

---

## The Problem

```typescript
// Without branding - easy to mix up!
type UserId = number;
type ProductId = number;

function getUser(id: UserId) { /* ... */ }
function getProduct(id: ProductId) { /* ... */ }

const userId: UserId = 123;
const productId: ProductId = 456;

getUser(productId); // ❌ No error! But logically wrong.
```

TypeScript sees both as `number` and allows this mistake.

---

## The Solution: Branded Types

```typescript
// With branding - type-safe!
type UserId = number & { readonly __brand: 'UserId' };
type ProductId = number & { readonly __brand: 'ProductId' };

function getUser(id: UserId) { /* ... */ }
function getProduct(id: ProductId) { /* ... */ }

const userId = 123 as UserId;
const productId = 456 as ProductId;

getUser(productId); // ✅ Type error! 'ProductId' is not assignable to 'UserId'
```

Now TypeScript prevents the mistake at compile time!

---

## How It Works

### The Brand Pattern

```typescript
type Brand<T, BrandName> = T & { readonly __brand: BrandName };

// Create branded types
type USD = Brand<number, 'USD'>;
type EUR = Brand<number, 'EUR'>;
type Email = Brand<string, 'Email'>;
type URL = Brand<string, 'URL'>;
```

The `__brand` property:
- ✅ Exists only at **compile time** (zero runtime overhead)
- ✅ Is `readonly` to prevent mutation
- ✅ Makes types **nominally distinct**
- ✅ Compiles to the underlying primitive (`number`, `string`, etc.)

---

## Common Use Cases

### 1. IDs from Different Entities

```typescript
type UserId = Brand<number, 'UserId'>;
type OrderId = Brand<number, 'OrderId'>;
type ProductId = Brand<number, 'ProductId'>;

// Helper functions
const userId = (id: number): UserId => id as UserId;
const orderId = (id: number): OrderId => id as OrderId;

const user = userId(123);
const order = orderId(456);

// Type-safe API calls
api.getUser(user);    // ✅ Works
api.getUser(order);   // ❌ Type error!
```

### 2. Different Units/Currencies

```typescript
type USD = Brand<number, 'USD'>;
type EUR = Brand<number, 'EUR'>;
type Meters = Brand<number, 'Meters'>;
type Feet = Brand<number, 'Feet'>;

const usd = (amount: number): USD => amount as USD;
const eur = (amount: number): EUR => amount as EUR;

const priceInUSD = usd(100);
const priceInEUR = eur(85);

function charge(amount: USD) { /* ... */ }

charge(priceInUSD); // ✅ Works
charge(priceInEUR); // ❌ Type error! Can't mix currencies
```

### 3. Validated Strings

```typescript
type Email = Brand<string, 'Email'>;
type URL = Brand<string, 'URL'>;
type SafeHTML = Brand<string, 'SafeHTML'>;

// Smart constructors with validation
function email(value: string): Email {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error('Invalid email');
  }
  return value as Email;
}

function url(value: string): URL {
  if (!value.startsWith('http')) {
    throw new Error('Invalid URL');
  }
  return value as URL;
}

// Usage
const userEmail = email('user@example.com'); // ✅ Validated
const website = url('https://example.com');  // ✅ Validated

function sendEmail(to: Email) { /* ... */ }
sendEmail(userEmail); // ✅ Type-safe
sendEmail(website);   // ❌ Type error!
```

### 4. Constrained Numbers (Our Use Case!)

```typescript
type Contrast = Brand<number, 'Contrast'>;
type ChromaShift = Brand<number, 'ChromaShift'>;

function contrast(value: number): Contrast {
  if (value < 1 || value > 10) {
    console.warn(`Contrast must be 1-10, got ${value}`);
  }
  return Math.max(1, Math.min(10, value)) as Contrast;
}

// Usage
const lowContrast = contrast(3);   // ✅ Valid
const highContrast = contrast(8);  // ✅ Valid
const invalid = contrast(15);      // ⚠️  Clamped to 10

interface ColorConfig {
  contrast: Contrast;  // Only accepts branded Contrast type
}
```

---

## Pattern Variations

### Basic Brand

```typescript
type UserId = number & { readonly __brand: 'UserId' };
```

### Generic Brand Helper

```typescript
type Brand<T, BrandName> = T & { readonly __brand: BrandName };

type UserId = Brand<number, 'UserId'>;
type Email = Brand<string, 'Email'>;
```

### Multiple Brands (Intersection)

```typescript
type ValidatedEmail = Brand<string, 'Validated'> & Brand<string, 'Email'>;

// Must satisfy BOTH brands
const validated = 'user@example.com' as ValidatedEmail;
```

### Flavor (Weaker Branding)

```typescript
type Flavor<T, FlavorName> = T & { readonly __flavor?: FlavorName };

// Flavored types are more lenient (useful for gradual adoption)
type UserId = Flavor<number, 'UserId'>;
```

---

## Best Practices

### ✅ DO: Create Helper Functions

```typescript
type Meters = Brand<number, 'Meters'>;

// Smart constructor
function meters(value: number): Meters {
  if (value < 0) throw new Error('Meters cannot be negative');
  return value as Meters;
}

// Usage
const distance = meters(100);
```

### ✅ DO: Add Validation

```typescript
type PositiveInt = Brand<number, 'PositiveInt'>;

function positiveInt(value: number): PositiveInt {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error('Must be a positive integer');
  }
  return value as PositiveInt;
}
```

### ✅ DO: Document Constraints

```typescript
/**
 * Email address that has been validated against RFC 5322
 * Use `email()` helper to create instances
 */
type Email = Brand<string, 'Email'>;
```

### ❌ DON'T: Cast Without Validation

```typescript
// ❌ BAD - No validation
const userId = 123 as UserId;

// ✅ GOOD - Validated helper
const userId = createUserId(123);
```

### ❌ DON'T: Expose Branded Types Directly

```typescript
// ❌ BAD - Easy to misuse
export type UserId = Brand<number, 'UserId'>;

// ✅ GOOD - Controlled creation
export type UserId = Brand<number, 'UserId'>;
export const userId = (id: number): UserId => {
  if (id <= 0) throw new Error('Invalid user ID');
  return id as UserId;
};
```

---

## Real-World Example: Currency System

```typescript
type Currency = 'USD' | 'EUR' | 'GBP';
type Money<C extends Currency> = Brand<number, C>;

type USD = Money<'USD'>;
type EUR = Money<'EUR'>;
type GBP = Money<'GBP'>;

// Helpers
const usd = (amount: number): USD => amount as USD;
const eur = (amount: number): EUR => amount as EUR;
const gbp = (amount: number): GBP => amount as GBP;

// Type-safe operations
function addUSD(a: USD, b: USD): USD {
  return usd(a + b);
}

function convertUSDtoEUR(amount: USD, rate: number): EUR {
  return eur(amount * rate);
}

// Usage
const priceA = usd(100);
const priceB = usd(50);
const total = addUSD(priceA, priceB); // ✅ Type-safe

const euroPrice = eur(85);
const sum = addUSD(priceA, euroPrice); // ❌ Type error! Can't mix currencies
```

---

## Compile-Time vs Runtime

**Important**: Brands exist **only at compile time**!

```typescript
type UserId = Brand<number, 'UserId'>;

const id: UserId = 123 as UserId;

console.log(typeof id);           // "number"
console.log(id.__brand);          // undefined (property doesn't exist at runtime)
console.log(id === 123);          // true (it's just a number)
```

The brand is **erased during compilation**:

```typescript
// TypeScript (before compilation)
const userId: UserId = 123 as UserId;

// JavaScript (after compilation)
const userId = 123;
```

**Zero runtime overhead!** 🚀

---

## Benefits

✅ **Type Safety** - Prevent mixing incompatible types  
✅ **Self-Documenting** - Type names convey meaning  
✅ **Zero Runtime Cost** - Brands are compile-time only  
✅ **Refactoring Safety** - Renaming types catches all usages  
✅ **Domain Modeling** - Express business rules in types  

---

## When to Use Branding

### Good Use Cases ✅

- **IDs from different entities** (UserId, ProductId, OrderId)
- **Different units** (USD/EUR, Meters/Feet, Celsius/Fahrenheit)
- **Validated strings** (Email, URL, SafeHTML, PhoneNumber)
- **Constrained numbers** (PositiveInt, Percentage, Age)
- **Security-critical values** (SanitizedInput, HashedPassword)

### Not Needed ❌

- **Types that are already distinct** (don't brand `Date` or custom classes)
- **Very local scope** (single function, no confusion possible)
- **Performance-critical paths** (validation overhead matters)
- **Types with complex structure** (objects, arrays - already distinct)

---

## Libraries

If you need more advanced features:

- **[ts-brand](https://github.com/kourge/ts-brand)** - Lightweight branding library
- **[io-ts](https://github.com/gcanti/io-ts)** - Runtime type validation
- **[zod](https://github.com/colinhacks/zod)** - Schema validation with branding
- **[Effect-TS](https://www.effect.website/)** - Functional programming with branded types

---

## Summary

**Branded types** add nominal typing to TypeScript's structural type system. They:

1. Create **distinct types** from primitives
2. Prevent **accidental misuse** at compile time
3. Have **zero runtime overhead**
4. Enable **domain modeling** with type safety

Perfect for IDs, units, validated strings, and constrained values! 🎯

