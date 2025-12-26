# API Endpoints and Queries: Definitive Guide

**Last Updated:** December 26, 2025
**Status:** ✅ MANDATORY - All API communication MUST follow this pattern

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [API Endpoints Pattern](#api-endpoints-pattern)
4. [Query Hooks Pattern](#query-hooks-pattern)
5. [Type System](#type-system)
6. [Query Keys](#query-keys)
7. [Error Handling](#error-handling)
8. [Complete Examples](#complete-examples)
9. [Migration Guide](#migration-guide)
10. [Common Mistakes](#common-mistakes)

---

## Overview

This guide defines the **mandatory pattern** for all server communication in the application. It ensures:

- ✅ **Type Safety** - Using model types from `types/models/`
- ✅ **Consistency** - Same pattern across all resources
- ✅ **Maintainability** - Clear separation of concerns
- ✅ **Testability** - Easy to mock and test
- ✅ **No Duplication** - Single source of truth for API calls

---

## Architecture Principles

### 1. Separation of Concerns

```
┌─────────────────────────────────────────────────────────┐
│                    Components                           │
│  (use hooks, never call endpoints directly)            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  Query Hooks                            │
│  (queries/{resource}/useGet{Resource}.ts)              │
│  - React Query integration                              │
│  - Cache management                                     │
│  - Error handling                                       │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  API Endpoints                          │
│  (api/endpoints/{resource}.endpoints.ts)              │
│  - Pure API calls                                       │
│  - No React dependencies                                │
│  - Error transformation                                 │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    API Client                           │
│  (api/fetch.client.ts)                                 │
│  - HTTP client                                          │
│  - Request/response handling                            │
└─────────────────────────────────────────────────────────┘
```

### 2. Type Flow

```
Server Response (camelCase)
    ↓
API Endpoint (returns Model Type)
    ↓
Query Hook (uses Model Type)
    ↓
Component (uses Model Type)
```

**Key Point:** Server already returns camelCase JSON. No transformation needed.

---

## API Endpoints Pattern

### File Location

```
apps/client/src/api/endpoints/{resource}.endpoints.ts
```

### Naming Convention

| Element | Pattern | Example |
|---------|---------|---------|
| File | `{resource}.endpoints.ts` | `drink-type.endpoints.ts` |
| Export | `Endpoints{Resource}` | `EndpointsDrinkType` |
| Update Type | `{Resource}Update` | `DrinkTypeUpdate` |

### Standard Methods

All endpoints MUST implement these standard methods:

- `getAll()` - Get all resources
- `getById(id: string)` - Get single resource
- `create(updates: UpdateType)` - Create new resource
- `update(id: string, updates: UpdateType)` - Update resource
- `delete(id: string)` - Delete resource

### Template

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

### Real Example: Drink Type

```typescript
import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';
import type { DrinkType } from 'types/models/drink-type.model';

export type DrinkTypeUpdate = Partial<Omit<DrinkType, 'id'>>;

export const EndpointsDrinkType = {
  getAll: async (): Promise<DrinkType[]> => {
    try {
      const data = await api.get<DrinkType[]>('/drink-types');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  getById: async (id: string): Promise<DrinkType> => {
    try {
      return await api.get<DrinkType>(`/drink-types/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  update: async (id: string, updates: DrinkTypeUpdate): Promise<DrinkType> => {
    try {
      return await api.patch<DrinkType>(`/drink-types/${id}`, updates);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  create: async (updates: DrinkTypeUpdate): Promise<DrinkType> => {
    try {
      const createData = {
        name: updates.name || '',
        translations: updates.translations || {},
        hasSubtypes: updates.hasSubtypes ?? false,
        defaultTempConsume: updates.defaultTempConsume ?? 5,
        defaultTempFreeze: updates.defaultTempFreeze ?? -2,
        ...updates,
      };

      return await api.post<DrinkType>('/drink-types', createData);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete<void>(`/drink-types/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
```

### Special Cases

#### Nested Resources (e.g., Drink Subtypes)

```typescript
export const EndpointsDrinkSubtype = {
  getAll: async (): Promise<DrinkSubtype[]> => {
    // Fetch all subtypes for all drink types
    // ...
  },

  getByDrinkTypeId: async (drinkTypeId: string): Promise<DrinkSubtype[]> => {
    try {
      const data = await api.get<DrinkSubtype[]>(`/drink-types/${drinkTypeId}/subtypes`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  create: async (updates: DrinkSubtypeUpdate & { drinkTypeId: string }): Promise<DrinkSubtype> => {
    try {
      const { drinkTypeId, ...subtypeData } = updates;
      return await api.post<DrinkSubtype>(`/drink-types/${drinkTypeId}/subtypes`, subtypeData);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  update: async (id: string, updates: DrinkSubtypeUpdate, drinkTypeId: string): Promise<DrinkSubtype> => {
    try {
      return await api.patch<DrinkSubtype>(`/drink-types/${drinkTypeId}/subtypes/${id}`, updates);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  delete: async (id: string, drinkTypeId: string): Promise<void> => {
    try {
      await api.delete<void>(`/drink-types/${drinkTypeId}/subtypes/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
```

### Rules

#### ✅ MUST

1. **Use model types from `types/models/`** - Never create custom "Translation" types
2. **Export `{Resource}Update` type** - `Partial<Omit<{Resource}, 'id'>>`
3. **Use `transformFetchError()`** - For all error handling
4. **Return empty array for `getAll()`** - If data is not an array
5. **Use `as const`** - For the endpoints object
6. **Handle try/catch** - Wrap all API calls

#### ❌ MUST NOT

1. **Never use `any` types** - Always use proper model types
2. **Never create transformers** - Server already returns camelCase
3. **Never import React/React Query** - Endpoints are pure functions
4. **Never use snake_case handling** - Server returns camelCase
5. **Never create custom "Translation" types** - Use model types directly

---

## Query Hooks Pattern

### File Location

```
apps/client/src/queries/{resource}/
├── index.ts                    # Query keys + re-exports
├── useGet{Resource}s.ts         # GET all
├── useGet{Resource}.ts          # GET by ID
├── useCreate{Resource}.ts       # POST
├── useUpdate{Resource}.ts       # PATCH
└── useDelete{Resource}.ts       # DELETE
```

### Naming Convention

| Hook Type | Pattern | Example |
|-----------|---------|---------|
| Get all | `useGet{Resource}s` | `useGetDrinkTypes` |
| Get one | `useGet{Resource}` | `useGetDrinkType` |
| Create | `useCreate{Resource}` | `useCreateDrinkType` |
| Update | `useUpdate{Resource}` | `useUpdateDrinkType` |
| Delete | `useDelete{Resource}` | `useDeleteDrinkType` |

### Template: GET All

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

### Template: GET By ID

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

### Template: CREATE

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

### Template: UPDATE

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

### Real Example: Drink Types

```typescript
// useGetDrinkTypes.ts
import type { ErrorResponse } from '@workspace/core/api';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { EndpointsDrinkType } from 'api/endpoints';
import type { DrinkType } from 'types/models/drink-type.model';
import { GET_DRINK_TYPES_QUERYKEY } from '.';

export const useGetDrinkTypes = (): UseQueryResult<DrinkType[], ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_DRINK_TYPES_QUERYKEY],
    queryFn: EndpointsDrinkType.getAll,
  });
};
```

### Rules

#### ✅ MUST

1. **Use model types** - From `types/models/`, not "Translation" types
2. **Use spread for queryKey** - `[...QUERYKEY]` even if no params
3. **Import ErrorResponse** - From `@workspace/core/api`
4. **Use endpoint methods** - Direct reference: `Endpoints{Resource}.getAll`
5. **Add `enabled` for ID queries** - `enabled: !!id`

#### ❌ MUST NOT

1. **Never make direct API calls** - Always use endpoints
2. **Never use inline query keys** - Always use constants
3. **Never skip error types** - Always use `ErrorResponse`
4. **Never create transformers** - Use endpoint return types directly

---

## Type System

### Model Types

All types come from `types/models/{resource}.model.ts`:

```typescript
// types/models/drink-type.model.ts
export type DrinkType = OverridePropTypes<
  DrinkTypeCamelCase,
  ModelBaseProps & {
    hasSubtypes: boolean;
    translations: Record<string, string>;
  }
>;
```

### Update Types

Defined in endpoint files:

```typescript
// api/endpoints/drink-type.endpoints.ts
export type DrinkTypeUpdate = Partial<Omit<DrinkType, 'id'>>;
```

### Input Types

Defined in query hooks (for create/update):

```typescript
// queries/drink-types/useCreateDrinkType.ts
export interface CreateDrinkTypeInput {
  name: string;
  hasSubtypes?: boolean;
  defaultTempConsume?: number;
  defaultTempFreeze?: number;
  translations?: Record<string, string>;
}
```

---

## Query Keys

### Location

Defined in `queries/{resource}/index.ts`

### Pattern

```typescript
export const GET_{RESOURCE}S_QUERYKEY = ['get-{resource}s'] as const;
export const GET_{RESOURCE}_QUERYKEY = ['get-{resource}'] as const;
export const POST_{RESOURCE}_QUERYKEY = ['post-{resource}'] as const;
export const PATCH_{RESOURCE}_QUERYKEY = ['patch-{resource}'] as const;
export const DELETE_{RESOURCE}_QUERYKEY = ['delete-{resource}'] as const;
```

### Usage

```typescript
// List query
queryKey: [...GET_DRINK_TYPES_QUERYKEY]

// Detail query
queryKey: [...GET_DRINK_TYPES_QUERYKEY, id]
```

### Rules

- ✅ **Always use spread** - `[...QUERYKEY]` for consistency
- ✅ **Uppercase constants** - `GET_DRINK_TYPES_QUERYKEY`
- ✅ **Lowercase kebab-case values** - `['get-drink-types']`
- ❌ **Never use functions** - Static constants only
- ❌ **Never use template strings** - Static values only

---

## Error Handling

### Endpoint Level

```typescript
try {
  return await api.get<Resource>('/resource');
} catch (error) {
  throw transformFetchError(error);
}
```

### Query Hook Level

```typescript
export const useGetResource = (): UseQueryResult<Resource[], ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_RESOURCE_QUERYKEY],
    queryFn: EndpointsResource.getAll,
    // Error handling is automatic via ErrorResponse type
  });
};
```

---

## Complete Examples

### Example 1: Simple Resource (Volume)

**Endpoint:**
```typescript
// api/endpoints/volume.endpoints.ts
import { transformFetchError } from '@workspace/core/api';
import { api } from 'api';
import type { DrinkVolume } from 'types/models/volume.model';

export type VolumeUpdate = Partial<Omit<DrinkVolume, 'id'>>;

export const EndpointsVolume = {
  getAll: async (): Promise<DrinkVolume[]> => {
    try {
      const data = await api.get<DrinkVolume[]>('/drink-volumes');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw transformFetchError(error);
    }
  },
  // ... other methods
} as const;
```

**Query Hook:**
```typescript
// queries/drink-volumes/useGetDrinkVolumes.ts
import type { ErrorResponse } from '@workspace/core/api';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { EndpointsVolume } from 'api/endpoints';
import type { DrinkVolume } from 'types/models/volume.model';
import { GET_DRINK_VOLUMES_QUERYKEY } from '.';

export const useGetDrinkVolumes = (): UseQueryResult<DrinkVolume[], ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_DRINK_VOLUMES_QUERYKEY],
    queryFn: EndpointsVolume.getAll,
  });
};
```

### Example 2: Nested Resource (Drink Subtype)

**Endpoint:**
```typescript
// api/endpoints/drink-subtype.endpoints.ts
export const EndpointsDrinkSubtype = {
  getByDrinkTypeId: async (drinkTypeId: string): Promise<DrinkSubtype[]> => {
    try {
      const data = await api.get<DrinkSubtype[]>(`/drink-types/${drinkTypeId}/subtypes`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw transformFetchError(error);
    }
  },
  // ... other methods
} as const;
```

**Query Hook:**
```typescript
// queries/drink-types/useGetDrinkSubtypes.ts
export const useGetDrinkSubtypes = ({
  drinkTypeId,
  enabled,
}: {
  drinkTypeId: string;
  enabled?: boolean;
}): UseQueryResult<DrinkSubtype[], ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_DRINK_SUBTYPES_QUERYKEY, drinkTypeId],
    queryFn: () => EndpointsDrinkSubtype.getByDrinkTypeId(drinkTypeId),
    enabled: enabled !== false && !!drinkTypeId,
  });
};
```

---

## Migration Guide

### Step 1: Create Endpoint File

1. Create `api/endpoints/{resource}.endpoints.ts`
2. Import model type from `types/models/`
3. Define `{Resource}Update` type
4. Implement standard methods
5. Export endpoint object

### Step 2: Update Query Hooks

1. Update imports to use endpoint methods
2. Update types to use model types
3. Update queryKey to use spread operator
4. Remove any transformers or manual API calls

### Step 3: Update Exports

1. Add to `api/endpoints/index.ts`
2. Update query `index.ts` if needed

### Step 4: Test

1. Test all CRUD operations
2. Verify types are correct
3. Check for linter errors

---

## Common Mistakes

### ❌ Using Custom "Translation" Types

```typescript
// ❌ WRONG
export interface DrinkTypeTranslation {
  id: string;
  name: string;
  translations: Record<string, string>;
}

// ✅ CORRECT
import type { DrinkType } from 'types/models/drink-type.model';
```

### ❌ Creating Unnecessary Transformers

```typescript
// ❌ WRONG
const transformDrinkType = (serverData: any): DrinkType => ({
  id: serverData.id,
  name: serverData.name,
  hasSubtypes: serverData.has_subtypes ?? serverData.hasSubtypes,
  // ...
});

// ✅ CORRECT
// Server already returns camelCase, use directly
const data = await api.get<DrinkType[]>('/drink-types');
```

### ❌ Not Using Spread for Query Keys

```typescript
// ❌ WRONG
queryKey: GET_DRINK_TYPES_QUERYKEY

// ✅ CORRECT
queryKey: [...GET_DRINK_TYPES_QUERYKEY]
```

### ❌ Direct API Calls in Hooks

```typescript
// ❌ WRONG
export const useGetDrinkTypes = () => {
  return useQuery({
    queryKey: [...GET_DRINK_TYPES_QUERYKEY],
    queryFn: async () => await api.get('/drink-types'),
  });
};

// ✅ CORRECT
export const useGetDrinkTypes = () => {
  return useQuery({
    queryKey: [...GET_DRINK_TYPES_QUERYKEY],
    queryFn: EndpointsDrinkType.getAll,
  });
};
```

### ❌ Missing ErrorResponse Type

```typescript
// ❌ WRONG
export const useGetDrinkTypes = (): UseQueryResult<DrinkType[]> => {
  // ...
};

// ✅ CORRECT
import type { ErrorResponse } from '@workspace/core/api';
export const useGetDrinkTypes = (): UseQueryResult<DrinkType[], ErrorResponse> => {
  // ...
};
```

---

## Reference Files

- **Endpoint Example:** `api/endpoints/drink-type.endpoints.ts`
- **Query Hook Example:** `queries/drink-types/useGetDrinkTypes.ts`
- **Query Keys Example:** `queries/drink-types/index.ts`
- **Model Types:** `types/models/drink-type.model.ts`

---

## Summary Checklist

When creating a new resource:

- [ ] Create endpoint file in `api/endpoints/`
- [ ] Use model type from `types/models/`
- [ ] Define `{Resource}Update` type
- [ ] Implement standard methods (getAll, getById, create, update, delete)
- [ ] Export endpoint object with `as const`
- [ ] Create query hooks in `queries/{resource}/`
- [ ] Use spread operator for queryKey
- [ ] Import ErrorResponse type
- [ ] Use endpoint methods directly (no manual API calls)
- [ ] Add exports to `api/endpoints/index.ts`
- [ ] Test all operations

---

**Remember:** Keep it simple, type-safe, and consistent. The server already returns camelCase JSON, so no transformation is needed. Use model types directly, and let the endpoint layer handle API communication.

