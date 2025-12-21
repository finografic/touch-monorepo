# API Architecture - Touch Monorepo

**Last Updated:** December 21, 2025  
**Status:** ✅ Production Ready

---

## 📐 Architecture Overview

The Touch Monorepo uses a **3-layer architecture** for API communication:

```
┌─────────────────────────────────────────────────┐
│  UI Components (React)                          │
│  ↓ use hooks                                    │
├─────────────────────────────────────────────────┤
│  Query Hooks Layer (src/queries/)              │
│  - TanStack Query wrappers                     │
│  - Cache management                            │
│  - React-specific logic                        │
│  ↓ call endpoint functions                     │
├─────────────────────────────────────────────────┤
│  Endpoints Layer (src/api/endpoints/)          │
│  - Pure TypeScript functions                   │
│  - Type transformations                        │
│  - Error handling                              │
│  ↓ use HTTP client                             │
├─────────────────────────────────────────────────┤
│  HTTP Client (src/api/fetch-client.ts)         │
│  - Base fetch wrapper                          │
│  - Request/response normalization              │
│  ↓ HTTP                                        │
├─────────────────────────────────────────────────┤
│  Server API (Hono)                             │
└─────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```
apps/client/src/
├── api/
│   ├── fetch-client.ts              # Base HTTP client (DO NOT import directly)
│   ├── index.ts                     # Exports { api }
│   │
│   ├── endpoints/                   # ⭐ ALL endpoint definitions
│   │   ├── index.ts                 # Re-exports all endpoints
│   │   ├── container-types.endpoints.ts
│   │   ├── drink-types.endpoints.ts
│   │   ├── orders.endpoints.ts
│   │   ├── modes.endpoints.ts
│   │   ├── relays.endpoints.ts
│   │   ├── sounds.endpoints.ts
│   │   ├── slot-configurations.endpoints.ts
│   │   ├── translations-ui.endpoints.ts
│   │   └── supported-languages.endpoints.ts
│   │
│   ├── batch/                       # Specialized batch operations
│   │   └── batch-translations.ts
│   │
│   └── loaders/                     # React Router loaders
│       └── loader.data.ts
│
└── queries/                         # ⭐ TanStack Query hooks
    ├── container-types/
    │   ├── index.ts                 # Query keys + re-exports
    │   ├── useGetContainerTypes.ts
    │   ├── useGetContainerType.ts
    │   ├── useCreateContainerType.ts
    │   └── useUpdateContainerType.ts
    │
    ├── orders/
    │   ├── index.ts
    │   ├── useGetOrdersReadable.ts
    │   ├── useCreateOrder.ts
    │   └── ...
    │
    └── [other resources]/
```

---

## 🎯 Layer 1: Endpoints (Transport Layer)

### Purpose
- Define **ALL** server communication
- Framework-agnostic (no React imports)
- Pure TypeScript functions
- Type transformations (server ↔ client)
- Error handling

### File Pattern: `api/endpoints/{resource}.endpoints.ts`

```typescript
// api/endpoints/container-types.endpoints.ts

import { transformFetchError } from '@workspace/core/api';
import { api } from 'api';

// ============================================================================
// TYPES
// ============================================================================

export interface ContainerType {
  id: string;
  name: string;
  thermalConductivity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  translations: Record<string, string>;
}

export interface CreateContainerTypeInput {
  name: string;
  thermalConductivity: number;
  translations?: Record<string, string>;
}

export interface UpdateContainerTypeInput {
  name?: string;
  thermalConductivity?: number;
  translations?: Record<string, string>;
  isActive?: boolean;
}

// ============================================================================
// TRANSFORMERS (Private)
// ============================================================================

const transformContainerType = (serverData: any): ContainerType => ({
  id: serverData.id,
  name: serverData.name,
  thermalConductivity: serverData.thermal_conductivity ?? serverData.thermalConductivity,
  isActive: Boolean(serverData.is_active ?? serverData.isActive),
  createdAt: new Date(serverData.created_at),
  updatedAt: new Date(serverData.updated_at),
  translations: serverData.translations || {},
});

// ============================================================================
// ENDPOINTS (Public API)
// ============================================================================

export const containerTypesEndpoints = {
  /**
   * Get all container types
   */
  getAll: async (): Promise<ContainerType[]> => {
    try {
      const data = await api.get<any[]>('/container-types');
      return Array.isArray(data) ? data.map(transformContainerType) : [];
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Get single container type by ID
   */
  getById: async (id: string): Promise<ContainerType> => {
    try {
      const data = await api.get<any>(`/container-types/${id}`);
      return transformContainerType(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Create a new container type
   */
  create: async (input: CreateContainerTypeInput): Promise<ContainerType> => {
    try {
      const data = await api.post<any>('/container-types', input);
      return transformContainerType(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Update an existing container type
   */
  update: async (id: string, input: UpdateContainerTypeInput): Promise<ContainerType> => {
    try {
      const data = await api.patch<any>(`/container-types/${id}`, input);
      return transformContainerType(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Delete a container type
   */
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete<void>(`/container-types/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
```

### Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| File name | `{resource}.endpoints.ts` | `container-types.endpoints.ts` |
| Export name | `{resource}Endpoints` (plural) | `containerTypesEndpoints` |
| Methods | Standard CRUD | `getAll`, `getById`, `create`, `update`, `delete` |
| Types | Descriptive | `ContainerType`, `CreateContainerTypeInput` |

---

## 🎯 Layer 2: Query Hooks (Cache Management Layer)

### Purpose
- React-specific cache management
- TanStack Query wrappers
- Query invalidation logic
- Optimistic updates (optional)

### File Pattern: `queries/{resource}/use{Action}{Resource}.ts`

```typescript
// queries/container-types/useGetContainerTypes.ts

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

```typescript
// queries/container-types/useCreateContainerType.ts

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
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: GET_CONTAINER_TYPES_QUERYKEY });
    },
  });
};
```

```typescript
// queries/container-types/index.ts

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

// ============================================================================
// TYPES (re-exported from endpoints for convenience)
// ============================================================================
export type {
  ContainerType,
  CreateContainerTypeInput,
  UpdateContainerTypeInput,
} from 'api/endpoints';
```

### Folder Structure per Resource

```
queries/{resource}/
├── index.ts                      # Query keys + re-exports
├── useGet{Resource}s.ts          # GET all
├── useGet{Resource}.ts           # GET by ID
├── useCreate{Resource}.ts        # POST
├── useUpdate{Resource}.ts        # PATCH
└── useDelete{Resource}.ts        # DELETE
```

---

## 🎯 Layer 3: React Router Loaders

### Purpose
- Pre-fetch data before route rendering
- SSR-compatible data loading
- Use endpoint functions directly (not hooks)

### Pattern

```typescript
// api/loaders/loader.data.ts

import { containerTypesEndpoints, ordersEndpoints } from 'api/endpoints';

// Direct function assignment (loaders are not hooks)
export const containerTypesLoader = containerTypesEndpoints.getAll;

// With parameters
export const orderLoader = ({ params }: LoaderFunctionArgs) => {
  return ordersEndpoints.getByIdReadable(params.orderId!);
};
```

```typescript
// routes/container-types.tsx

import { containerTypesLoader } from 'api/loaders/loader.data';

export const Route = {
  path: '/container-types',
  loader: containerTypesLoader,
  Component: ContainerTypesPage,
};
```

---

## 🚫 Anti-Patterns (DO NOT DO)

### ❌ Direct API Calls in Hooks

```typescript
// ❌ BAD - Don't do this
export const useGetOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders'), // NEVER!
  });
};
```

### ❌ React Imports in Endpoints

```typescript
// ❌ BAD - Don't do this
import { useQuery } from '@tanstack/react-query'; // NEVER in api/

export const ordersEndpoints = {
  getAll: () => useQuery(...), // NEVER!
};
```

### ❌ Multiple Endpoint Patterns

```typescript
// ❌ BAD - Don't create alternative patterns
export const EndpointHelper = {
  getOrders: () => api.get('/orders'),
};

// ✅ GOOD - Use api/endpoints/ folder only
export const ordersEndpoints = { ... };
```

---

## ✅ Usage Examples

### In a Component

```typescript
// components/ContainerTypesList.tsx

import { useGetContainerTypes } from 'queries/container-types';

export const ContainerTypesList = () => {
  const { data: containerTypes, isLoading } = useGetContainerTypes();

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {containerTypes?.map((type) => (
        <li key={type.id}>{type.name}</li>
      ))}
    </ul>
  );
};
```

### Creating a Resource

```typescript
// components/CreateContainerTypeForm.tsx

import { useCreateContainerType } from 'queries/container-types';

export const CreateContainerTypeForm = () => {
  const createMutation = useCreateContainerType();

  const handleSubmit = (formData: CreateContainerTypeInput) => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        alert('Created successfully!');
      },
    });
  };

  // ... render form
};
```

### In a Loader

```typescript
// routes/orders/[id].tsx

import { ordersEndpoints } from 'api/endpoints';

export const loader = ({ params }: LoaderFunctionArgs) => {
  return ordersEndpoints.getByIdReadable(params.id!);
};
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Action (button click, form submit)                  │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Component calls hook                                      │
│    const mutation = useCreateOrder();                        │
│    mutation.mutate(orderData);                               │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Hook calls endpoint function                              │
│    mutationFn: ordersEndpoints.create                        │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Endpoint transforms data & makes HTTP request            │
│    await api.post('/orders', data)                           │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Server processes request                                  │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Response flows back through layers                        │
│    Server → Endpoint (transform) → Hook (cache) → Component │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Hook invalidates queries, UI updates                     │
│    queryClient.invalidateQueries()                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎓 Key Principles

1. **Separation of Concerns**
   - Endpoints = Transport (HTTP calls)
   - Queries = Cache (React Query)
   - Components = UI (React)

2. **Single Source of Truth**
   - All endpoint definitions in `api/endpoints/`
   - No direct `api` calls elsewhere

3. **Type Safety**
   - Full TypeScript throughout
   - Types exported from endpoints
   - Re-exported from query index for convenience

4. **Framework Agnostic Endpoints**
   - No React imports in `api/`
   - Reusable in non-React contexts
   - Compatible with loaders

5. **Consistent Naming**
   - Files: kebab-case (`container-types.endpoints.ts`)
   - Exports: camelCase plural (`containerTypesEndpoints`)
   - Methods: standard names (`getAll`, `create`, `update`)

---

## 📚 Reference

- **Pattern Documentation:** `.cursor/rules/15-api-endpoint-pattern.md`
- **Reference Implementation:** `api/endpoints/container-types.endpoints.ts`
- **Query Keys Convention:** `.cursor/rules/12-query-keys.md`

---

**Last Updated:** December 21, 2025  
**Maintainer:** Touch Monorepo Team

