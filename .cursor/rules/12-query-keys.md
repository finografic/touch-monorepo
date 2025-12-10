# Query Keys Pattern

## 🎯 Rule: Static Query Key Constants

**CRITICAL**: All React Query keys MUST be static constants following the `{HTTP_METHOD}_{ENDPOINT_SEGMENT}_QUERYKEY` pattern.

## ✅ Correct Pattern

### **Format:**
```typescript
export const {HTTP_METHOD}_{ENDPOINT_SEGMENT}_QUERYKEY = ['{http-method}-{endpoint-segment}'] as const;
```

### **Naming Convention:**
- Use **UPPER_SNAKE_CASE** for constant names
- Use **lowercase-kebab-case** for the key value
- **One key per HTTP method and endpoint combination**
- Use **singular** or **plural** based on the actual endpoint (as written in the API)
- **NO** template strings or functions
- **NO** "list", "detail", "id" suffixes in the key name itself

### **Examples:**

```typescript
// ✅ CORRECT - List endpoint
export const GET_ORDERS_READABLE_QUERYKEY = ['get-orders-readable'] as const;

// ✅ CORRECT - Single item endpoint
export const GET_ORDER_READABLE_QUERYKEY = ['get-order-readable'] as const;

// ✅ CORRECT - Create endpoint
export const POST_ORDER_READABLE_QUERYKEY = ['post-order-readable'] as const;

// ✅ CORRECT - Update endpoint
export const PATCH_ORDER_READABLE_QUERYKEY = ['patch-order-readable'] as const;

// ✅ CORRECT - Delete endpoint
export const DELETE_ORDER_READABLE_QUERYKEY = ['delete-order-readable'] as const;

// ✅ CORRECT - Multiple related endpoints
export const GET_DRINK_TYPES_QUERYKEY = ['get-drink-types'] as const;
export const GET_DRINK_SUBTYPES_QUERYKEY = ['get-drink-subtypes'] as const;
```

## ❌ Incorrect Patterns

### **DO NOT use dynamic functions:**
```typescript
// ❌ WRONG - Dynamic functions
export const ORDERS_READABLE_QUERY_KEYS = {
  all: ['orders-readable'] as const,
  lists: () => [...ORDERS_READABLE_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: string) => [...ORDERS_READABLE_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...ORDERS_READABLE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ORDERS_READABLE_QUERY_KEYS.details(), id] as const,
};
```

### **DO NOT use template strings:**
```typescript
// ❌ WRONG - Template strings
export const GET_ORDER_QUERYKEY = (id: string) => [`get-order-${id}`] as const;
```

### **DO NOT include filters in the key name:**
```typescript
// ❌ WRONG - Filters in key name
export const GET_ORDERS_WITH_FILTERS_QUERYKEY = ['get-orders', { filters }] as const;
```

## 📋 Usage in Hooks

### **Query Hooks (useQuery):**
```typescript
// ✅ CORRECT - Direct use for list queries
export const useGetOrdersReadable = () => {
  return useQuery({
    queryKey: GET_ORDERS_READABLE_QUERYKEY,
    queryFn: async () => await api.get('/orders-readable'),
  });
};

// ✅ CORRECT - Append ID for detail queries (inside the hook)
export const useGetOrderReadableById = ({ orderId }: { orderId: string }) => {
  return useQuery({
    queryKey: [...GET_ORDER_READABLE_QUERYKEY, orderId],
    queryFn: async () => await api.get(`/orders-readable/${orderId}`),
  });
};
```

### **Mutation Hooks (useMutation):**
```typescript
// ✅ CORRECT - Invalidate GET keys after mutations
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => await api.post('/orders', data),
    onSuccess: () => {
      // Invalidate the list query
      queryClient.invalidateQueries({ queryKey: GET_ORDERS_READABLE_QUERYKEY });
    },
  });
};

// ✅ CORRECT - Invalidate both list and detail after update
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => await api.patch(`/orders/${id}`, updates),
    onSuccess: (updatedOrder) => {
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: GET_ORDERS_READABLE_QUERYKEY });
      // Invalidate specific item
      queryClient.invalidateQueries({ queryKey: [...GET_ORDER_READABLE_QUERYKEY, updatedOrder.id] });
    },
  });
};
```

## 🔑 Key Principles

1. **One Key Per HTTP Method + Endpoint**
   - `GET /orders-readable` → `GET_ORDERS_READABLE_QUERYKEY`
   - `GET /orders-readable/:id` → `GET_ORDER_READABLE_QUERYKEY`
   - `POST /orders` → `POST_ORDER_READABLE_QUERYKEY`
   - `PATCH /orders/:id` → `PATCH_ORDER_READABLE_QUERYKEY`
   - `DELETE /orders/:id` → `DELETE_ORDER_READABLE_QUERYKEY`

2. **Static Constants Only**
   - Keys are defined once in `queries/{resource}/index.ts`
   - No functions, no template strings, no dynamic construction at definition time

3. **ID/Parameters in Hooks**
   - For detail queries, append the ID inside the hook: `[...GET_ORDER_READABLE_QUERYKEY, orderId]`
   - For filtered queries, handle filters inside the hook, not in the key definition

4. **Invalidation Strategy**
   - Mutations invalidate the corresponding GET keys
   - POST/PATCH/DELETE keys are available for future use but typically not used for invalidation
   - Always invalidate the GET keys that need to be refreshed

## 📁 File Structure

```typescript
// queries/orders/index.ts
export const GET_ORDERS_READABLE_QUERYKEY = ['get-orders-readable'] as const;
export const GET_ORDER_READABLE_QUERYKEY = ['get-order-readable'] as const;
export const POST_ORDER_READABLE_QUERYKEY = ['post-order-readable'] as const;
export const PATCH_ORDER_READABLE_QUERYKEY = ['patch-order-readable'] as const;
export const DELETE_ORDER_READABLE_QUERYKEY = ['delete-order-readable'] as const;

export * from './useCreateOrder';
export * from './useDeleteOrder';
export * from './useGetOrderReadableById';
export * from './useGetOrdersReadable';
export * from './useUpdateOrder';
```

## 🚫 Common Mistakes

1. **Creating helper functions** - Use static constants instead
2. **Including filters in key definition** - Handle filters in the hook
3. **Using plural/singular inconsistently** - Match the actual endpoint
4. **Forgetting to export keys** - Export all keys from `index.ts`
5. **Using wrong key for invalidation** - Always invalidate GET keys, not mutation keys

## ✅ Benefits

- **Easy to reference** - Static constants are simple to import and use
- **Type-safe** - TypeScript can infer types correctly
- **Consistent** - Same pattern across all query files
- **Maintainable** - Easy to find and update keys
- **Cache-friendly** - React Query can efficiently cache and invalidate

---

**Remember**: One key per HTTP method + endpoint combination. Keep it simple, static, and consistent.

