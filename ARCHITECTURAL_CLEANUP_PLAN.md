# Architectural Cleanup Plan - Touch Monorepo

## Background & Context

This document outlines four major architectural issues identified in the Touch Monorepo temperature management system. These issues were discovered during extensive debugging of the TemperaturePage component, where intermittent failures occurred when API calls weren't consistently made, leading to temperature forms not rendering and timers not displaying on the MainPage.

### System Overview

The application manages a temperature control flow where users:
1. Select slots on MainPage
2. Navigate through filter pages (drinkType, drinkSubtype, volume, containerType)
3. Configure temperatures on TemperaturePage
4. Start the process to create countdown timers

### Key Components

- **MainPage**: Slot selection interface
- **TemperaturePage**: Temperature configuration
- **OrdersContext**: Global order state management
- **SessionContext**: Session and filter state
- **LayoutUiContext**: UI state including `mainPageSelectedSlots`
- **useFilters**: Filter management and data filtering
- **useTemperatureControl**: Temperature calculation and timer creation

### Critical Fix Preserved

The "closest temperature" logic in `findClosestProfile()` is essential - without it, clicking START on TemperaturePage will fail to reach MainPage. This was implemented to handle cases where user-input temperatures don't exactly match available temperature profiles.

## Architectural Issues Identified

### Issue 1: Selection State Duplication

**Problem**: Three different systems track the same selection state:
- `orders[].isSelected` (OrdersContext)
- `mainPageSelectedSlots[]` (LayoutUiContext)
- Session data

**Impact**: Redundant state management, complex fallback logic required for timer creation.

### Issue 2: Orders vs Orders_Readable Data Sources

**Problem**: Dual data fetching and management:
- `orders` table (raw database with IDs/foreign keys)
- `orders_readable` table (VIEW with human-readable names + temperature profiles)

**Impact**: Filter logic designed for `orders` structure, but `orders_readable` has different field names.

### Issue 3: useFilters Hook Complexity

**Problem**: Single hook managing too many responsibilities:
- Complete dataset management (`data`, `dataPool`, `dataFiltered`)
- Filter state management (`filters`)
- Filter operations (`setFilter`, `clearFilter`, etc.)

**Impact**: Timing issues where `dataFiltered` not available when components need it.

### Issue 4: Temperature System Complexity

**Problem**: Multiple hooks, server routes, and calculation methods for temperature management.

**Impact**: Potential redundancy, unclear data flow, scattered state management.

---

## TODO List & Implementation Plan

### 1. Selection State Consolidation

**Priority**: HIGH | **Complexity**: MEDIUM | **Risk**: MEDIUM | **Order**: 1st

#### Background

Currently, selection state is tracked in three places: `orders[].isSelected`, `mainPageSelectedSlots[]`, and session data. This redundancy caused the timer creation issue where `mainPageSelectedSlots` was empty in the mock flow, requiring fallback logic.

#### Approaches

**Approach A: Single Source of Truth with `mainPageSelectedSlots` (Recommended)**
1. **Audit current usage**:
   - Find all components using `orders[].isSelected`
   - Identify components using `mainPageSelectedSlots`
   - Map session data selection tracking

2. **Choose `mainPageSelectedSlots` as primary**:
   - It's already used by MainPage UI
   - It's the most direct representation of user selections
   - It's already in LayoutUiContext

3. **Update OrdersContext**:
   - Remove `isSelected` from `OrderItem` interface
   - Update `toggleOrder` to modify `mainPageSelectedSlots` instead
   - Update `selectAllOrders` to work with `mainPageSelectedSlots`

4. **Update timer creation logic**:
   - Remove fallback logic in `useButtonOperations.ts`
   - Use `mainPageSelectedSlots` directly
   - Update `setOrderProcessing` to work with slot numbers

**Approach B: Single Source of Truth with `orders[].isSelected`**
1. Keep `orders[].isSelected` as primary
2. Remove `mainPageSelectedSlots` from LayoutUiContext
3. Update MainPage to derive selections from `orders[].isSelected`
4. Update timer creation to use `orders.filter(o => o.isSelected)`

#### Gotchas

- **MainPage UI**: Ensure slot selection visual feedback still works
- **Navigation**: Test selection persistence across page navigation
- **Timer creation**: Verify the fallback logic removal doesn't break anything
- **Mock flow**: Ensure PATH_B (mock button) still works correctly
- **Session management**: Don't break session-based selection tracking

#### Success Criteria

- Single source of truth for selections
- No redundant state tracking
- Cleaner timer creation logic
- All selection functionality preserved

---

### 2. useFilters Hook Refactoring

**Priority**: MEDIUM | **Complexity**: HIGH | **Risk**: MEDIUM | **Order**: 2nd

#### Background

The `useFilters` hook is doing too much: managing complete dataset, filter state, and filtering operations. This causes timing issues where `dataFiltered` isn't available when components need it.

#### Approaches

**Approach A: Context-Based Refactoring (Recommended)**
1. **Create FilteringContext**:

   ```typescript
   interface FilteringContext {
     // Data
     data: OrderReadableModel[];           // Complete dataset
     dataPool: OrderReadableModel[];       // Current step filtered
     dataFiltered: OrderReadableModel[];   // Final filtered result

     // Filters
     filters: OrderFilters;
     setFilter: (key: OrderFieldKey, value: unknown) => void;
     clearFilter: (key: OrderFieldKey) => void;
     clearFilters: () => void;

     // Metadata
     uniqueValues: Record<string, string[]>;
     serverFieldMap: Record<string, string>;
   }
   ```

2. **Move filtering logic to context**:
   - Move `useMemo` calculations to context
   - Move filter operations to context actions
   - Ensure data is always available

3. **Rename `orders[]` to `selections[]`**:
   - Update OrdersContext interface
   - Update all references throughout codebase
   - Update component props and types

4. **Update components**:
   - Replace `useFilters()` calls with `useFiltering()`
   - Update imports and dependencies
   - Test all filter-dependent components

**Approach B: Split into Multiple Hooks**
1. Create `useFilterData()` for data management
2. Create `useFilterState()` for filter state
3. Create `useFilterOperations()` for filter actions
4. Update components to use appropriate hooks

#### Gotchas

- **Timing issues**: Ensure data is available when components mount
- **Filter persistence**: Don't break filter state across navigation
- **Component updates**: Many components depend on `useFilters`
- **Type safety**: Ensure all TypeScript types are updated
- **Performance**: Avoid unnecessary re-renders with context changes

#### Success Criteria

- Predictable data availability
- Cleaner separation of concerns
- No timing issues with `dataFiltered`
- Maintained filter functionality

---

### 3. Orders vs Orders_Readable Migration

**Priority**: MEDIUM | **Complexity**: HIGH | **Risk**: HIGH | **Order**: 3rd

#### Background

The system currently fetches both `orders` table (raw data) and `orders_readable` table (VIEW with human-readable names). Filter logic was designed for `orders` structure, but `orders_readable` has different field names.

#### Approaches

**Approach A: Gradual Migration (Recommended)**
1. **Audit field mappings**:
   - Map all `orders` table fields to `orders_readable` equivalents
   - Identify filter keys that need updating
   - Document all field name differences

2. **Update filter logic**:
   - Update `matchesFilters()` function to work with `orders_readable` field names
   - Update `getUniqueFilterValues()` for new field structure
   - Update `serverFieldMap` in useFilters

3. **Update data fetching**:
   - Remove `orders` table fetching
   - Use only `orders_readable` as data source
   - Update OrdersContext to work with `orders_readable` structure

4. **Update components**:
   - Update all components using `orders` table structure
   - Update type definitions
   - Test all filter-dependent functionality

**Approach B: Create Compatibility Layer**
1. Create adapter functions to convert between table structures
2. Keep both data sources temporarily
3. Gradually migrate components to use `orders_readable`
4. Remove `orders` table fetching once migration complete

#### Gotchas

- **Field name changes**: Many components expect specific field names
- **Filter compatibility**: Filter logic may break with different field structure
- **Type definitions**: Extensive TypeScript updates required
- **Database performance**: Ensure `orders_readable` VIEW performs well
- **Backward compatibility**: Don't break existing functionality during migration

#### Success Criteria

- Single data source (`orders_readable`)
- No dual data fetching
- Maintained filter functionality
- Cleaner data flow

---

## Implementation Notes

### Testing Strategy

- Test both PATH_A (manual flow) and PATH_B (mock flow) after each change
- Verify timer creation works in both flows
- Test temperature form rendering
- Verify MainPage selection functionality
- Test filter application across all pages

### Risk Mitigation

- Implement changes incrementally
- Maintain backward compatibility during transitions
- Preserve critical fixes (closest temperature logic)
- Test thoroughly before moving to next TODO item

### Success Metrics

- Reduced code complexity
- Eliminated redundant state management
- Improved data flow predictability
- Maintained all existing functionality
- Better maintainability for future development

---

## Files to Monitor

### Critical Files (Don't Break)

- `apps/client/src/hooks/useTemperatureControl.ts` - Timer creation logic
- `apps/client/src/hooks/useButtonOperations.ts` - START button handler
- `apps/client/src/utils/temperature.utils.ts` - `findClosestProfile()` function
- `apps/client/src/pages/TemperaturePage/TemperaturePage.tsx` - Temperature form

### Key Context Files

- `apps/client/src/providers/OrdersProvider/OrdersContext.ts`
- `apps/client/src/providers/LayoutUiProvider/LayoutUiContext.ts`
- `apps/client/src/providers/SessionProvider/SessionContext.ts`

### Filter-Related Files

- `apps/client/src/hooks/useFilters.ts`
- `apps/client/src/utils/filters.utils.ts`
- `apps/client/src/types/filters.types.ts`

This plan provides comprehensive background and detailed implementation guidance for each architectural cleanup task, ensuring continuity even if chat context is lost.
