# Button Operations - Refactored Architecture

## 📁 File Structure

```
hooks/
├── useButtonOperations.ts              (Legacy re-export for backward compatibility)
└── button-operations/
    ├── index.ts                        (Main orchestrator - 90 lines)
    ├── types.ts                        (Shared types - 15 lines)
    ├── useMainPageOperations.ts        (MainPage operations - 170 lines)
    ├── useTimeFlowOperations.ts        (Time flow operations - 150 lines)
    ├── useProductFlowOperations.ts     (Product flow operations - 260 lines)
    ├── useOperationState.ts            (Shared state logic - 160 lines)
    └── README.md                       (This file)
```

## 🎯 Overview

The `useButtonOperations` hook has been refactored from a **600+ line monolithic hook** into **5 focused, testable hooks** organized by user flow.

### **Before** ❌

- 669 lines in one file
- 67 lines of hooks/state
- 11 different operations mixed together
- Hard to test, maintain, and understand

### **After** ✅

- ~845 lines split across 6 files (more readable)
- Clear separation by user flow
- Each hook is independently testable
- Backward compatible API

---

## 🏗️ Architecture

### **1. Main Orchestrator** (`index.ts`)

Combines all flow-specific hooks into a unified API. Maintains backward compatibility with the original `useButtonOperations` hook.

```typescript
import { useButtonOperations } from 'hooks/button-operations';

const {
  handleProgramProduct,
  handleStartProductProcess,
  getOperationDisabled,
} = useButtonOperations();
```

### **2. Flow-Specific Hooks**

#### **useMainPageOperations**

Handles MainPage-specific operations:
- ✅ `handleClearCompleted` - Clear all completed timers
- ✅ `handleCancelCompleted` - Cancel selected active timers
- ✅ `handleSelectAll` - Select all MainPage slots
- ✅ `handleRepeatSelection` - Repeat last saved configuration

**Use case**: MainPage timer management and selection

```typescript
import { useMainPageOperations } from 'hooks/button-operations';

const { handleClearCompleted, handleSelectAll } = useMainPageOperations();
```

---

#### **useTimeFlowOperations**

Handles Time Flow (Program Time):
- ✅ `handleProgramTime` - Navigate from MainPage → TimePage
- ✅ `handleStartTimeProcess` - Start timers from TimePage → MainPage
- ✅ `handleCancelTimeSession` - Cancel time session and return to MainPage

**Use case**: Time programming flow

```typescript
import { useTimeFlowOperations } from 'hooks/button-operations';

const { handleProgramTime, handleStartTimeProcess } = useTimeFlowOperations();
```

---

#### **useProductFlowOperations**

Handles Product Flow (Program Product):
- ✅ `handleProgramProduct` - Navigate from MainPage → DrinkType page
- ✅ `handleStartProductProcess` - Start product process from DrinkType page
- ✅ `handleFinishProductProcess` - Finish product process from Temperature page
- ✅ `handleCancelProductSession` - Cancel product session and return to MainPage

**Use case**: Product programming flow (drink selection → temperature → timers)

```typescript
import { useProductFlowOperations } from 'hooks/button-operations';

const {
  handleProgramProduct,
  handleFinishProductProcess,
  isTemperatureLoading,
} = useProductFlowOperations();
```

---

#### **useOperationState**

Shared logic for determining operation disabled/loading states across all flows.

**Use case**: Centralized state management for button states

```typescript
import { useOperationState } from 'hooks/button-operations';

const { getOperationDisabled, getOperationLoading } = useOperationState(
  mainPagePending,
  timeFlowPending,
  productFlowPending,
  isTemperatureLoading,
);
```

---

## 🔄 Migration Guide

### **No Changes Required!**

The refactoring is **100% backward compatible**. All existing imports will continue to work:

```typescript
// ✅ This still works exactly the same
import { useButtonOperations } from 'hooks/button-operations/useButtonOperations';

const {
  handleProgramProduct,
  handleStartProductProcess,
  getOperationDisabled,
} = useButtonOperations();
```

### **Optional: Use Specific Hooks**

For better performance and clarity, you can import only what you need:

```typescript
// ✅ Recommended for new code
import { useMainPageOperations } from 'hooks/button-operations';

const { handleClearCompleted, handleSelectAll } = useMainPageOperations();
```

---

## 📊 Benefits

### **1. Better Organization**

- **MainPage operations** are in `useMainPageOperations`
- **Time flow** is in `useTimeFlowOperations`
- **Product flow** is in `useProductFlowOperations`
- **State logic** is in `useOperationState`

### **2. Easier Testing**

Each hook can be tested independently without mocking the entire operation set.

### **3. Better Performance**

Components can import only the operations they need, reducing unnecessary re-renders.

### **4. Clearer Dependencies**

Each hook explicitly declares its dependencies, making it easier to understand data flow.

### **5. Easier Maintenance**

- Working on MainPage? Only touch `useMainPageOperations`
- Adding a new time flow feature? Only modify `useTimeFlowOperations`
- No risk of breaking unrelated features

---

## 🧪 Testing

Each hook can now be tested independently:

```typescript
// Test MainPage operations
import { renderHook } from '@testing-library/react';
import { useMainPageOperations } from 'hooks/button-operations';

test('handleClearCompleted clears all completed timers', () => {
  const { result } = renderHook(() => useMainPageOperations());
  // ... test logic
});
```

---

## 🔮 Future Improvements

1. **Extract timer logic** into `useTimerOperations` sub-hook
2. **Extract selection logic** into `useSelectionOperations` sub-hook
3. **Add error boundaries** for each flow
4. **Add telemetry** for operation tracking
5. **Create flow diagrams** showing state transitions

---

## 📝 Notes

- All operations maintain their original behavior
- No breaking changes to the API
- The original `useButtonOperations.ts` now re-exports from the new structure
- TypeScript types are preserved and re-exported

---

## 🙋 Questions?

If you have questions about this refactoring, check:
1. The original implementation in git history
2. The individual hook files for detailed comments
3. The orchestrator (`index.ts`) for how everything connects

