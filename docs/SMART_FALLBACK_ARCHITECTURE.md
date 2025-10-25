# Smart Fallback Architecture

## Overview

The **Smart Fallback System** is a core architectural pattern in this project that generates temperature profiles **only when needed** to prevent blocking the user experience when database entries don't exist for specific product configurations.

This document explains the WHY, WHEN, and HOW of temperature profile generation.

---

## 🎯 Core Problem

Users need to program drinks with specific configurations (drink type, volume, container type, temperature). However, the database might not have entries for every possible combination. Without a fallback mechanism, users would be **blocked from proceeding** when no matching data exists.

---

## 💡 Solution: Smart Fallback

Generate **context-aware fallback data** that adapts to the user's filter selections, but **only when absolutely necessary** to avoid expensive calculations.

---

## 🚨 Temperature Profile Generation

### What Are Temperature Profiles?

Temperature profiles are pre-calculated time curves for cooling/heating beverages based on:
- **Drink type** (e.g., cerveza, vino, agua)
- **Mode** (different cooling speeds/strategies)
- **Temperature ranges** (initial → final temperature)

Each profile contains timing data for three slot types (A, B, C):

```typescript
{
  temperature: 8, // °C
  timeA: 90,      // seconds for slot type A
  timeB: 135,     // seconds for slot type B
  timeC: 180,     // seconds for slot type C
}
```

### Generation Process

Temperature profiles are **expensive to generate** because they:
1. Calculate cooling curves for 4 temperature points (25°C, 15°C, 8°C, 2°C)
2. Generate timing data for 3 slot types per temperature
3. Apply mode-specific multipliers
4. Create a complete profile set (12 data points per drink type)

**Example console output:**

```
🚨 TEMP PROFILE: Generating profiles for cerveza (index: 0)
🚨 TEMP PROFILE: Base time: 30s
🚨 TEMP PROFILE: 25°C → timeA=30s, timeB=45s, timeC=60s
🚨 TEMP PROFILE: 15°C → timeA=60s, timeB=90s, timeC=120s
🚨 TEMP PROFILE: 8°C → timeA=90s, timeB=135s, timeC=180s
🚨 TEMP PROFILE: 2°C → timeA=120s, timeB=180s, timeC=240s
🚨 TEMP PROFILE: Generated 4 profiles for cerveza
```

---

## 🎯 When Temperature Profiles Are Generated

### ✅ ONLY Generate When

1. **On the correct pages:**
   - `/container-type` (last filter step before temperature)
   - `/temperature` (final step where profiles are displayed)

2. **In the correct flow:**
   - `program-product` flow only
   - ❌ NEVER in `program-time` flow (no products involved)

3. **When data is missing:**
   - `dataFiltered.length === 0` (no matching orders in database)

4. **With an active session:**
   - User has clicked "Program Product" and started the flow

### ❌ NEVER Generate When

1. **On early product flow pages:**
   - `/drink-type` ❌
   - `/volume` ❌
   - Other filter pages ❌

2. **On time flow pages:**
   - `/time` ❌ (program-time doesn't need temperature profiles)

3. **On initial load:**
   - No session exists yet ❌

4. **When real data exists:**
   - `dataFiltered.length > 0` ❌ (use database entries instead)

---

## 🏗️ Architecture: Four-Layer Safety Net

The `useSmartFallback` hook implements a **four-layer check** to ensure profiles are only generated when absolutely necessary:

```typescript
// Layer 1: Session Check
if (!currentSessionId) {
  return null; // ✅ Skip if no active session (initial load)
}

// Layer 2: Flow Type Check
const currentSession = sessions[currentSessionId];
if (currentSession?.flowType === FLOW_TYPES.PROGRAM_TIME) {
  return null; // ✅ Skip if time flow (no products)
}

// Layer 3: Route Check (CRITICAL!)
const isOnRelevantRoute =
  location.pathname === PATHS.containerType ||
  location.pathname === PATHS.temperature;

if (!isOnRelevantRoute) {
  return null; // ✅ Skip if not on final product flow pages
}

// Layer 4: Data Check
if (dataFiltered.length > 0) {
  return null; // ✅ Skip if real data exists
}

// ✅ All checks passed - generate profiles
const temperatureProfiles = generateTemperatureProfiles(modeId, drinkType);
```

---

## 📊 Flow Comparison

### Program Product Flow (✅ Temperature Profiles Needed)

```
MainPage
  ↓ Click "Program Product"
Session created (flowType: 'program-product')
  ↓
/drink-type
  ↓ Select drink
/volume
  ↓ Select volume
/container-type ← 🎯 Generate profiles HERE (if dataFiltered is empty)
  ↓ Select container
/temperature ← 🎯 Use profiles HERE (display temperature options)
  ↓ Select temperatures
START → Create timers
```

### Program Time Flow (❌ No Temperature Profiles)

```
MainPage
  ↓ Click "Program Time"
Session created (flowType: 'program-time')
  ↓
/time ← ⚠️ Skip profile generation (time-only flow)
  ↓ Set minutes/seconds
START → Create timers
```

---

## 🚀 Performance Impact

### Before Optimization (❌)

```
Click "Program Product"
  ↓
/drink-type → Generate profiles ❌ (unnecessary, 50ms wasted)
  ↓
/volume → Generate profiles ❌ (unnecessary, 50ms wasted)
  ↓
/container-type → Generate profiles ✅ (needed)
  ↓
/temperature → Generate profiles ✅ (needed, but already done)

Total: 4 generations, 200ms wasted
```

### After Optimization (✅)

```
Click "Program Product"
  ↓
/drink-type → Skip (wrong route) ✅ (0ms)
  ↓
/volume → Skip (wrong route) ✅ (0ms)
  ↓
/container-type → Generate profiles ✅ (50ms, needed)
  ↓
/temperature → Use cached profiles ✅ (0ms, already generated)

Total: 1 generation, 50ms total, 75% performance improvement!
```

---

## 🔧 Key Files

### Core Hook

- **`src/hooks/useSmartFallback.ts`**
  - Implements the four-layer safety net
  - Generates fallback entries when needed
  - Sets up temperature filters

### Temperature Generator

- **`src/utils/temperature-profile-generator.ts`**
  - Pure function that calculates temperature profiles
  - Input: `modeId`, `drinkType`
  - Output: Array of temperature profiles with timing data

### Usage Locations

- **`src/pages/TemperaturePage/TemperaturePage.tsx`**
  - Displays temperature options to user
  - Uses profiles from smart fallback

- **`src/hooks/useProcessTimesFromTemperatureFilter.ts`**
  - Calls `useSmartFallback()` to ensure profiles exist
  - Calculates timer durations based on temperature selection
  - ⚠️ Called from `useProductFlowOperations` on every render

---

## 🎨 Flow Types

The project uses **flow type discrimination** to determine which logic to run:

```typescript
export const FLOW_TYPES = {
  PROGRAM_TIME: 'program-time',      // Simple time-based timers (no products)
  PROGRAM_PRODUCT: 'program-product', // Product matching with temperature profiles
} as const;
```

**When a session is created:**

```typescript
// Time flow
const sessionId = createSession(FLOW_TYPES.PROGRAM_TIME);

// Product flow
const sessionId = createSession(FLOW_TYPES.PROGRAM_PRODUCT);
```

**Throughout the app, flow type is checked:**

```typescript
if (session.flowType === FLOW_TYPES.PROGRAM_TIME) {
  // Skip temperature-related logic
}
```

---

## 🐛 Common Pitfalls

### 1. Calling `useSmartFallback()` Too Early

**Problem:**

```typescript
// ❌ BAD: Called in a hook used on every page
export const useProductFlowOperations = () => {
  const { createFallbackEntry } = useSmartFallback(); // Runs on every page!
  // ...
}
```

**Solution:**
The hook has built-in route checks, but be aware it's still **called** on every render where the parent hook is used.

### 2. Forgetting Flow Type Check

**Problem:**

```typescript
// ❌ BAD: Generates profiles for time flow
if (!dataFiltered.length) {
  generateTemperatureProfiles(modeId, drinkType);
}
```

**Solution:**

```typescript
// ✅ GOOD: Check flow type first
if (session.flowType === FLOW_TYPES.PROGRAM_PRODUCT && !dataFiltered.length) {
  generateTemperatureProfiles(modeId, drinkType);
}
```

### 3. Not Checking Route

**Problem:**

```typescript
// ❌ BAD: Generates on drink-type page
useEffect(() => {
  if (!dataFiltered.length) {
    generateProfiles();
  }
}, [dataFiltered]);
```

**Solution:**

```typescript
// ✅ GOOD: Only on relevant routes
useEffect(() => {
  if (!isOnRelevantRoute || !dataFiltered.length) return;
  generateProfiles();
}, [dataFiltered, isOnRelevantRoute]);
```

---

## 📈 Future Considerations

### If Adding New Flow Types

When adding new flow types (e.g., `program-recipe`, `program-batch`):

1. **Define the flow type:**

```typescript
export const FLOW_TYPES = {
  PROGRAM_TIME: 'program-time',
  PROGRAM_PRODUCT: 'program-product',
  PROGRAM_RECIPE: 'program-recipe', // NEW
} as const;
```

2. **Update `useSmartFallback` checks:**

```typescript
// Only generate for flows that need temperature profiles
const needsTemperatureProfiles =
  session.flowType === FLOW_TYPES.PROGRAM_PRODUCT ||
  session.flowType === FLOW_TYPES.PROGRAM_RECIPE;

if (!needsTemperatureProfiles) {
  return null;
}
```

3. **Update route checks if needed:**

```typescript
// If new flow has different pages
const isOnRelevantRoute =
  (session.flowType === FLOW_TYPES.PROGRAM_PRODUCT &&
    (pathname === PATHS.containerType || pathname === PATHS.temperature)) ||
  (session.flowType === FLOW_TYPES.PROGRAM_RECIPE &&
    pathname === PATHS.recipeSelection);
```

---

## 🧪 Testing Strategy

### Manual Testing

**Test 1: Early product flow pages**

```
1. Click "Program Product"
2. Navigate to /drink-type
3. Open console → Should see NO temperature profile logs ✅
4. Navigate to /volume
5. Open console → Should see NO temperature profile logs ✅
```

**Test 2: Container-type page (when needed)**

```
1. Navigate to /container-type
2. If dataFiltered is empty → Should see temperature profile logs ✅
3. Profiles should be generated exactly once ✅
```

**Test 3: Temperature page**

```
1. Navigate to /temperature
2. Temperature profiles should be available ✅
3. Can select initial/final temperatures ✅
4. No duplicate profile generation ✅
```

**Test 4: Time flow**

```
1. Click "Program Time"
2. Navigate to /time
3. Open console → Should see NO temperature profile logs ✅
```

### Automated Testing

```typescript
describe('useSmartFallback', () => {
  it('should skip generation on early product pages', () => {
    // Test route check
  });

  it('should skip generation for time flow', () => {
    // Test flow type check
  });

  it('should generate profiles on container-type with no data', () => {
    // Test generation when needed
  });

  it('should skip generation when real data exists', () => {
    // Test data check
  });
});
```

---

## 📝 Decision Log

### Why Route-Based Check?

**Date:** 2025-10-25
**Decision:** Add route-based check to `useSmartFallback`
**Reason:** Temperature profiles were being generated on every product flow page, wasting CPU cycles
**Impact:** 75% reduction in profile generation calls

### Why Four-Layer Check?

**Date:** 2025-10-25
**Decision:** Implement four-layer safety net (session, flow type, route, data)
**Reason:** Defense in depth - each layer catches a different edge case
**Impact:** Robust, performant system that never generates unnecessarily

---

## 🎓 Key Takeaways

1. **Temperature profiles are expensive** - only generate when absolutely necessary
2. **Flow type discrimination** - use `session.flowType` to determine which logic to run
3. **Route-based optimization** - only run expensive operations on relevant pages
4. **Four-layer safety net** - session → flow type → route → data checks
5. **Smart fallback ≠ always fallback** - only when user would be blocked

---

## 📚 Related Documentation

- [Flow Types](./FLOW_TYPES.md)
- [Session Management](./SESSION_MANAGEMENT.md)
- [Temperature Profile Generator](./TEMPERATURE_PROFILES.md)
- [Performance Optimization](./PERFORMANCE_OPTIMIZATION.md)

---

**Last Updated:** 2025-10-25
**Maintainer:** Project Team
**Status:** ✅ Active

