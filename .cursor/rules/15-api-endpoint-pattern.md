# Rule: API Endpoint Pattern

**Status:** ✅ MANDATORY
**Priority:** Critical
**Last Updated:** December 26, 2025

---

## Overview

ALL server communication MUST follow the unified endpoint pattern. This rule ensures type safety, consistency, and maintainability across the codebase.

**📖 Full Guide:** See `apps/client/src/api/API_ENDPOINTS_AND_QUERIES_GUIDE.md`

---

## The Pattern

### File Location

```
apps/client/src/api/endpoints/{resource}.endpoints.ts
```

### Standard Template

```typescript
import { transformFetchError } from '@workspace/core/api';
import { api } from 'api';
import type { {Resource} } from 'types/models/{resource}.model';

export type {Resource}Update = Partial<Omit<{Resource}, 'id'>>;

export const Endpoints{Resource} = {
  getAll: async (): Promise<{Resource}[]> => {
    try {
      const data = await api.get<{Resource}[]>(/{resource}s);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  getById: async (id: string): Promise<{Resource}> => {
    try {
      return await api.get<{Resource}>(/{resource}s/${id});
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  create: async (updates: {Resource}Update): Promise<{Resource}> => {
    try {
      return await api.post<{Resource}>(/{resource}s, updates);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  update: async (id: string, updates: {Resource}Update): Promise<{Resource}> => {
    try {
      return await api.patch<{Resource}>(/{resource}s/${id}, updates);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete<void>(/{resource}s/${id});
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
```

### Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| File | `{resource}.endpoints.ts` | `drink-type.endpoints.ts` |
| Export | `Endpoints{Resource}` | `EndpointsDrinkType` |
| Update Type | `{Resource}Update` | `DrinkTypeUpdate` |

---

## Rules

### ✅ MUST

1. **Use model types from `types/models/`** - Never create custom "Translation" types
2. **Export `{Resource}Update` type** - `Partial<Omit<{Resource}, 'id'>>`
3. **Use `transformFetchError()`** - For all error handling
4. **Return empty array for `getAll()`** - If data is not an array
5. **Use `as const`** - For the endpoints object
6. **Handle try/catch** - Wrap all API calls

### ❌ MUST NOT

1. **Never use `any` types** - Always use proper model types
2. **Never create transformers** - Server already returns camelCase JSON
3. **Never import React/React Query** - Endpoints are pure functions
4. **Never use snake_case handling** - Server returns camelCase
5. **Never create custom "Translation" types** - Use model types directly

---

## Type System

- **Model Types:** Import from `types/models/{resource}.model.ts`
- **Update Types:** `Partial<Omit<{Resource}, 'id'>>`
- **No Transformers:** Server already returns camelCase, use directly

---

## Reference Implementation

- **Example:** `api/endpoints/drink-type.endpoints.ts`
- **Full Guide:** `api/API_ENDPOINTS_AND_QUERIES_GUIDE.md`
