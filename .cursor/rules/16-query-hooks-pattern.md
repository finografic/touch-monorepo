# Rule: Query Hooks Pattern

**Status:** ✅ MANDATORY
**Priority:** Critical
**Created:** December 21, 2025

---

## Overview

TanStack Query hooks MUST follow a consistent pattern and structure. This ensures predictable cache behavior and maintainability.

---

## Folder Structure

```
src/queries/{resource}/
├── index.ts                     # Query keys + re-exports
├── useGet{Resource}s.ts         # GET all
├── useGet{Resource}.ts          # GET by ID
├── useCreate{Resource}.ts       # POST
├── useUpdate{Resource}.ts       # PATCH/PUT
└── useDelete{Resource}.ts       # DELETE
```

---

## Naming Conventions

| Hook Type | Pattern | Example |
|-----------|---------|---------|
| Get all | `useGet{Resource}s` | `useGetContainerTypes` |
| Get one | `useGet{Resource}` | `useGetContainerType` |
| Create | `useCreate{Resource}` | `useCreateContainerType` |
| Update | `useUpdate{Resource}` | `useUpdateContainerType` |
| Delete | `useDelete{Resource}` | `useDeleteContainerType` |

---

## Query Keys Pattern

**Location:** `queries/{resource}/index.ts`

```typescript
// ============================================================================
// QUERY KEYS
// ============================================================================
export const GET_CONTAINER_TYPES_QUERYKEY = ['get-container-types'] as const;
export const GET_CONTAINER_TYPE_QUERYKEY = ['get-container-type'] as const;
export const POST_CONTAINER_TYPE_QUERYKEY = ['post-container-type'] as const;
export const PATCH_CONTAINER_TYPE_QUERYKEY = ['patch-container-type'] as const;
export const DELETE_CONTAINER_TYPE_QUERYKEY = ['delete-container-type'] as const;
```

**Pattern:** `{HTTP_METHOD}_{RESOURCE}_QUERYKEY`

---

## Hook Templates

### GET All (useQuery)

```typescript
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';

import { containerTypesEndpoints, type ContainerType } from 'api/endpoints';
import { GET_CONTAINER_TYPES_QUERYKEY } from '.';

/**
 * Get all container types
 */
export const useGetContainerTypes = (): UseQueryResult<ContainerType[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_CONTAINER_TYPES_QUERYKEY,
    queryFn: containerTypesEndpoints.getAll,
  });
};
```

### GET By ID (useQuery with params)

```typescript
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';

import { containerTypesEndpoints, type ContainerType } from 'api/endpoints';
import { GET_CONTAINER_TYPE_QUERYKEY } from '.';

/**
 * Get a single container type by ID
 */
export const useGetContainerType = (id: string): UseQueryResult<ContainerType, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_CONTAINER_TYPE_QUERYKEY, id],
    queryFn: () => containerTypesEndpoints.getById(id),
    enabled: Boolean(id),
  });
};
```

### CREATE (useMutation)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { containerTypesEndpoints, type CreateContainerTypeInput } from 'api/endpoints';
import { GET_CONTAINER_TYPES_QUERYKEY } from '.';

/**
 * Create a new container type
 */
export const useCreateContainerType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: containerTypesEndpoints.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GET_CONTAINER_TYPES_QUERYKEY });
    },
  });
};
```

### UPDATE (useMutation with ID)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { containerTypesEndpoints, type UpdateContainerTypeInput } from 'api/endpoints';
import { GET_CONTAINER_TYPES_QUERYKEY, GET_CONTAINER_TYPE_QUERYKEY } from '.';

/**
 * Update an existing container type
 */
export const useUpdateContainerType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateContainerTypeInput }) =>
      containerTypesEndpoints.update(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: GET_CONTAINER_TYPES_QUERYKEY });
      queryClient.invalidateQueries({ queryKey: [...GET_CONTAINER_TYPE_QUERYKEY, variables.id] });
    },
  });
};
```

### DELETE (useMutation)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { containerTypesEndpoints } from 'api/endpoints';
import { GET_CONTAINER_TYPES_QUERYKEY, GET_CONTAINER_TYPE_QUERYKEY } from '.';

/**
 * Delete a container type
 */
export const useDeleteContainerType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: containerTypesEndpoints.delete,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: GET_CONTAINER_TYPES_QUERYKEY });
      queryClient.invalidateQueries({ queryKey: [...GET_CONTAINER_TYPE_QUERYKEY, deletedId] });
    },
  });
};
```

---

## Index File Pattern

```typescript
// queries/{resource}/index.ts

// ============================================================================
// QUERY KEYS
// ============================================================================
export const GET_CONTAINER_TYPES_QUERYKEY = ['get-container-types'] as const;
export const POST_CONTAINER_TYPE_QUERYKEY = ['post-container-type'] as const;
export const PATCH_CONTAINER_TYPE_QUERYKEY = ['patch-container-type'] as const;
export const DELETE_CONTAINER_TYPE_QUERYKEY = ['delete-container-type'] as const;

// ============================================================================
// HOOKS
// ============================================================================
export { useGetContainerTypes } from './useGetContainerTypes';
export { useGetContainerType } from './useGetContainerType';
export { useCreateContainerType } from './useCreateContainerType';
export { useUpdateContainerType } from './useUpdateContainerType';
export { useDeleteContainerType } from './useDeleteContainerType';

// ============================================================================
// TYPES (re-exported from endpoints for convenience)
// ============================================================================
export type {
  ContainerType,
  CreateContainerTypeInput,
  UpdateContainerTypeInput,
} from 'api/endpoints';
```

---

## Rules

### ✅ MUST

1. **One hook per file**
2. **Hooks MUST use endpoint functions for `queryFn` / `mutationFn`**
3. **Mutations MUST invalidate relevant queries on success**
4. **Query keys MUST be defined in `index.ts`**
5. **Query keys MUST be uppercase constants**
6. **Export types from endpoint layer**
7. **Add JSDoc comment to each hook**

### ❌ MUST NOT

1. **Never make direct API calls in hooks** (use endpoints)
2. **Never define query keys inline** (use constants)
3. **Never import React Query types in endpoint files**
4. **Never skip invalidation after mutations**

---

## Query Invalidation Strategy

### Simple Pattern

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: GET_RESOURCE_QUERYKEY });
}
```

### Specific + List Invalidation

```typescript
onSuccess: (_, variables) => {
  // Invalidate list
  queryClient.invalidateQueries({ queryKey: GET_RESOURCES_QUERYKEY });
  // Invalidate specific item
  queryClient.invalidateQueries({ queryKey: [...GET_RESOURCE_QUERYKEY, variables.id] });
}
```

---

## Component Usage Example

```typescript
// components/ContainerTypesList.tsx

import { useGetContainerTypes, useDeleteContainerType } from 'queries/container-types';

export const ContainerTypesList = () => {
  const { data, isLoading } = useGetContainerTypes();
  const deleteMutation = useDeleteContainerType();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('Deleted successfully'),
      onError: () => toast.error('Failed to delete'),
    });
  };

  // ... render
};
```

---

## Reference

- **Full Documentation:** `/docs/API_ARCHITECTURE.md`
- **Reference Implementation:** `queries/container-types/`

