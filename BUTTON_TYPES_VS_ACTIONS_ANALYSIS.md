# Button Types - Simplified Architecture

## Overview

The codebase now uses a **single, unified button type system**:
- **`BUTTON_TYPE`** - The const object containing all button type constants
- **`ButtonType`** - The TypeScript type derived from `BUTTON_TYPE`

All buttons use SCREAMING_SNAKE_CASE constants (e.g., `BUTTON_TYPE.CLEAR_COMPLETED`) for both identity and action.

---

## Current Architecture

### Single Source of Truth

```typescript
const BUTTON_TYPES = [
  'CLEAR_COMPLETED',
  'CANCEL_SELECTED',
  'SELECT_ALL',
  'NAVIGATE_BACK',
  'NAVIGATE_NEXT',
  'START_PROCESS',
  'FINISH_PRODUCT_PROCESS',
  'PROGRAM_PRODUCT',
  'PROGRAM_TIME',
  'REPEAT_SELECTION',
  'CANCEL_TIME_SESSION',
  'CANCEL_PRODUCT_SESSION',
] as const;

export const BUTTON_TYPE = createConstUpperEnum(BUTTON_TYPES);
export type ButtonType = keyof typeof BUTTON_TYPE;
```

### Usage Throughout Codebase

1. **Route Configuration** (`config/routes/routes.config.ts`)

   ```typescript
   buttons: {
     footer: [BUTTON_TYPE.CLEAR_COMPLETED, BUTTON_TYPE.SELECT_ALL],
     content: [BUTTON_TYPE.PROGRAM_TIME, BUTTON_TYPE.PROGRAM_PRODUCT],
   }
   ```

2. **Button Configuration** (`config/ui/button.config.ts`)

   ```typescript
   export const BUTTON_CONFIGS: Record<ButtonType, PadActionConfig> = {
     [BUTTON_TYPE.CLEAR_COMPLETED]: {
       id: 'button-reset',
       type: BUTTON_TYPE.CLEAR_COMPLETED,
       actionType: BUTTON_TYPE.CLEAR_COMPLETED,
       // ...
     },
   };
   ```

3. **Action Execution** (`hooks/useButtonConfig.ts`)

   ```typescript
   switch (actionType) {
     case BUTTON_TYPE.CLEAR_COMPLETED:
       return handleClearCompleted();
     case BUTTON_TYPE.NAVIGATE_BACK:
       return handleNavigateBack();
     // ...
   }
   ```

---

## Benefits of Consolidation

1. **Single Source of Truth** - One array defines all button types
2. **No Duplication** - No need to maintain separate type/action mappings
3. **Type Safety** - All constants are type-checked
4. **Simpler Mental Model** - Button type IS its action
5. **Consistent Naming** - SCREAMING_SNAKE_CASE throughout

---

## Migration History

Previously, the codebase had two separate enums:
- `BUTTON_TYPE` (button identity)
- `BUTTON_ACTION` (button behavior)

These were consolidated into a single `BUTTON_TYPE` system where:
- Button identity and action are the same
- All values use descriptive SCREAMING_SNAKE_CASE names
- The `createConstUpperEnum` utility generates the const object automatically

---

## Current Button Types

All 12 button types:

```typescript
'CLEAR_COMPLETED'           // Clear all completed timers
'CANCEL_SELECTED'          // Cancel selected active timers
'SELECT_ALL'                // Select all MainPage slots
'NAVIGATE_BACK'             // Navigate to previous page
'NAVIGATE_NEXT'             // Navigate to next page
'START_PROCESS'             // Start time/product process
'FINISH_PRODUCT_PROCESS'    // Finish product flow
'PROGRAM_PRODUCT'           // Start product programming flow
'PROGRAM_TIME'              // Start time programming flow
'REPEAT_SELECTION'          // Repeat last saved configuration
'CANCEL_TIME_SESSION'       // Cancel time session
'CANCEL_PRODUCT_SESSION'    // Cancel product session
```

---

## Architecture Flow

```text
BUTTON_TYPES array (source of truth)
    ↓
createConstUpperEnum() generates BUTTON_TYPE object
    ↓
ButtonType = keyof typeof BUTTON_TYPE
    ↓
Used in:
  - Route configs (which buttons appear)
  - Button configs (button UI/metadata)
  - Action handlers (what happens on click)
```

---

## Notes

- All button types use SCREAMING_SNAKE_CASE for consistency
- The `createConstUpperEnum` utility eliminates repetition
- No kebab-case strings - everything is type-safe constants
- Button type and action are unified - simpler architecture
