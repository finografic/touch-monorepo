# README: Mocked Entries System

📅 Oct 11, 2025 (approx)

## 🚨 Overview

This document describes the **Mocked Entries System** implemented through two core hooks:
- `useDataPoolProxy` - Creates proxy layer for data injection
- `useRouteChangeHandler` - Handles route changes and filter synchronization

## 🎯 Purpose

**Problem Solved**: When users apply filters that result in empty data sets (`dataFiltered.length === 0`), the UI becomes unusable with no buttons visible.

**Solution**: Inject context-aware mock entries to ensure buttons remain visible while maintaining realistic user experience.

## 🏗️ Architecture

### Core Hooks

#### 1. `useDataPoolProxy`

- **Location**: `apps/client/src/hooks/useDataPoolProxy.ts`
- **Purpose**: Creates proxy layer between real dataPool and LayoutUiContext
- **Key Features**:
  - Non-mutating: Original dataPool stays intact
  - Reactive: Updates when filters change
  - Context-aware: Uses real filters for mock generation
  - Stable for current page: Buttons don't disappear when user changes selection

#### 2. `useRouteChangeHandler`

- **Location**: `apps/client/src/hooks/useRouteChangeHandler.ts`
- **Purpose**: Handles route changes and syncs filters
- **Key Features**:
  - Separated from useRouteConfig to avoid circular dependencies
  - Uses useDataPoolProxy for data injection
  - Tracks route changes to prevent unnecessary re-renders
  - Syncs filters from useFilters to OrdersContext

## 🔧 Implementation Details

### `useDataPoolProxy` Hook

```typescript
export const useDataPoolProxy = ({
  dataPool,
}: {
  dataPool: OrderReadableModel[];
}): { dataPoolProxy: OrderReadableModel[] } => {
  // Implementation details...
}
```

**Key Logic**:
- **Edge Case**: If `dataFiltered.length <= 1`, inject mock entries
- **Default**: Return real filtered data when available
- **Mock Generation**: Uses `generateMockEntries()` based on current filters

### `useRouteChangeHandler` Hook

```typescript
export const useRouteChangeHandler = () => {
  // Uses useDataPoolProxy for data injection
  const { dataPoolProxy } = useDataPoolProxy({ dataPool });

  // Handles route changes with proxy data
  // Syncs filters between contexts
}
```

**Key Logic**:
- **Route Change Detection**: Prevents unnecessary re-renders
- **Session Field Mapping**: Builds server field map from session filters
- **Error Handling**: Graceful error handling for route changes

## 📊 Mock Entry Generation

### `generateMockEntries` Function

**Location**: Inside `useDataPoolProxy.ts`

**Logic**:
- **Volume Entries**: Generated when `drinkType` exists but `drinkVolume` is missing
- **Container Entries**: Generated when `drinkVolume` exists but `containerType` is missing
- **Drink Type Entries**: Generated when `mode` exists but `drinkType` is missing

**Common Options**:
- **Volumes**: `['25cl', '33cl', '50cl', '75cl', '1L', '1.25L', '1.5L', '2L']`
- **Container Types**: `['plastico', 'vidrio', 'metal']`
- **Drink Types**: `['cerveza', 'vino', 'cava', 'licor', 'zumo', 'refresco', 'agua']`

## 🚀 Implementation History

### Phase 5: DataPool Proxy Implementation

- [x] Create `useDataPoolProxy` hook
- [x] Generate context-aware mock entries based on current filters
- [x] Integrate proxy into `useRouteChangeHandler`
- [x] Ensure buttons remain visible when `dataFiltered.length === 0`
- [x] Maintain reactive behavior for filter changes
- [x] Keep original `dataPool` intact (non-mutating)
- [x] Implement named parameter syntax: `{ dataPool: OrderReadableModel[] }`
- [x] Remove generic typing for simplicity, keep as comment

## 🚀 Data Flow

```
1. User applies filters
2. useFilters processes filters → dataFiltered
3. useDataPoolProxy checks dataFiltered.length
4. If empty: generateMockEntries() + inject into dataPool
5. If has data: return real dataFiltered
6. useRouteChangeHandler uses dataPoolProxy for UI
7. LayoutUiContext renders buttons from proxy data
```

## ✅ Benefits

- **Always Visible Buttons**: UI never becomes unusable
- **Context-Aware**: Mock entries match user's filter selections
- **Realistic Experience**: Mock data feels natural to users
- **Performance**: Only generates mocks when needed
- **Maintainable**: Clear separation of concerns

## 🔮 Future Enhancements

### Potential Improvements

1. **Database Integration**: Query existing entries instead of generating mocks
2. **Smart Caching**: Cache mock entries to avoid regeneration
3. **User Preferences**: Learn from user selections to improve mock quality
4. **A/B Testing**: Test different mock generation strategies

### Technical Considerations

- **Performance**: Current implementation is efficient with useMemo
- **Memory**: Mock entries are generated on-demand
- **Scalability**: Can handle large filter combinations

## 📝 Usage Examples

### Basic Usage

```typescript
// In a component
const { dataPool } = useFilters();
const { dataPoolProxy } = useDataPoolProxy({ dataPool });

// Use dataPoolProxy for rendering buttons
return (
  <ButtonGrid data={dataPoolProxy} />
);
```

### Route Change Handling

```typescript
// useRouteChangeHandler automatically handles:
// - Route change detection
// - Filter synchronization
// - Data proxy injection
// - Error handling
```

## 🎯 Success Criteria

- ✅ Buttons always visible regardless of filter combinations
- ✅ Mock entries are contextually relevant
- ✅ Real data takes precedence over mock data
- ✅ Performance remains optimal
- ✅ Code is maintainable and well-documented

---

**Status**: ✅ Implemented
**Last Updated**: 2025-01-10
**Maintainers**: Development Team
