# Rule: Query Hooks Pattern

**Status:** ✅ MANDATORY
**Priority:** Critical
**Last Updated:** December 26, 2025

---

## Overview

TanStack Query hooks MUST follow a consistent pattern and structure. This ensures predictable cache behavior, type safety, and maintainability.

**📖 Full Guide:** See `apps/client/src/api/API_ENDPOINTS_AND_QUERIES_GUIDE.md`

---

## Folder Structure

```
src/queries/{resource}/
├── index.ts                     # Query keys + re-exports
├── useGet{Resource}s.ts         # GET all
├── useGet{Resource}.ts          # GET by ID
├── useCreate{Resource}.ts       # POST
├── useUpdate{Resource}.ts      # PATCH
└── useDelete{Resource}.ts       # DELETE
```

---

## Naming Conventions

| Hook Type | Pattern | Example |
|-----------|---------|---------|
| Get all | `useGet{Resource}s` | `useGetDrinkTypes` |
| Get one | `useGet{Resource}` | `useGetDrinkType` |
| Create | `useCreate{Resource}` | `useCreateDrinkType` |
| Update | `useUpdate{Resource}` | `useUpdateDrinkType` |
| Delete | `useDelete{Resource}` | `useDeleteDrinkType` |

---

## Standard Templates

### GET All

```typescript
import type { ErrorResponse } from '@workspace/core/api';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { Endpoints{Resource} } from 'api/endpoints';
import type { {Resource} } from 'types/models/{resource}.model';
import { GET_{RESOURCE}S_QUERYKEY } from '.';

export const useGet{Resource}s = (): UseQueryResult<{Resource}[], ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_{RESOURCE}S_QUERYKEY],
    queryFn: Endpoints{Resource}.getAll,
  });
};
```

### GET By ID

```typescript
import type { ErrorResponse } from '@workspace/core/api';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { Endpoints{Resource} } from 'api/endpoints';
import type { {Resource} } from 'types/models/{resource}.model';
import { GET_{RESOURCE}S_QUERYKEY } from '.';

export const useGet{Resource} = (id: string): UseQueryResult<{Resource}, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_{RESOURCE}S_QUERYKEY, id],
    queryFn: () => Endpoints{Resource}.getById(id),
    enabled: !!id,
  });
};
```

### CREATE

```typescript
import { useMutation } from '@tanstack/react-query';

import { Endpoints{Resource}, type {Resource}Update } from 'api/endpoints';
import type { {Resource} } from 'types/models/{resource}.model';

export interface Create{Resource}Input {
  // Define required fields
}

export const useCreate{Resource} = () => {
  return useMutation({
    mutationFn: async (data: Create{Resource}Input): Promise<{Resource}> => {
      const updates: {Resource}Update = {
        // Map input to update type
      };
      return Endpoints{Resource}.create(updates);
    },
  });
};
```

### UPDATE

```typescript
import { useMutation } from '@tanstack/react-query';

import { Endpoints{Resource}, type {Resource}Update } from 'api/endpoints';
import type { {Resource} } from 'types/models/{resource}.model';

export interface Update{Resource}Input {
  // Define updatable fields
}

export const useUpdate{Resource} = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Update{Resource}Input;
    }): Promise<{Resource}> => {
      return Endpoints{Resource}.update(id, updates);
    },
  });
};
```

---

## Query Keys

**Location:** `queries/{resource}/index.ts`

```typescript
export const GET_{RESOURCE}S_QUERYKEY = ['get-{resource}s'] as const;
export const GET_{RESOURCE}_QUERYKEY = ['get-{resource}'] as const;
export const POST_{RESOURCE}_QUERYKEY = ['post-{resource}'] as const;
export const PATCH_{RESOURCE}_QUERYKEY = ['patch-{resource}'] as const;
export const DELETE_{RESOURCE}_QUERYKEY = ['delete-{resource}'] as const;
```

**Usage:** Always use spread operator: `[...QUERYKEY]`

---

## Rules

### ✅ MUST

1. **Use model types from `types/models/`** - Never use "Translation" types
2. **Use spread for queryKey** - `[...QUERYKEY]` even if no params
3. **Import ErrorResponse** - From `@workspace/core/api`
4. **Use endpoint methods** - Direct reference: `Endpoints{Resource}.getAll`
5. **Add `enabled` for ID queries** - `enabled: !!id`

### ❌ MUST NOT

1. **Never make direct API calls** - Always use endpoints
2. **Never use inline query keys** - Always use constants
3. **Never skip error types** - Always use `ErrorResponse`
4. **Never create transformers** - Use endpoint return types directly

---

## Reference Implementation

- **Example:** `queries/drink-types/useGetDrinkTypes.ts`
- **Full Guide:** `api/API_ENDPOINTS_AND_QUERIES_GUIDE.md`
