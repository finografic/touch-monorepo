# Query Layer Refactor — Proposals

**Date:** 2026-02-23
**Context:** The `src/queries/` folder has grown to ~14 resource directories with 3–10 hook files each (~70+ individual hook files total). The `src/api/endpoints/` layer is clean and should remain unchanged. These proposals target the query/hooks layer only.

**Current state per resource:**

```
drink-types/
  index.ts                  ← query key constants + barrel exports
  useGetDrinkTypes.ts       ← useQuery wrapper
  useGetDrinkType.ts        ← useQuery wrapper (by id)
  useCreateDrinkType.ts     ← useMutation wrapper
  useUpdateDrinkType.ts     ← useMutation wrapper
  useGetDrinkSubtypes.ts    ← useQuery wrapper
  useCreateDrinkSubtype.ts  ← useMutation wrapper
  useUpdateDrinkSubtype.ts  ← useMutation wrapper
```

Each hook file is ~10–25 lines. The pattern is consistent and correct — the issue is **volume, not design**.

---

## Proposal 1 — Resource Bundle Hooks

**One hook per resource. Returns all operations.**

Replace N individual hook files with a single `use[Resource].ts` file per resource. The hook composes `useQuery` and `useMutation` calls internally, and returns them as a named bundle.

# Structure

```
queries/
  drink-types/
    useDrinkTypes.ts         ← replaces 7 files
    useDrinkSubtypes.ts      ← replaces 3 files
    drink-types.keys.ts      ← query key constants only
  container-types/
    useContainerTypes.ts
    container-types.keys.ts
  ...
```

### Implementation Example

```typescript
// queries/drink-types/useDrinkTypes.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EndpointsDrinkType, type DrinkTypeUpdate } from 'api/endpoints';
import { DRINK_TYPE_KEYS } from './drink-types.keys';

export function useDrinkTypes() {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: DRINK_TYPE_KEYS.all,
    queryFn: EndpointsDrinkType.getAll,
  });

  const create = useMutation({
    mutationFn: (data: DrinkTypeUpdate) => EndpointsDrinkType.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DRINK_TYPE_KEYS.all }),
  });

  const update = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: DrinkTypeUpdate }) =>
      EndpointsDrinkType.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DRINK_TYPE_KEYS.all }),
  });

  return { list, create, update };
}

// queries/drink-types/useDrinkType.ts  (by id — kept separate since it takes a param)
export function useDrinkType(id: string) {
  return useQuery({
    queryKey: DRINK_TYPE_KEYS.detail(id),
    queryFn: () => EndpointsDrinkType.getById(id),
    enabled: Boolean(id),
  });
}
```

```typescript
// queries/drink-types/drink-types.keys.ts
export const DRINK_TYPE_KEYS = {
  all:            ['drink-types'] as const,
  detail:  (id: string) => ['drink-types', id] as const,
} as const;
```

### Usage at call site

```typescript
// Before
const { data: drinkTypes } = useGetDrinkTypes();
const createDrinkType = useCreateDrinkType();
const updateDrinkType = useUpdateDrinkType();
createDrinkType.mutate({ name: 'Lager' });

// After
const drinkTypes = useDrinkTypes();
drinkTypes.list.data;
drinkTypes.create.mutate({ name: 'Lager' });
drinkTypes.update.mutate({ id: '...', updates: { name: 'Pilsner' } });
```

### File reduction estimate

| Before | After |
|--------|-------|
| ~70 hook files + ~14 index.ts files | ~28 hook files + ~14 key files |
| 84 files | ~42 files (~50% reduction) |

### Tradeoffs

**Pro:**
- All operations for a resource are co-located in one file
- Invalidation logic is centralised per resource
- One import at the call site instead of three

**Con:**
- Components that only need `list` still instantiate `create`/`update` mutation hooks — this is a non-issue at runtime (mutations don't fire unless called), but it's non-obvious
- Hooks with custom options (polling, `enabled`, `staleTime`) become awkward to configure from outside — the bundle pattern assumes a single configuration; complex cases like `useGetRelayStates` should remain as standalone hooks
- The `useMutation` return shape is not the same as `useQuery` — destructuring `{ list, create }` looks clean but `list.data` vs `create.mutate` diverges; callers need to know what they're getting

**Best suited for:** Simple CRUD resources (container-types, drink-types, volumes, supported-languages, translations-ui). Keep complex hooks (relays, orders with temperature profiles) as standalone files.

---

## Proposal 2 — CRUD Hook Factory

**Generate the standard hooks from the endpoint object. Keep the same individual hook API, eliminate the boilerplate.**

A factory function `createEntityHooks(endpoints, keys)` receives an endpoint object and returns typed hooks. You define each resource in one short block. Call sites are unchanged.

### Core factory (written once)

```typescript
// queries/_factory/createEntityHooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

interface CrudEndpoints<TModel, TCreate, TUpdate> {
  getAll: () => Promise<TModel[]>;
  getById?: (id: string) => Promise<TModel>;
  create?: (data: TCreate) => Promise<TModel>;
  update?: (id: string, data: TUpdate) => Promise<TModel>;
  delete?: (id: string) => Promise<void>;
}

interface EntityKeys {
  all: readonly string[];
  detail?: (id: string) => readonly string[];
}

export function createEntityHooks<TModel, TCreate = Partial<TModel>, TUpdate = Partial<TModel>>(
  endpoints: CrudEndpoints<TModel, TCreate, TUpdate>,
  keys: EntityKeys,
) {
  function useList(options?: Partial<UseQueryOptions<TModel[]>>) {
    return useQuery({
      queryKey: keys.all,
      queryFn: endpoints.getAll,
      ...options,
    });
  }

  function useById(id: string, options?: Partial<UseQueryOptions<TModel>>) {
    return useQuery({
      queryKey: keys.detail?.(id) ?? [...keys.all, id],
      queryFn: () => endpoints.getById!(id),
      enabled: Boolean(id) && Boolean(endpoints.getById),
      ...options,
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: TCreate) => endpoints.create!(data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: TUpdate }) => endpoints.update!(id, data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
    });
  }

  function useDelete() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => endpoints.delete!(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
    });
  }

  return { useList, useById, useCreate, useUpdate, useDelete };
}
```

### Per-resource definition (replaces entire folder)

```typescript
// queries/drink-types/index.ts

import { EndpointsDrinkType, type DrinkTypeUpdate } from 'api/endpoints';
import type { DrinkType } from 'types/models/drink-type.model';
import { createEntityHooks } from 'queries/_factory/createEntityHooks';

const drinkTypeHooks = createEntityHooks<DrinkType, DrinkTypeUpdate, DrinkTypeUpdate>(
  EndpointsDrinkType,
  {
    all:    ['drink-types'] as const,
    detail: (id) => ['drink-types', id] as const,
  },
);

export const useGetDrinkTypes   = drinkTypeHooks.useList;
export const useGetDrinkType    = drinkTypeHooks.useById;
export const useCreateDrinkType = drinkTypeHooks.useCreate;
export const useUpdateDrinkType = drinkTypeHooks.useUpdate;
export const useDeleteDrinkType = drinkTypeHooks.useDelete;
```

Call sites are **completely unchanged**. The only difference is where the hook is implemented.

### File reduction estimate

| Before | After |
|--------|-------|
| 5–7 files per simple CRUD resource | 1 file per resource (index.ts only) |
| ~70 hook files + ~14 index files | ~14 index files + 1 factory file |
| 84 files | ~20 files (~75% reduction for simple resources) |

Complex resources (relays, orders, sounds) keep their own folder with custom hooks.

### Tradeoffs

**Pro:**
- Zero change at call sites — this is a purely internal refactor
- Fully typed via generics — `useCreate()` knows the input shape
- New simple CRUD resources can be added in ~10 lines
- Invalidation strategy is normalised across all generated hooks

**Con:**
- The factory adds an indirection layer — jumping to definition lands in the factory, not a readable hook
- The `useById` hook requires `getById` to exist on the endpoint object — mismatches cause runtime errors unless you guard (the `Boolean(endpoints.getById)` guard above handles this but silently)
- Custom options (staleTime, polling, enabled) need to be passed at the call site via the `options` param — this is actually fine and arguably cleaner than hardcoding them in a hook file
- TypeScript generic inference on `createEntityHooks` needs care — the factory type params must be specified explicitly for correct types on `useCreate`/`useUpdate`, otherwise they'll be inferred as `Partial<TModel>` which may not match the actual input type

**Best suited for:** Teams that want zero call-site changes and prioritise mechanical simplicity. The factory is a one-time write; the payoff grows with every new resource added.

---

## Proposal 3 — Query Hooks Stay, Mutations Go Inline

**The asymmetric approach: keep `useQuery` wrappers, drop individual `useMutation` wrappers.**

Observations from this codebase:
- Query hooks carry meaningful configuration: `staleTime`, `refetchInterval`, `enabled`, retry logic, polling controls — these genuinely benefit from a dedicated hook
- Mutation hooks are almost always thin: `useMutation({ mutationFn: endpoint.create })` with optional invalidation — a wrapper adds a file but rarely adds value

This proposal keeps all `useGet*` hooks as-is, and replaces `useCreate*`, `useUpdate*`, `useDelete*` hooks with a shared `useEntityMutations` helper that is used inline.

### The helper (written once)

```typescript
// queries/_helpers/useEntityMutations.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';

type MutationDef<TInput, TOutput> = {
  fn: (input: TInput) => Promise<TOutput>;
  invalidates?: readonly string[];
};

export function useEntityMutations<TDefs extends Record<string, MutationDef<any, any>>>(
  defs: TDefs,
) {
  const queryClient = useQueryClient();

  return Object.fromEntries(
    Object.entries(defs).map(([key, def]) => [
      key,
      useMutation({
        mutationFn: def.fn,
        onSuccess: () => {
          if (def.invalidates) {
            queryClient.invalidateQueries({ queryKey: def.invalidates });
          }
        },
      }),
    ]),
  ) as {
    [K in keyof TDefs]: ReturnType<typeof useMutation<any, any, any>>;
  };
}
```

### Usage — mutations inline in the component

```typescript
// In a component or page

// Queries stay as they are
const { data: drinkTypes } = useGetDrinkTypes();

// Mutations composed inline — no separate hook files needed
const mutations = useEntityMutations({
  create: {
    fn: EndpointsDrinkType.create,
    invalidates: ['drink-types'],
  },
  update: {
    fn: ({ id, data }: { id: string; data: DrinkTypeUpdate }) =>
      EndpointsDrinkType.update(id, data),
    invalidates: ['drink-types'],
  },
});

mutations.create.mutate({ name: 'Lager' });
mutations.update.mutate({ id: '...', data: { name: 'Pilsner' } });
```

Or co-locate per resource, but in the query folder instead of a separate hook file:

```typescript
// queries/drink-types/index.ts — exports only what's needed

export const GET_DRINK_TYPES_QUERYKEY = ['drink-types'] as const;

export { useGetDrinkTypes }  from './useGetDrinkTypes';
export { useGetDrinkType }   from './useGetDrinkType';

// No useCreateDrinkType, useUpdateDrinkType — callers use useEntityMutations directly
```

### File reduction estimate

| Before | After |
|--------|-------|
| ~70 hook files | ~30 query hook files (mutations removed) |
| Mutations: ~40 files | Mutations: 0 files + 1 helper |
| 84 files | ~45 files (~45% reduction) |

### Tradeoffs

**Pro:**
- The least disruptive change — query hooks are untouched and they're the ones with meaningful logic
- Eliminates the most boilerplate files (mutation hooks are the thinnest files in the codebase)
- Mutations become discoverable at the call site, not hidden in a hook file
- Leaves room for custom mutation hooks where the logic is genuinely complex (orders with temperature profiles)

**Con:**
- Mutations are no longer re-usable across components without passing through props or re-composing them — though in practice, a mutation hook used in only one component was never really providing reuse value
- Invalidation configuration moves to the call site, which can diverge if the same mutation is called from multiple places — you lose the single source of truth for "what does this mutation invalidate"
- The `useEntityMutations` helper has TypeScript complexity: the generic inference to get correct `.mutate()` input types requires careful typing that will show up as `any` if not handled properly
- Mixing "hooks in files" for queries and "hooks inline" for mutations creates an asymmetry that may confuse new contributors

**Best suited for:** Teams that prefer to keep hooks close to the call site, or where mutations are rarely shared across components. A good starting point if you want to reduce files with minimal refactor risk.

---

## Comparison Summary

| Criterion | Proposal 1 (Bundle) | Proposal 2 (Factory) | Proposal 3 (Inline Mutations) |
|-----------|--------------------|--------------------|-------------------------------|
| File reduction | ~50% | ~75% | ~45% |
| Call site changes | Yes — different import & API | None | Partial — mutations change |
| TypeScript complexity | Low | Medium | Medium |
| Refactor risk | Medium | Low | Low |
| Handles complex hooks (relays, orders) | Keep as standalone | Keep as standalone | Natural fit |
| Discoverability | One import, all ops | Same as today | Mutations at call site |
| Best for new resources | Very fast to add | Fastest (10 lines) | Fast for simple cases |

---

## Recommendation

**For this codebase specifically:** Proposal 2 (Factory) with Proposal 3 (Inline Mutations) as an escape hatch.

- Use `createEntityHooks` for the ~10 genuinely simple CRUD resources (container-types, drink-types, drink-volumes, countries, supported-languages, translations-ui, app-configuration, slot-configurations, sounds, modes)
- Keep custom standalone hook files for relays (polling, network state) and orders (multi-step mutations)
- The factory export re-exports hooks with the same names as today — zero call-site churn
- Where a mutation is one-off and only used in a single component, skip the hook entirely and use `useMutation` inline with the endpoint function directly

This gets you from ~84 files to ~20–25 files with no breaking changes at call sites.

---

## Open Questions Before Implementing

1. **Invalidation strategy:** Should invalidation always be centralised in the hook/factory, or should some mutations defer to the caller (current pattern in `useUpdateTranslationUi`)? The factory pattern assumes always-invalidate — is that safe for all resources?

2. **`useGetDefaultMode` pattern:** This is a derived query (filters `getAll` client-side). Does the factory's `useById` cover this, or does it stay as a custom hook?

3. **Query key consistency:** Keys currently have two styles (`['get-drink-types']` vs `['modes']` vs `['relays', 'toggle']`). Worth normalising to a single pattern (e.g. `[resource, operation?, id?]`) as part of this refactor, or a separate pass?

4. **DTO transforms:** `translationsUiEndpoints` applies `TranslationsDto.fromApi()` in the endpoint layer. Any other resources doing silent transforms that would break if queries started returning raw data?
