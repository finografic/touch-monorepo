# 🏗️ Hook Architecture Guide - Relay Components

📅 Nov 9, 2025

## The Question

**Should relay hooks be moved into child components, even if duplicated?**

---

## TL;DR Recommendations

| Hook Type | Keep at Page Level? | Safe to Duplicate? | Recommendation |
|-----------|--------------------|--------------------|----------------|
| **Query Hooks** (`useGetRelayStatus`, `useGetRelayStates`) | ❌ No | ✅ **YES** | Move to components that need them |
| **Mutation Hooks** (`useToggleRelay`, `useTurnAllRelaysOn`) | ✅ Yes | ⚠️ Rarely | Keep centralized in `useRelayHandlers` |
| **Handler Hooks** (`useRelayHandlers`) | ✅ Yes | ❌ No | Pass `handlers` & `mutations` as props |
| **Initialization** (`useInitializeRelay`) | ✅ **YES** | ❌ **NO** | Only call once at top level |

---

## Current Problems

### Problem 1: Unused Props in `AdminRelaysPage.tsx`

```tsx
// ❌ BAD: Destructuring 5 values but only using 2!
const {
  data: relayStatus,              // ✅ Used in useMemo
  isLoading: isLoadingStatus,     // ✅ Used in useMemo
  isPollingEnabled: statusPollingEnabled,   // ❌ UNUSED
  enablePolling: enableStatusPolling,       // ❌ UNUSED
  disablePolling: disableStatusPolling,     // ❌ UNUSED
} = useGetRelayStatus();
```

**Why this is bad:**
- Misleading - looks like these are needed
- Harder to understand what the component actually uses
- Creates unnecessary coupling

### Problem 2: `RelaysStatus` Component is Already Self-Contained!

```tsx
// ✅ GOOD: Component calls hooks directly and only takes what it needs!
export const RelaysStatus: React.FC = () => {
  const { handlers, mutations } = useRelayHandlers();
  const { isLoading: isLoadingStates, isPollingEnabled: statesPollingEnabled } = useGetRelayStates();
  const { data: relayStatus } = useGetRelayStatus();
  // ...
};
```

**This is actually PERFECT!** 🎉

---

## React Query Magic 🪄

### Why Query Hooks are SAFE to Duplicate

React Query automatically:
1. **Deduplicates requests** - Multiple `useGetRelayStatus()` calls = 1 network request
2. **Shares cache** - All components get the same data instantly
3. **Synchronizes updates** - When data changes, all components re-render

```tsx
// Component A
const { data } = useGetRelayStatus(); // ← Makes 1 request

// Component B (at the same time)
const { data } = useGetRelayStatus(); // ← Reuses the same request!

// Both get the same data from shared cache ✅
```

---

## Recommended Architecture

### ✅ Strategy 1: Move Query Hooks to Components (Recommended!)

**Principle:** Each component calls only the hooks it needs, with only the properties it needs.

#### Example: `AdminRelaysPage.tsx` (Simplified)

```tsx
export const AdminRelaysPage: React.FC = () => {
  // ✅ Initialization - ONLY at page level
  const initializeRelayMutation = useInitializeRelay();
  useEffect(() => {
    initializeRelayMutation.mutate();
  }, []);

  // ✅ Handlers & Mutations - Keep centralized
  const { handlers, mutations } = useRelayHandlers();

  // ✅ Slot configurations - Page-specific data
  const { data: slotConfigurations, isSuccess, isLoading: isLoadingSlotConfigurations }
    = useGetSlotConfigurations();

  // ✅ Relay states - Only what THIS page needs
  const {
    data: relayStates,
    isLoading: isLoadingStates,
    error: statesError,
    isPollingEnabled: statesPollingEnabled,
    enablePolling: enableStatesPolling,
  } = useGetRelayStates();

  // ❌ REMOVE: useGetRelayStatus - not used in this component!
  // RelaysStatus component will call it directly

  // ... rest of component
};
```

#### Example: `RelaysStatus.tsx` (Already Perfect!)

```tsx
export const RelaysStatus: React.FC = () => {
  // ✅ Calls hooks directly - only what it needs!
  const { handlers, mutations } = useRelayHandlers();
  const { isLoading, isPollingEnabled } = useGetRelayStates();
  const { data: relayStatus } = useGetRelayStatus();

  // ... component logic
};
```

---

### ⚠️ Strategy 2: Pass Props (NOT Recommended for Query Data)

**Only use this if:**
- You need to coordinate loading states across multiple children
- You're doing complex data transformations at parent level
- You have a specific performance reason

```tsx
// ⚠️ ONLY if you have a good reason
<RelaysStatus
  relayStatus={relayStatus}
  isLoadingStates={isLoadingStates}
  statesPollingEnabled={statesPollingEnabled}
/>
```

**Downsides:**
- Prop drilling returns
- Parent needs to know what children need
- Less reusable components

---

## Detailed Recommendations by Hook Type

### 1️⃣ Query Hooks (Read-Only Data)

#### `useGetRelayStatus()` and `useGetRelayStates()`

**✅ SAFE to call in multiple components!**

**Current Usage:**
- `AdminRelaysPage` - calls it but barely uses it
- `PublicRelaysPage` - calls it and uses all props
- `RelaysStatus` - calls it directly ✅

**Recommendation:**

```tsx
// AdminRelaysPage.tsx
// ❌ Remove this entirely if only RelaysStatus needs it:
const {
  data: relayStatus,  // Not used in page
  isLoading: isLoadingStatus,  // Only used for loading calc
  // ... other unused props
} = useGetRelayStatus();

// ✅ If you only need isLoading, just use that:
const { isLoading: isLoadingStatus } = useGetRelayStatus();

// ✅ Or let RelaysStatus call it and remove from page entirely!
```

**Benefits:**
- Each component is self-contained
- No unused props
- Clear what each component needs
- React Query handles caching automatically

---

### 2️⃣ Mutation Hooks (Write Operations)

#### `useToggleRelay()`, `useTurnAllRelaysOn()`, etc.

**⚠️ Better to keep centralized!**

**Why?**
- Each hook instance = separate mutation state
- Harder to coordinate loading states
- May want to show single loading indicator for all mutations

**Current Approach (GOOD!):**
```tsx
// useRelayHandlers.ts - All mutations in one place ✅
const toggleRelayMutation = useToggleRelay();
const turnAllOnMutation = useTurnAllRelaysOn();
// ...

return {
  handlers: { /* ... */ },
  mutations: {
    toggleRelay: toggleRelayMutation,
    turnAllOn: turnAllOnMutation,
  },
};
```

**Keep this pattern!** ✅

---

### 3️⃣ Handler Hooks (Business Logic + Mutations)

#### `useRelayHandlers()`

**✅ Keep at page level, pass down as props**

**Why?**
- Contains mutations (separate instances = bad)
- Contains toast notifications (don't want duplicates)
- May need to coordinate between components

**Current Approach (PERFECT!):**
```tsx
// AdminRelaysPage.tsx
const { handlers, mutations } = useRelayHandlers();

// Pass to children
<RelayButtons handlers={handlers} mutations={mutations} />
<RelaysStatus handlers={handlers} mutations={mutations} />
```

**⚠️ Exception:** If a component is used in isolation and needs different behavior:
```tsx
// IsolatedComponent.tsx - Has its own instance
const { handlers, mutations } = useRelayHandlers();
// This is OK if it's truly isolated!
```

---

### 4️⃣ Initialization Hooks

#### `useInitializeRelay()`

**🚨 CRITICAL: Only call ONCE at top level!**

```tsx
// ✅ GOOD: Once at page level
// AdminRelaysPage.tsx
const initializeRelayMutation = useInitializeRelay();
useEffect(() => {
  initializeRelayMutation.mutate();
}, []);

// ❌ BAD: Don't call in child components
// RelaysStatus.tsx - REMOVED ✅
```

**Why only once?**
- Initializes hardware connection
- Multiple calls = multiple init attempts = bugs
- Should happen at app/page mount, not component mount

---

## Specific Fixes for Your Codebase

### Fix 1: Simplify `AdminRelaysPage.tsx`

**Current (lines 51-57):**
```tsx
const {
  data: relayStatus,              // ❌ Not used in page
  isLoading: isLoadingStatus,     // ✅ Used in useMemo
  isPollingEnabled: statusPollingEnabled,   // ❌ Not used
  enablePolling: enableStatusPolling,       // ❌ Not used
  disablePolling: disableStatusPolling,     // ❌ Not used
} = useGetRelayStatus();
```

**Option A: Only destructure what you need**
```tsx
// ✅ GOOD: Only take what you need
const { isLoading: isLoadingStatus } = useGetRelayStatus();
```

**Option B: Remove entirely** (Recommended!)
```tsx
// ✅ BETTER: Remove from page, let RelaysStatus handle it
// Remove useGetRelayStatus() entirely

// Update isLoading calculation:
const isLoading = useMemo(
  () => isLoadingSlotConfigurations || isLoadingStates,
  [isLoadingSlotConfigurations, isLoadingStates],
);
```

---

### Fix 2: `PublicRelaysPage.tsx` is Actually Good!

```tsx
// ✅ This page uses ALL the props, so it's fine!
const {
  data: relayStatus,              // ✅ Used in JSX
  isLoading: isLoadingStatus,     // ✅ Used in loading check
  isPollingEnabled: statusPollingEnabled,   // ✅ Used in Badge
  enablePolling: enableStatusPolling,       // ✅ Used in retry button
  disablePolling: disableStatusPolling,     // ✅ Used in error handling
} = useGetRelayStatus();
```

**No changes needed here!** ✅

---

### Fix 3: `RelaysStatus.tsx` is Perfect!

```tsx
// ✅ Already optimized - only takes what it needs!
const { isLoading: isLoadingStates, isPollingEnabled: statesPollingEnabled } = useGetRelayStates();
const { data: relayStatus } = useGetRelayStatus();
```

**This is the pattern to follow!** 🎯

---

## Decision Tree 🌳

```
Should I call this hook in my component?

Is it a Query Hook (useGet*, useQuery)?
├─ YES → ✅ Safe to call directly in component!
│         React Query handles caching & deduplication
└─ NO → Is it a Mutation Hook (use*Mutation, useToggle*, etc.)?
    ├─ YES → ⚠️ Prefer centralized (useRelayHandlers)
    │         Unless component is truly isolated
    └─ NO → Is it an Initialization Hook?
        ├─ YES → 🚨 Only call ONCE at top level!
        └─ NO → Is it a custom hook with mutations?
            ├─ YES → ✅ Keep at page level, pass props
            └─ NO → ✅ Call directly in component
```

---

## Performance Considerations

### Query Hooks are Cached! 🚀

```tsx
// Component A renders
const { data } = useGetRelayStatus(); // 1️⃣ Makes API call

// Component B renders (same time)
const { data } = useGetRelayStatus(); // 2️⃣ Uses cached data!

// 200ms later, Component C renders
const { data } = useGetRelayStatus(); // 3️⃣ Still cached!

// Result: 1 API call, 3 components happy ✅
```

**React Query Configuration (from your hooks):**
```tsx
staleTime: 1000 * 10,          // Data fresh for 10 seconds
refetchInterval: 5000,         // Refetch every 5 seconds
refetchOnWindowFocus: true,    // Refetch when user returns
```

**This means:**
- Multiple components calling `useGetRelayStatus()` = efficient ✅
- All components share the same cache
- All components update together when data changes
- Only 1 network request every 5 seconds (polling)

---

## Real-World Example: Twitter-like App

```tsx
// ✅ GOOD: Each component calls hooks it needs

// Tweet.tsx - Shows single tweet
const Tweet = ({ tweetId }) => {
  const { data: tweet } = useGetTweet(tweetId);  // ✅ Calls directly
  return <div>{tweet.content}</div>;
};

// TweetStats.tsx - Shows likes/retweets
const TweetStats = ({ tweetId }) => {
  const { data: tweet } = useGetTweet(tweetId);  // ✅ Reuses cache!
  return <div>{tweet.likes} likes</div>;
};

// TweetList.tsx - Shows list
const TweetList = () => {
  return (
    <>
      <Tweet tweetId="1" />      {/* 1 API call */}
      <TweetStats tweetId="1" /> {/* Cached! */}
      <Tweet tweetId="2" />      {/* 1 API call */}
      <TweetStats tweetId="2" /> {/* Cached! */}
    </>
  );
  // Total: 2 API calls, 4 components rendered ✅
};
```

---

## Summary & Action Items

### ✅ Do This:

1. **Remove `useGetRelayStatus` from `AdminRelaysPage`** if it's only used for `isLoading`
   - Let `RelaysStatus` component call it directly
   - Or only destructure `isLoading` if really needed

2. **Keep Query Hooks at component level**
   - Each component calls only what it needs
   - Only destructure props it actually uses

3. **Keep `useRelayHandlers` at page level**
   - Pass `handlers` and `mutations` to children
   - Already doing this correctly! ✅

4. **Keep `useInitializeRelay` at page level**
   - Only call once per page
   - Already doing this correctly! ✅

### ❌ Don't Do This:

1. ❌ Don't prop-drill query data if the child can call the hook directly
2. ❌ Don't call `useInitializeRelay` in multiple components
3. ❌ Don't duplicate `useRelayHandlers` (contains mutations)
4. ❌ Don't destructure props you don't use

---

## Recommended Pattern (Copy This!)

```tsx
// ============================================================================
// Page Component (AdminRelaysPage.tsx)
// ============================================================================

export const AdminRelaysPage = () => {
  // 1️⃣ Initialization - ONLY ONCE
  const initializeRelayMutation = useInitializeRelay();
  useEffect(() => {
    initializeRelayMutation.mutate();
  }, []);

  // 2️⃣ Handlers & Mutations - Keep centralized
  const { handlers, mutations } = useRelayHandlers();

  // 3️⃣ Page-specific data - Only what THIS component needs
  const { data: slotConfigurations } = useGetSlotConfigurations();
  const { data: relayStates, error, enablePolling } = useGetRelayStates();

  // 4️⃣ Pass handlers to children, let them call their own query hooks
  return (
    <>
      <RelaysStatus handlers={handlers} mutations={mutations} />
      <RelayButtons handlers={handlers} mutations={mutations} />
      <RelayAssign
        configurations={slotConfigurations}
        onRelayToggle={handlers.relayToggle}
      />
    </>
  );
};

// ============================================================================
// Child Component (RelaysStatus.tsx)
// ============================================================================

interface RelaysStatusProps {
  handlers: Pick<RelayHandlers, 'reconnect'>;
  mutations: Pick<RelayMutations, 'reconnect' | 'disconnect'>;
}

export const RelaysStatus = ({ handlers, mutations }: RelaysStatusProps) => {
  // ✅ Each component calls its own query hooks!
  const { data: relayStatus } = useGetRelayStatus();
  const { isPollingEnabled } = useGetRelayStates();

  return (
    <Flex>
      <Badge>{relayStatus?.connected ? 'Connected' : 'Disconnected'}</Badge>
      <Button onClick={() => handlers.reconnect(relayStatus)}>
        Reconnect
      </Button>
    </Flex>
  );
};
```

---

## Final Thoughts

**Key Insight:** With React Query, the question isn't "should I duplicate hooks?" but rather **"does this component need this data?"**

If yes → Call the hook directly! React Query makes it efficient.

If no → Don't call it (or don't destructure unused props).

**Your `RelaysStatus` component is already the perfect example!** 🎯


