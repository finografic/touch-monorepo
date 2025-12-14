# Button Hooks - Architecture & Organization

📅 Oct 21, 2025

## 📁 File Structure

```text
hooks/buttons/
├── index.ts                        (barrel exports only)
├── button.types.ts                 (shared types)
├── timer-filter.utils.ts           (utility functions)
│
├── useNavigationButtons.ts         (navigation handlers & logic)
├── useNavigationButtonsConfig.ts   (navigation button config - uses useNavigationButtons)
├── useButtonsState.ts              (button disabled/loading state management)
│
├── useTimeFlowOperations.ts        (Time flow operations)
├── useProductFlowOperations.ts     (Product flow operations)
│
└── README.operations-hook.md       (This file)

pages/MainPage/
├── useMainPageOperations.ts        (MainPage-specific operations)
└── useMainPageConfig.ts            (MainPage content buttons config)
```

## 🎯 Design Principles

### **1. Semantic Naming**

Hook names clearly indicate their purpose and relationships:
- **`useNavigationButtons`** → Provides navigation handlers (`handleNavigateBack`, `handleNavigateNext`)
- **`useNavigationButtonsConfig`** → Builds navigation button props (uses `useNavigationButtons`)
- **`useButtonsState`** → Manages button disabled/loading states
- **`useMainPageOperations`** → MainPage-specific operation handlers
- **`useMainPageConfig`** → MainPage content buttons configuration

The naming pattern `useX` → `useXConfig` makes dependencies obvious without reading code.

### **2. Separation of Concerns**

- **Navigation**: `useNavigationButtons` + `useNavigationButtonsConfig`
- **State Management**: `useButtonsState`
- **Flow Operations**: `useTimeFlowOperations`, `useProductFlowOperations`
- **Page-Specific**: MainPage hooks co-located with the page component

### **3. Co-location**

Page-specific hooks live with their components:
- `pages/MainPage/useMainPageOperations.ts`
- `pages/MainPage/useMainPageConfig.ts`

This makes it clear these hooks are only used by MainPage.

## 🏗️ Hook Relationships

### **Navigation Buttons Flow**

```
useNavigationButtons (handlers)
    ↓
useNavigationButtonsConfig (builds button props)
    ↓
FrontEndNavigation (renders footer buttons)
```

### **MainPage Buttons Flow**

```
useMainPageOperations (handlers)
    ↓
useMainPageConfig (builds content button props)
    ↓
MainPage (renders content buttons)
```

### **State Management**

```
useButtonsState (manages disabled/loading)
    ↓
Used by: useNavigationButtonsConfig, useMainPageConfig
```

## 📚 Hook Reference

### **useNavigationButtons**

Provides navigation handlers and disabled state logic.

**Returns:**
- `handleNavigateBack()` - Navigate to previous route
- `handleNavigateNext()` - Navigate to next route
- `getNavigationDisabled(actionType)` - Check if navigation is disabled
- `isNavigationPending` - Navigation transition state

**Used by:** `useNavigationButtonsConfig`

```typescript
import { useNavigationButtons } from 'hooks/buttons';

const { handleNavigateBack, handleNavigateNext } = useNavigationButtons();
```

---

### **useNavigationButtonsConfig**

Route-aware navigation buttons configuration. Builds footer button props based on current route.

**Returns:**
- `footerButtons: PadActionProps[]` - Array of footer button props

**Uses:**
- `useNavigationButtons` - For navigation handlers
- `useButtonsState` - For disabled/loading states
- `useMainPageOperations` - For MainPage footer button handlers
- `useTimeFlowOperations` - For time flow handlers
- `useProductFlowOperations` - For product flow handlers

**Used by:** `FrontEndNavigation` component

```typescript
import { useNavigationButtonsConfig } from 'hooks/buttons';

const { footerButtons } = useNavigationButtonsConfig();
```

---

### **useButtonsState**

Centralized logic for determining button disabled/loading states across all flows.

**Parameters (named, all optional, default to `false`):**
- `isMainPagePending?: boolean`
- `isTimeFlowPending?: boolean`
- `isProductFlowPending?: boolean`
- `isTemperatureLoading?: boolean`

**Returns:**
- `getOperationDisabled(actionType)` - Check if operation button is disabled
- `getOperationLoading(actionType)` - Check if operation button is loading
- `isOperationPending` - Combined pending state

**Used by:** `useNavigationButtonsConfig`, `useMainPageConfig`

```typescript
import { useButtonsState } from 'hooks/buttons';

const { getOperationDisabled, getOperationLoading } = useButtonsState({
  isMainPagePending: true,
  isTimeFlowPending: false,
  // ... other states default to false
});
```

---

### **useTimeFlowOperations**

Handles Time Flow operations (Program Time).

**Returns:**
- `handleProgramTime()` - Navigate from MainPage → TimePage
- `handleStartTimeProcess(duration)` - Start timers from TimePage → MainPage
- `handleCancelTimeSession()` - Cancel time session and return to MainPage
- `isPending` - Operation pending state

**Used by:** `useNavigationButtonsConfig`, `useMainPageConfig`

```typescript
import { useTimeFlowOperations } from 'hooks/buttons';

const { handleProgramTime, handleStartTimeProcess } = useTimeFlowOperations();
```

---

### **useProductFlowOperations**

Handles Product Flow operations (Program Product).

**Returns:**
- `handleProgramProduct()` - Navigate from MainPage → DrinkType page
- `handleStartProductProcess()` - Start product process from Temperature page
- `handleCancelProductSession()` - Cancel product session and return to MainPage
- `isTemperatureLoading` - Temperature control loading state
- `isPending` - Operation pending state

**Used by:** `useNavigationButtonsConfig`, `useMainPageConfig`

```typescript
import { useProductFlowOperations } from 'hooks/buttons';

const {
  handleProgramProduct,
  handleStartProductProcess,
  isTemperatureLoading,
} = useProductFlowOperations();
```

---

### **useMainPageOperations** (in `pages/MainPage/`)

MainPage-specific operation handlers.

**Returns:**
- `handleResetCompleted()` - Clear all completed timers
- `handleCancelSelected()` - Cancel selected active timers
- `handleSelectAll()` - Select all MainPage slots
- `handleRepeatSelection()` - Repeat last saved configuration
- `isPending` - Operation pending state

**Used by:** `useMainPageConfig`, `useNavigationButtonsConfig`

```typescript
import { useMainPageOperations } from 'pages/MainPage/useMainPageOperations';

const { handleResetCompleted, handleSelectAll } = useMainPageOperations();
```

---

### **useMainPageConfig** (in `pages/MainPage/`)

MainPage-specific content buttons configuration.

**Returns:**
- `contentButtons: PadActionProps[]` - Array of content button props (PROGRAM_TIME, PROGRAM_PRODUCT, REPEAT_SELECTION)

**Uses:**
- `useMainPageOperations` - For MainPage operation handlers
- `useTimeFlowOperations` - For PROGRAM_TIME handler
- `useProductFlowOperations` - For PROGRAM_PRODUCT handler
- `useButtonsState` - For disabled/loading states

**Used by:** `MainPage` component

```typescript
import { useMainPageConfig } from 'pages/MainPage/useMainPageConfig';

const { contentButtons } = useMainPageConfig();
```

---

## 📊 Benefits of This Structure

### **1. Self-Documenting Code**

- Hook names clearly indicate purpose and relationships
- `useNavigationButtons` → `useNavigationButtonsConfig` shows dependency
- No need to read code to understand structure

### **2. Easy Navigation**

- Page-specific hooks are co-located with components
- Shared hooks are in a central location
- Clear separation between navigation, state, and operations

### **3. Reduced Cognitive Load**

- Each hook has a single, clear responsibility
- Dependencies are obvious from naming
- No guessing about which hook to use

### **4. Better Maintainability**

- Working on navigation? → `useNavigationButtons*` hooks
- Working on MainPage? → `pages/MainPage/` hooks
- Working on button states? → `useButtonsState`
- Clear boundaries prevent accidental coupling

### **5. Type Safety**

- All hooks are properly typed
- Named parameters with defaults reduce errors
- TypeScript catches misuse at compile time

---

## 🔄 Import Patterns

### **From hooks/buttons (shared hooks):**

```typescript
import { useNavigationButtons } from 'hooks/buttons';
import { useNavigationButtonsConfig } from 'hooks/buttons';
import { useButtonsState } from 'hooks/buttons';
import { useTimeFlowOperations } from 'hooks/buttons';
import { useProductFlowOperations } from 'hooks/buttons';
```

### **From pages/MainPage (page-specific):**

```typescript
import { useMainPageOperations } from 'pages/MainPage/useMainPageOperations';
import { useMainPageConfig } from 'pages/MainPage/useMainPageConfig';
```

---

## 🧪 Testing

Each hook can be tested independently:

```typescript
import { renderHook } from '@testing-library/react';
import { useNavigationButtons } from 'hooks/buttons';

test('handleNavigateBack navigates to previous route', () => {
  const { result } = renderHook(() => useNavigationButtons());
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

- All hooks maintain their original behavior
- No breaking changes to the API
- The barrel export (`index.ts`) provides convenient imports
- TypeScript types are preserved and re-exported
- Named parameters with defaults make hooks easier to use

---

## 🙋 Questions?

If you have questions about this structure, check:
1. The individual hook files for detailed comments
2. The components that use these hooks
3. The barrel export (`index.ts`) for available hooks
