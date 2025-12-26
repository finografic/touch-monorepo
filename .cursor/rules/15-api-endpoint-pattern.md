# Rule: API Endpoint Pattern

**Status:** ✅ MANDATORY
**Priority:** Critical
**Created:** December 21, 2025

---

## Overview

ALL server communication MUST follow the unified endpoint pattern. This rule eliminates fragmentation and ensures consistency across the codebase.

---

## The Pattern

### 1. File Location

```
apps/client/src/api/endpoints/{resource}.endpoints.ts
```

### 2. File Structure Template

```typescript
// SECTION 1: TYPES
export interface {Resource} { ... }
export interface Create{Resource}Input { ... }
export interface Update{Resource}Input { ... }

// SECTION 2: TRANSFORMERS (private)
const transform{Resource} = (serverData: any): {Resource} => ({ ... });

// SECTION 3: ENDPOINTS (public API)
export const {resource}Endpoints = {
  getAll: async (): Promise<{Resource}[]> => { ... },
  getById: async (id: string): Promise<{Resource}> => { ... },
  create: async (input: Create{Resource}Input): Promise<{Resource}> => { ... },
  update: async (id: string, input: Update{Resource}Input): Promise<{Resource}> => { ... },
  delete: async (id: string): Promise<void> => { ... },
} as const;
```

### 3. Naming Conventions

| Element | Rule | Example |
|---------|------|---------|
| File | `{resource}.endpoints.ts` | `container-types.endpoints.ts` |
| Export | `{resource}Endpoints` (plural) | `EndpointsContainerType` |
| Type | `{Resource}` (singular) | `ContainerType` |
| Input type | `Create{Resource}Input` | `CreateContainerTypeInput` |
| Update type | `Update{Resource}Input` | `UpdateContainerTypeInput` |

---

## Rules

### ✅ MUST

1. **All endpoints MUST be in `api/endpoints/` folder**
2. **Export object MUST be named `{resource}Endpoints` (plural)**
3. **Methods MUST use standard names:**
   - `getAll()` - get all resources
   - `getById(id)` - get single resource
   - `create(input)` - create new resource
   - `update(id, input)` - update resource
   - `delete(id)` - delete resource
4. **Transform server data in the endpoint layer**
5. **Use `transformFetchError()` for error handling**
6. **Export all types used in the endpoint**
7. **Add JSDoc comments to all public methods**

### ❌ MUST NOT

1. **Never import React or React Query in `api/` folder**
2. **Never make direct `api.get/post/etc` calls outside endpoints**
3. **Never create alternative endpoint patterns (e.g., `EndpointHelper`)**
4. **Never skip the transformer if server data needs normalization**

---

## Usage in Query Hooks

```typescript
// queries/container-types/useGetContainerTypes.ts
import { EndpointsContainerType } from 'api/endpoints';

export const useGetContainerTypes = () => {
  return useQuery({
    queryKey: GET_CONTAINER_TYPES_QUERYKEY,
    queryFn: EndpointsContainerType.getAll, // ✅ Direct reference
  });
};
```

---

## Usage in Loaders

```typescript
// api/loaders/loader.data.ts
import { EndpointsContainerType } from 'api/endpoints';

export const containerTypesLoader = EndpointsContainerType.getAll;
```

---

## Non-Standard Methods

If a resource needs non-CRUD methods, add them to the endpoints object:

```typescript
export const EndpointsOrders = {
  // Standard CRUD
  getAll: async () => { ... },
  create: async (input) => { ... },

  // Custom methods
  updateTemperatureProfiles: async (orderId, profiles) => { ... },
  duplicate: async (orderId) => { ... },
} as const;
```

---

## Migration Checklist

When migrating a resource to this pattern:

- [ ] Create `api/endpoints/{resource}.endpoints.ts`
- [ ] Define all types in the file
- [ ] Create transformer function(s)
- [ ] Export `{resource}Endpoints` object
- [ ] Update all query hooks to use new endpoints
- [ ] Update loaders to use new endpoints
- [ ] Remove old endpoint patterns
- [ ] Add exports to `api/endpoints/index.ts`
- [ ] Test all operations
- [ ] Check for linter errors

---

## Reference

- **Full Documentation:** `/docs/API_ARCHITECTURE.md`
- **Reference Implementation:** `api/endpoints/container-types.endpoints.ts`
