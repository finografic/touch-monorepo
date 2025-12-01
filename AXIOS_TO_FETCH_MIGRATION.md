# Axios to Fetch Migration Guide

📅 Dec 2025

## Overview

This document tracks the migration from Axios to native Fetch API in `apps/client`. The migration provides:

- ✅ **Smaller bundle size** (no axios dependency)
- ✅ **Native browser API** (better performance, modern standards)
- ✅ **Normalized responses** (fixes `res.json` vs `res.json?.json` issues)
- ✅ **Consistent error handling** (fetch-compatible error transformation)

---

## ✅ Completed Changes

### 1. **New Fetch Client** (`apps/client/src/api/fetch.ts`)

- Created native fetch-based API client
- Automatically normalizes responses (unwraps `ApiResponse<T>` to return `T` directly)
- Handles timeouts, retries, and error transformation
- All methods (`get`, `post`, `patch`, `put`, `delete`) return data directly

**Key Feature: Response Normalization**
```typescript
// Server returns: { data: User, message?: string, timestamp: number }
// Client receives: User (just the data)
const user = await api.get<User>('/users/1');
// No more: response.data.data or response.json()?.json()
```

### 2. **Updated Core Package** (`packages/core/src/api/`)

- ✅ Created `fetch.utils.ts` with fetch-compatible error transformation
- ✅ Updated `api.utils.ts` to re-export fetch utilities (backward compatible)
- ✅ Updated `api.types.ts` to remove `AxiosResponse` dependency
- ✅ `transformAxiosError` now aliases to `transformFetchError` for compatibility

### 3. **Updated API Endpoints** (`apps/client/src/api/api.endpoints.ts`)

- ✅ Removed axios imports
- ✅ Updated to use fetch client
- ✅ Simplified endpoint definitions (no more `ApiResponse<T>` wrapper in types)
- ✅ Updated error handling to use `transformFetchError`

**Before:**
```typescript
getDrinkTypes: async () => await api.get<ApiResponse<DrinkType[]>>('/drink-types')
// Returns: ApiResponse<DrinkType[]>
// Usage: response.data (after unwrapping)
```

**After:**
```typescript
getDrinkTypes: async () => await api.get<DrinkType[]>('/drink-types')
// Returns: DrinkType[] (already unwrapped)
// Usage: response (direct)
```

---

## 🔄 In Progress / TODO

### 4. **Update All Query Hooks** (`apps/client/src/queries/**/*.ts`)

**Status:** ✅ Complete

**Files Updated:** 43 query files migrated

**Changes Made:**
1. ✅ Removed all `response.data` access (fetch client already returns data)
2. ✅ Updated error handling from `transformAxiosError` to `transformFetchError` (33 files)
3. ✅ Removed `response.status` checks (fetch client handles errors automatically)
4. ✅ Removed axios type imports (`AxiosError`, `AxiosResponse`)

**Example Migration:**

```typescript
// BEFORE
const orderResponse = await api.post('/orders', orderData);
const newOrder = orderResponse.data; // ❌ Remove .data

// AFTER
const newOrder = await api.post('/orders', orderData); // ✅ Direct
```

**Files Migrated:**
- ✅ All 43 query hooks in `apps/client/src/queries/**/*.ts`
- ✅ Orders, modes, drink-types, container-types, volumes, slot-configurations, relays, sounds, temperature queries

### 5. **Update Direct API Calls** (Outside EndpointHelper)

**Status:** ✅ Complete

All files that call `api.get/post/etc` directly have been migrated:

- ✅ `providers/OrdersProvider/OrdersContext.ts` - Removed `response.data` access
- ✅ `utils/soundCache.utils.ts` - Removed `response.data` access
- ✅ `admin/pages/AdminOrdersPage/OrdersTable/useTableLabelMappings.ts` - Removed `response.status` and `response.data` access
- ✅ `api/endpoints/drink-subtype.endpoints.ts` - Updated to use fetch client directly
- ✅ `api/endpoints/drink-type.endpoints.ts` - Updated to use fetch client directly
- ✅ `api/endpoints/container-type.endpoints.ts` - Updated to use fetch client directly
- ✅ `api/endpoints/volume.endpoints.ts` - Updated to use fetch client directly

**Changes Made:**
- Removed all `.data` access from responses (fetch client returns data directly)
- Updated error handling from `transformAxiosError` to `transformFetchError`
- Removed `response.status` checks (fetch client handles errors automatically)

### 6. **Server-Side Response Normalization**

**Status:** ⏳ Pending

**Check:** Server endpoints that might be crafting responses specifically for axios clients.

**Action Items:**
1. Verify all endpoints return consistent `ApiResponse<T>` format
2. Ensure no axios-specific response crafting
3. Test that fetch client correctly unwraps responses

**Expected Server Response Format:**
```typescript
{
  data: T,           // The actual data
  message?: string,  // Optional message
  timestamp: number   // Timestamp
}
```

### 7. **Remove Axios Dependencies**

**Status:** ⏳ Pending

**Packages to Update:**
- `apps/client/package.json` - Remove `axios`
- `packages/core/package.json` - Remove `axios` (if not used elsewhere)

**Files to Delete:**
- `apps/client/src/api/axios.ts` (replaced by `fetch.ts`)
- `apps/client/src/api/axios-source.d.ts` (if exists, no longer needed)

**Cleanup:**
- Remove axios type imports from all files
- Remove `AxiosError`, `AxiosResponse` type references

---

## 🔍 Migration Checklist

### Phase 1: Core Infrastructure ✅
- [x] Create fetch client
- [x] Update core package error utilities
- [x] Update ApiResponse types
- [x] Update api.endpoints.ts

### Phase 2: Query Hooks ✅
- [x] Update all query hooks in `src/queries/`
- [x] Remove `response.data` access
- [x] Update error handling
- [x] Test each query hook

### Phase 3: Direct API Calls ✅
- [x] Find all direct `api.*` calls
- [x] Update to use normalized responses
- [x] Test each usage

### Phase 4: Server Verification ⏳
- [ ] Verify server response format consistency
- [ ] Test fetch client unwrapping
- [ ] Fix any server-side axios-specific code

### Phase 5: Cleanup ⏳
- [ ] Remove axios from package.json files
- [ ] Delete old axios.ts file
- [ ] Remove all axios type imports
- [ ] Update documentation

---

## 📝 Key Changes Summary

### Response Normalization

**The Problem:**
```typescript
// Inconsistent response handling
const response = await api.get('/users');
const user = response.data.data; // Sometimes needed
const user2 = response.json()?.json(); // Sometimes needed
```

**The Solution:**
```typescript
// Always consistent
const user = await api.get<User>('/users'); // Direct data
// Server returns: { data: User, ... }
// Client receives: User (automatically unwrapped)
```

### Error Handling

**Before:**
```typescript
import { transformAxiosError } from '@workspace/core/api';
catch (error) {
  const transformed = transformAxiosError(error);
}
```

**After:**
```typescript
import { transformFetchError } from '@workspace/core/api';
// Or (backward compatible):
import { transformAxiosError } from '@workspace/core/api'; // Still works!
catch (error) {
  const transformed = transformFetchError(error);
}
```

### Type Safety

**Before:**
```typescript
const response = await api.get<ApiResponse<DrinkType[]>>('/drink-types');
const types: DrinkType[] = response.data; // Manual unwrapping
```

**After:**
```typescript
const types = await api.get<DrinkType[]>('/drink-types');
// types is already DrinkType[] (automatically unwrapped)
```

---

## 🧪 Testing Checklist

After migration, test:

1. **All GET endpoints** - Verify data is returned correctly
2. **All POST/PATCH/PUT endpoints** - Verify data is sent and received correctly
3. **Error handling** - Verify errors are transformed correctly
4. **Query hooks** - Verify React Query integration works
5. **Direct API calls** - Verify non-EndpointHelper calls work
6. **Server responses** - Verify response format is consistent

---

## 🚨 Breaking Changes

### For Query Hooks

**Before:**
```typescript
const { data } = useQuery({
  queryFn: async () => {
    const response = await api.get('/users');
    return response.data; // ❌ This will break
  }
});
```

**After:**
```typescript
const { data } = useQuery({
  queryFn: async () => {
    return await api.get('/users'); // ✅ Direct return
  }
});
```

### For Direct API Calls

**Before:**
```typescript
const response = await api.post('/orders', data);
const order = response.data; // ❌ This will break
```

**After:**
```typescript
const order = await api.post('/orders', data); // ✅ Direct
```

---

## 📚 Resources

- **Fetch API MDN**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **Native Fetch**: No external dependencies needed!

---

## Notes

- The `transformAxiosError` function is kept as an alias for backward compatibility
- All existing error types (`ErrorResponse`, `ApplicationError`) remain unchanged
- Server-side code should continue returning `ApiResponse<T>` format
- The fetch client automatically unwraps `ApiResponse<T>` to return `T` directly

