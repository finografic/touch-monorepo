# README: Smart Mocked Profile System

📅 Oct 11, 2025 (approx)

## 🚨 Issue to Solve

**Problem**: Current dirty fix creates static mock data that doesn't adapt to user's filter selections, causing:
- Timer starts at 5:00 (600 seconds) regardless of user's actual filter choices
- Uses `modeId: 3` with `timeA/B/C: 600` for all scenarios
- Mock data is one-size-fits-all instead of context-aware

**Root Cause**: `useSmartFallback` creates static fallback entries instead of dynamic, filter-aware entries.

## 🎯 General Approach

Create a **Smart Fallback System** that:
1. **Uses real filters** when possible
2. **Falls back to mock** only when needed
3. **Adapts to user's selections** dynamically
4. **Uses consistent temperature profile logic** from server seeder

## ✅ Implementation Checklist

### Phase 1: Smart Fallback Hook

- [x] Create `useSmartFallback` hook
- [x] Watch `dataFiltered.length` for empty data scenarios
- [x] Create context-aware fallback using real filters + mock only when needed
- [x] Replace old fallback system with `useSmartFallback`

### Phase 2: Temperature Profile Logic

- [x] Copy temperature profile generation logic from `temperature_profiles.seed.ts` to client
- [x] Create `generateTemperatureProfiles` utility function
- [x] Use consistent `TEMPERATURE_RANGE`, `TIME_FACTORS`, `MIN_TIME`, `MAX_TIME` constants
- [x] Implement proper time progression logic (baseTime + tempIndex * TIME_INCREMENT)

### Phase 3: Closest-To Logic

- [x] Implement "closest-to" temperature profile selection
- [x] Use existing closest-to logic from TemperaturePage
- [x] Apply closest-to when no exact temperature match exists

### Phase 4: Integration

- [x] Integrate smart fallback with temperature profile generation
- [x] Test with different filter combinations
- [x] Ensure timer durations are realistic (not 5:00 for everything)
- [x] Verify temperature profiles match user's actual selections
- [x] Fix fallback activation - only when dataFiltered.length === 0

## 🚀 Phase 5: DataPool Proxy Implementation

**Note**: DataPool Proxy implementation has been moved to `README.MOCKED_ENTRIES.md` for better organization.

- [x] Create `useDataPoolProxy` hook
- [x] Generate context-aware mock entries based on current filters
- [x] Integrate proxy into `useRouteChangeHandler`
- [x] Ensure buttons remain visible when `dataFiltered.length === 0`
- [x] Maintain reactive behavior for filter changes
- [x] Keep original `dataPool` intact (non-mutating)
- [x] Implement named parameter syntax: `{ dataPool: OrderReadableModel[] }`
- [x] Remove generic typing for simplicity, keep as comment

## 🔮 Future Enhancement: Using Existing Profiles

### Potential Benefits

- **Real Data**: Product owner can add profiles manually and see them
- **Consistency**: Uses actual database entries when available
- **Flexibility**: Falls back to mock only when no real data exists

### Implementation Approach

- [ ] Query existing temperature profiles from database
- [ ] Use closest-to logic to find best matching profile
- [ ] Fall back to generated mock profiles only when no real data exists
- [ ] Consider orderId disattachment (profiles not tied to specific orders)

### Technical Considerations

- **Performance**: Database queries vs. client-side generation
- **Caching**: Cache existing profiles to avoid repeated queries
- **Fallback Strategy**: When to use real vs. mock profiles

## 🎯 Success Criteria

- [ ] Timer durations are realistic and context-aware
- [ ] Temperature profiles adapt to user's filter selections
- [ ] No more static 5:00 timers for all scenarios
- [ ] Consistent temperature profile generation logic
- [ ] Smooth user experience with dynamic fallbacks

## 📝 Notes

- **Current Issue**: Static mock data causes unrealistic timer durations
- **Solution**: Dynamic, filter-aware mock data generation
- **Future**: Potential integration with existing database profiles
- **Priority**: Phase 1-4 implementation first, then consider existing profile integration

---

**Status**: ✅ Completed
**Last Updated**: 2025-01-10
**Next Steps**: Consider future enhancement with existing database profiles
