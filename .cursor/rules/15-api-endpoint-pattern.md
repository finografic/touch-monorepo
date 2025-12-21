# API Endpoint Pattern (Unified)

**Status:** 🟢 Active - Mandatory for all new code
**Last Updated:** Dec 21, 2025

---

## 🎯 Core Principle

> **ALL server communication goes through `api/endpoints/{resource}.endpoints.ts`**

This pattern eliminates boundary erosion and ensures consistent:
- Error handling
- Type safety
- Transformation logic
- Testability

---

## 📁 File Structure

```
src/
├── api/                                # Transport layer (framework-agnostic)
│   ├── fetch-client.ts                # Base HTTP client (DO NOT import directly)
│   ├── index.ts                       # Exports { api }
│   ├── endpoints/                     # ALL endpoint definitions
│   │   ├── container-types.endpoints.ts
│   │   ├── drink-types.endpoints.ts
│   │   ├── orders.endpoints.ts
│   │   └── index.ts                   # Re-exports all endpoints
│   └── batch/                         # Specialized batch operations only
│
└── queries/                           # React Query layer (React-specific)
    └── {resource}/                    # One folder per resource
        ├── index.ts                   # Query keys + re-exports
        ├── useGet{Resource}s.ts       # GET all
        ├── useGet{Resource}.ts        # GET by ID
        ├── useCreate{Resource}.ts     # POST
        ├── useUpdate{Resource}.ts     # PATCH
        └── useDelete{Resource}.ts     # DELETE
```

---

## 🔒 Hard Rules

### ❌ FORBIDDEN

1. **NO direct `api` calls in query hooks**
   ```typescript
   // ❌ BAD - Direct api call
   export const useGetOrders = () => {
     return useQuery({
       queryKey: ['orders'],
       queryFn: () => api.get('/orders'), // NEVER DO THIS
     });
   };
   ```

2. **NO React imports in `api/` folder**
   ```typescript
   // ❌ BAD - React in api layer
   import { useQuery } from '@tanstack/react-query'; // NEVER in api/
   ```

3. **NO multiple endpoint patterns**
   - No helpers, no shortcuts, no "special cases"
   - One pattern for everything

### ✅ REQUIRED

1. **ALL endpoints in `api/endpoints/{resource}.endpoints.ts`**
2. **Consistent naming:** `{resource}Endpoints` (plural)
3. **Standard method names:** `getAll`, `getById`, `create`, `update`, `delete`
4. **Type safety:** Export input/output types
5. **Error handling:** Use `transformFetchError` from `@workspace/core/api`

---

## 📋 Endpoint File Template

### File: `api/endpoints/{resource}.endpoints.ts`

```typescript
import { transformFetchError } from '@workspace/core/api';
import { api } from 'api';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Server response type (what the API returns)
 */
export interface {Resource}Entity {
  id: string;
  name: string;
  // ... other server fields (snake_case if needed)
}

/**
 * Client type (what we use in the app)
 */
export interface {Resource} {
  id: string;
  name: string;
  // ... normalized fields (camelCase)
}

/**
 * Input type for creating a resource
 */
export interface Create{Resource}Input {
  name: string;
  // ... required fields
}

/**
 * Input type for updating a resource
 */
export interface Update{Resource}Input {
  name?: string;
  // ... optional fields for partial updates
}

// ============================================================================
// TRANSFORMERS
// ============================================================================

/**
 * Transform server response to client format
 * Handles: snake_case → camelCase, date parsing, nested data normalization
 */
const transform{Resource} = (serverData: any): {Resource} => ({
  id: serverData.id,
  name: serverData.name,
  // Normalize dates
  createdAt: serverData.created_at 
    ? new Date(serverData.created_at) 
    : new Date(),
  // Handle translations
  translations: serverData.translations || {},
  // ... other transformations
});

// ============================================================================
// ENDPOINTS
// ============================================================================

/**
 * {Resource} API endpoints
 * 
 * All server communication for {resource}s.
 * Used by query hooks and React Router loaders.
 */
export const {resource}Endpoints = {
  /**
   * Get all {resource}s
   */
  getAll: async (): Promise<{Resource}[]> => {
    try {
      const data = await api.get<any[]>('/{resources}');
      return Array.isArray(data) ? data.map(transform{Resource}) : [];
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Get single {resource} by ID
   */
  getById: async (id: string): Promise<{Resource}> => {
    try {
      const data = await api.get<any>(`/{resources}/${id}`);
      return transform{Resource}(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Create a new {resource}
   */
  create: async (input: Create{Resource}Input): Promise<{Resource}> => {
    try {
      const data = await api.post<any>('/{resources}', input);
      return transform{Resource}(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Update an existing {resource}
   */
  update: async (id: string, input: Update{Resource}Input): Promise<{Resource}> => {
    try {
      const data = await api.patch<any>(`/{resources}/${id}`, input);
      return transform{Resource}(data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Delete a {resource}
   */
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete<void>(`/{resources}/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
```

---

## 📋 Query Hook Template

### File: `queries/{resource}/useGet{Resource}s.ts`

```typescript
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';

import { {resource}Endpoints, type {Resource} } from 'api/endpoints';
import { GET_{RESOURCE}S_QUERYKEY } from '.';

/**
 * Get all {resource}s
 */
export const useGet{Resource}s = (): UseQueryResult<{Resource}[], ErrorResponse> => {
  return useQuery({
    queryKey: GET_{RESOURCE}S_QUERYKEY,
    queryFn: {resource}Endpoints.getAll,
  });
};
```

### File: `queries/{resource}/useCreate{Resource}.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { {resource}Endpoints, type Create{Resource}Input } from 'api/endpoints';
import { GET_{RESOURCE}S_QUERYKEY } from '.';

/**
 * Create a new {resource}
 */
export const useCreate{Resource} = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: {resource}Endpoints.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GET_{RESOURCE}S_QUERYKEY });
    },
  });
};
```

---

## 🔗 React Router Loader Usage

Endpoint functions can be used directly in loaders (they're not hooks):

```typescript
// routes/orders.tsx
import { ordersEndpoints } from 'api/endpoints';

export const loader = ordersEndpoints.getAll;

// Or with parameters:
export const loader = ({ params }: LoaderFunctionArgs) => {
  return ordersEndpoints.getById(params.id);
};
```

---

## 📊 Naming Conventions

### Endpoint Files
- **Format:** `{resource}.endpoints.ts` (singular, kebab-case)
- **Examples:** `order.endpoints.ts`, `drink-type.endpoints.ts`

### Endpoint Objects
- **Format:** `{resource}Endpoints` (singular, camelCase)
- **Examples:** `orderEndpoints`, `drinkTypeEndpoints`

### Endpoint Methods
- **Standard names:** `getAll`, `getById`, `create`, `update`, `delete`
- **Custom methods:** Descriptive names like `getByStatus`, `batchUpdate`

### Query Hooks
- **Format:** `use{Action}{Resource}`
- **Examples:** `useGetOrders`, `useCreateOrder`, `useUpdateOrder`

### Query Keys
- **Format:** `GET_{RESOURCE}S_QUERYKEY` (uppercase, snake_case, plural)
- **Examples:** `GET_ORDERS_QUERYKEY`, `GET_DRINK_TYPES_QUERYKEY`

---

## ✅ Migration Checklist

When migrating existing code:

1. [ ] Create/update `api/endpoints/{resource}.endpoints.ts`
2. [ ] Define all types (entity, client, input types)
3. [ ] Implement transformer function
4. [ ] Implement all endpoint methods (getAll, getById, create, update, delete)
5. [ ] Export from `api/endpoints/index.ts`
6. [ ] Update query hooks to use endpoints
7. [ ] Remove direct `api` calls from hooks
8. [ ] Test all operations
9. [ ] Delete any old helper patterns

---

## 🎓 Benefits

### For Developers
- **One pattern to learn** - no decisions about "which pattern should I use?"
- **Clear separation** - transport layer vs. cache layer
- **Easy to find** - all endpoints in one predictable location
- **Type safety** - full TypeScript support throughout

### For AI Agents
- **Unambiguous rules** - prevents creating new patterns
- **Clear constraints** - can't accidentally break boundaries
- **Obvious right way** - no room for interpretation

### For Codebase
- **Consistency** - all API calls look the same
- **Maintainability** - changes in one place
- **Testability** - endpoints can be tested without React
- **Reusability** - endpoints work in hooks, loaders, and anywhere else

---

## 🚨 Anti-Patterns to Avoid

### ❌ Mixed Patterns
```typescript
// ❌ BAD - Some use endpoints, some use direct calls
const data1 = await ordersEndpoints.getAll();
const data2 = await api.get('/orders'); // INCONSISTENT!
```

### ❌ Helper Objects
```typescript
// ❌ BAD - Don't create alternative helper patterns
export const EndpointHelper = {
  getOrders: () => api.get('/orders'),
};
```

### ❌ Inline Transformations
```typescript
// ❌ BAD - Transformation logic in hooks
export const useGetOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const data = await ordersEndpoints.getAll();
      return data.map(order => ({ ...order, transformed: true })); // NO!
    },
  });
};
```

### ❌ React in API Layer
```typescript
// ❌ BAD - No hooks in endpoints
import { useQuery } from '@tanstack/react-query';

export const ordersEndpoints = {
  getAll: () => useQuery(...), // NEVER!
};
```

---

## 📚 Reference Implementation

See `api/endpoints/container-types.endpoints.ts` for complete reference implementation.

---

## 🔄 Relationship to Other Rules

- **Builds on:** `12-query-keys.md` (query key conventions)
- **Related to:** `13-hooks-one-per-file.md` (one hook per file)
- **Enforces:** `01-monorepo.md` (clear layer boundaries)

---

**Remember:** Make the RIGHT way the OBVIOUS way, and make the WRONG way impossible.

