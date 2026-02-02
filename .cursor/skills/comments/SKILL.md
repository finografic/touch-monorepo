---
name: code-comments
description: Guidelines for code comments and inline documentation. Use when writing or reviewing comments, JSDoc, or inline notes. Emphasizes "why not what" — good code is self-documenting.
---

# Code Comments & Inline Documentation

## Quick Start

```typescript
// ✅ Explain WHY, not WHAT
const DEBOUNCE_MS = 300; // Balances responsiveness vs API rate limits

// ✅ Non-obvious behavior
/** Rounds to nearest 0.5°C — matches hardware sensor precision */
function roundTemp(temp: number): number { ... }

// ❌ Don't state the obvious
const count = items.length; // Get the length of items
```

**Core principle**: Good code is self-documenting. Comments explain **why**, not **what**.

---

## JSDoc-Style Comments

Use for functions, types, and exports that benefit from explanation.

### Multi-line (when needed)

```typescript
/**
 * Wraps Lucide icons with auto-className for consistent styling.
 * Required because Lucide icons don't accept className by default.
 */
export function createIconWrapper(icon: LucideIcon, name: string) { ... }
```

### Single-line (preferred when sufficient)

```typescript
/** Formats seconds as mm:ss, handles edge cases like negative values */
export function formatTimeDuration(seconds: number): string { ... }
```

---

## Inline Comments

For brief clarifications within code blocks.

### Above the line

```typescript
// Fallback to empty array if API returns null
const items = response.data ?? [];
```

### End of line (align with whitespace if multiple)

```typescript
const ICONS = {
  Add: Lucide.Plus,
  Close: Lucide.X,
  Delete: Lucide.X,       // Same as Close, semantic alias
  Dropdown: Lucide.ChevronDown,
} as const;
```

---

## Comment Prefixes

Use sparingly, only when they add clarity:

| Prefix | Use for |
|--------|---------|
| `TODO:` | Future work, incomplete implementation |
| `NOTE:` | Important context, non-obvious behavior |
| `REF:` | Links to docs, issues, or related code |
| `FIXME:` | Known bug or problematic code |
| `DEPRECATED:` | Code scheduled for removal |
| `IMPORTANT:` | Critical info that's easy to miss |
| `TEMP:` | Temporary code, should be removed |

### Examples

```typescript
// TODO: Add error boundary for failed icon loads
// NOTE: Order matters — aliases must come after primary icons
// REF: https://lucide.dev/icons/
// DEPRECATED: Use Icon.Plus instead, will be removed in v3
```

---

## What NOT to Comment

### ❌ Obvious code

```typescript
// BAD: Comment restates what code already says
/** Icon name type - automatically generated from ICON_MAP keys */
export type IconName = keyof typeof ICON_MAP;

// GOOD: No comment needed, code is self-explanatory
export type IconName = keyof typeof ICON_MAP;
```

### ❌ Every function/type

```typescript
// BAD: Unnecessary JSDoc on simple, obvious code
/** Returns the user's name */
function getUserName(user: User): string {
  return user.name;
}

// GOOD: No comment, function name says it all
function getUserName(user: User): string {
  return user.name;
}
```

### ❌ Redundant inline comments

```typescript
// BAD
const count = items.length; // Get the length of items

// GOOD: No comment needed
const count = items.length;
```

---

## When Comments ARE Useful

### Non-obvious business logic

```typescript
/** 
 * Rounds to nearest 0.5°C — matches hardware sensor precision.
 * Finer precision would display false accuracy.
 */
function roundTemperature(temp: number): number {
  return Math.round(temp * 2) / 2;
}
```

### Workarounds and edge cases

```typescript
// Safari doesn't support smooth scrolling in overflow containers
// REF: https://bugs.webkit.org/show_bug.cgi?id=188
element.scrollIntoView({ behavior: 'auto' });
```

### Magic numbers/strings

```typescript
const DEBOUNCE_MS = 300; // Balances responsiveness vs API rate limits
```

### Complex algorithms

```typescript
/**
 * Binary search for temperature profile matching.
 * O(log n) vs O(n) linear scan — matters for 100+ profiles.
 */
function findClosestProfile(target: number, profiles: Profile[]): Profile { ... }
```

---

## Style Guidelines

1. **Concise over grammatically correct** — sacrifice grammar for brevity
2. **Sentence case** — no trailing periods for single-line comments
3. **Present tense** — "Returns..." not "Will return..."
4. **No fluff** — avoid "This function...", "This is used to..."
5. **Align end-of-line comments** — when multiple in a block
