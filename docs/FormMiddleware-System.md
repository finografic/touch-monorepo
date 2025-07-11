# FormMiddleware System

A centralized form enhancement layer that extends React Hook Form with advanced features like field dependencies, Spanish localization, dynamic constraints, and progressive forms.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Components](#components)
- [Configuration](#configuration)
- [Advanced Features](#advanced-features)
- [Migration Guide](#migration-guide)
- [Best Practices](#best-practices)

## 🎯 Overview

### The Problem

Our forms were becoming "spaghetti code" with:
- 335-line OrdersForm with scattered logic
- Manual field dependencies and validation
- Duplicated localization across components
- Complex temperature input typing issues ("5" → "5,0" → "5,1" interruption)
- Inconsistent styling between main form and table inputs

### The Solution

FormMiddleware provides a declarative layer that sits between React Hook Form and your components, centralizing:
- **Field dependencies** (freeze temp max = consume temp - 2°C)
- **Spanish localization** (comma/dot conversion, formatted display)
- **Debounced typing** (1000ms with smart interruption prevention)
- **Dynamic constraints** (min/max values that update based on other fields)
- **Progressive forms** (enable next row when current is complete)
- **Unified styling** (consistent appearance across all inputs)

### Impact

- **OrdersForm**: 335 lines → ~50 lines (85% reduction)
- **InputTemperature**: 315 lines → 200 lines (37% reduction, focused on UI)
- **Zero duplication** of validation, localization, or constraints logic
- **Consistent behavior** across main form and table inputs

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FormMiddleware Layer                     │
├─────────────────────────────────────────────────────────────┤
│ • Field Dependencies    • Spanish Localization             │
│ • Dynamic Constraints   • Debounced Input                  │
│ • Progressive Forms     • Centralized Constants            │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                React Hook Form (RHF)                       │
├─────────────────────────────────────────────────────────────┤
│ • Form State Management • Validation                       │
│ • Field Registration    • Error Handling                   │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                  UI Components                             │
├─────────────────────────────────────────────────────────────┤
│ • InputTemperature      • InputTime                        │
│ • TimesRepeaterTable    • SelectSearchable                 │
│ • Clean, focused on UI only                                │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Key Features

### 1. **1000ms Debounced Typing**

```typescript
// Problem: "5" → "5,0" → typing ",5" resulted in "5,1" instead of "5,5"
// Solution: Smart debouncing with typing state management

const [isTyping, setIsTyping] = useState(false);
const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

// Arrow keys and blur bypass debounce for immediate feedback
// Typing is debounced to prevent interruption
```

### 2. **Spanish Localization**

```typescript
// Display: "5,5" (Spanish format with comma)
// Storage: 5.5 (JavaScript number with dot)
// Automatic conversion: comma ↔ dot
formatValue: (name, value) => value.toLocaleString('es-ES', { minimumFractionDigits: 1 })
parseValue: (name, input) => parseFloat(input.replace(',', '.'))
```

### 3. **Dynamic Field Dependencies**

```typescript
const fieldConfigs = [
  {
    name: 'defaultTempFreeze',
    dependencies: {
      affects: [{
        targetField: 'defaultTempConsume',
        effect: 'constrainMax',
        calculate: (freezeTemp) => freezeTemp - MIN_TEMP_DIFFERENCE
      }]
    }
  }
];
// When freeze temp changes, consume temp max automatically updates
```

### 4. **Progressive Table Forms**

```typescript
// Automatically enable next row when current row is complete
// Support for editing completed rows
// Validation-based progression
```

### 5. **Centralized Constants**

```typescript
// 50+ constants across 8 categories:
export const INPUT_DEBOUNCE_DELAY = 1000;
export const TEMP_STEP = 0.5;
export const DEFAULT_TEMP_MIN = -50;
// No more magic numbers scattered across components
```

## 🚦 Quick Start

### 1. **Setup Form with Middleware**

```typescript
import { FormProvider, useForm } from 'react-hook-form';
import { FormMiddlewareProvider } from 'forms/FormMiddleware/FormMiddleware.simple';
import { InputTemperature } from 'forms/InputTemperature';

const YourForm = () => {
  const methods = useForm<FormValues>();

  return (
    <FormProvider {...methods}>
      <FormMiddlewareProvider
        formMethods={methods}
        fieldConfigs={fieldConfigs}
      >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <InputTemperature name="defaultTempConsume" />
          <InputTemperature name="defaultTempFreeze" />
        </form>
      </FormMiddlewareProvider>
    </FormProvider>
  );
};
```

### 2. **Configure Field Behavior**

```typescript
const fieldConfigs: FieldConfig<FormValues>[] = [
  {
    name: 'defaultTempConsume',
    type: 'temperature',
    validation: { required: true, min: -40, max: 40 },
    localization: { locale: 'es-ES', formatOnDisplay: true },
    dependencies: {
      affects: [{
        targetField: 'defaultTempFreeze',
        effect: 'constrainMax',
        calculate: (temp) => temp - 2
      }]
    }
  },
  {
    name: 'defaultTempFreeze',
    type: 'temperature',
    validation: { required: true, min: -40, max: 38 },
    localization: { locale: 'es-ES', formatOnDisplay: true }
  }
];
```

### 3. **Use Enhanced Components**

```typescript
// OLD (315 lines with manual everything):
<InputTemperatureOld
  min={-50}
  max={50}
  step={0.5}
  language="es-ES"
  onChange={handleChange}
  onBlur={handleBlur}
  validation={validateTemperature}
  // ... 20+ more props
/>

// NEW (FormMiddleware handles everything):
<InputTemperature name="defaultTempConsume" />
```

## 🧩 Components

### **InputTemperature**

- **Purpose**: Temperature input with Spanish localization and debounced typing
- **Features**: Arrow buttons (left side), right-aligned text, 1000ms debouncing
- **Structure**: Uses `TextField.Root` with slots pattern like `InputTime`
- **Constraints**: Dynamic min/max based on other temperature fields

```typescript
interface InputTemperatureProps {
  name: string;           // Field name for middleware lookup
  placeholder?: string;   // Optional placeholder text
  disabled?: boolean;     // Optional disabled state
}
```

### **InputTime**

- **Purpose**: Time input in mm:ss format
- **Features**: Arrow buttons (left side), format validation, step controls
- **Structure**: `TextField.Root` with left slot for controls
- **Format**: Accepts various inputs ("5" → "00:05", "130" → "01:30")

### **TimesRepeaterTable**

- **Purpose**: Progressive table with temperature + time inputs
- **Features**: Auto-enable next row, consistent styling, unified middleware integration
- **Pattern**: Uses wildcard field names (`timeRows.*.temperature`)

## ⚙️ Configuration

### **Field Config Structure**

```typescript
interface FieldConfig<T> {
  name: FieldPath<T>;
  type: 'temperature' | 'time' | 'text' | 'select';

  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };

  localization?: {
    locale?: string;
    formatOnDisplay?: boolean;
    parseOnInput?: boolean;
  };

  dependencies?: {
    dependsOn?: FieldPath<T>[];
    affects?: Array<{
      targetField: FieldPath<T>;
      effect: 'constrainMin' | 'constrainMax' | 'enable' | 'disable';
      calculate?: (sourceValue: any) => any;
      condition?: (sourceValue: any) => boolean;
    }>;
  };

  progressive?: {
    enableWhen?: FieldPath<T>[];
    completionCheck?: (values: Partial<T>) => boolean;
  };
}
```

### **Constants Categories**

```typescript
// 1. DEBOUNCE & TIMING
export const INPUT_DEBOUNCE_DELAY = 1000;
export const STEP_ANIMATION_DURATION = 150;

// 2. TEMPERATURE
export const DEFAULT_TEMP_MIN = -50;
export const DEFAULT_TEMP_MAX = 50;
export const TEMP_STEP = 0.5;

// 3. TIME
export const DEFAULT_TIME_MIN = 0;
export const DEFAULT_TIME_MAX = 3600;
export const TIME_STEP = 30;

// 4. LOCALIZATION
export const DEFAULT_LOCALE = 'es-ES';
export const DECIMAL_SEPARATOR = ',';

// 5. VALIDATION
export const MIN_TEMP_DIFFERENCE = 2;
export const VALIDATION_DEBOUNCE = 300;

// 6. UI COMPONENTS
export const STEP_BUTTON_SIZE = '1';
export const STEP_BUTTON_VARIANT = 'soft';

// 7. NOTIFICATIONS
export const SUCCESS_DURATION = 3000;
export const ERROR_DURATION = 5000;

// 8. DEVELOPMENT
export const DEV_FORM_DEBUG = true;
export const DEV_RANDOM_SEED = 42;
```

## 🔮 Advanced Features

### **Wildcard Field Names**

```typescript
// Supports patterns like "timeRows.*.temperature"
// Automatically applies constraints to all matching fields
const constraints = middleware.getFieldConstraints('timeRows.0.temperature');
const constraints2 = middleware.getFieldConstraints('timeRows.1.temperature');
// Both inherit the same constraint rules
```

### **Cross-Field Validation**

```typescript
const fieldConfigs = [
  {
    name: 'startTime',
    dependencies: {
      affects: [{
        targetField: 'endTime',
        effect: 'constrainMin',
        calculate: (startTime) => startTime + 300 // 5 minutes minimum gap
      }]
    }
  }
];
```

### **Conditional Field Enabling**

```typescript
const progressiveConfigs = [
  {
    fieldPattern: 'timeRows.*.temperature',
    enableWhen: (index, formValues) => {
      if (index === 0) return true; // First row always enabled
      const prevRow = formValues.timeRows?.[index - 1];
      return prevRow?.temperature && prevRow?.time_a; // Previous row complete
    }
  }
];
```

### **Development Tools Integration**

```typescript
// Built-in dev tools support
const middleware = useFormMiddleware();

// Random value generation for testing
middleware.setRandomValues(['defaultTempConsume', 'defaultTempFreeze']);

// Bulk validation
const isFormValid = middleware.validateAllFields();

// Field state inspection
const fieldState = middleware.getFieldState('defaultTempConsume');
console.log(fieldState); // { isValid, isDirty, isTouched, errors }
```

## 📦 Migration Guide

### **From Legacy InputTemperature**

**Before (335 lines):**

```typescript
const OrdersForm = () => {
  const [tempConsume, setTempConsume] = useState(20);
  const [tempFreeze, setTempFreeze] = useState(18);
  const [tempConsumeErrors, setTempConsumeErrors] = useState([]);

  const validateTempConsume = useCallback((temp) => {
    // 50 lines of validation logic
  }, [tempFreeze]);

  const handleTempConsumeChange = useCallback((e) => {
    // 30 lines of parsing, validation, formatting
    // Manual constraint updates
    setTempFreezeMax(temp - 2);
  }, []);

  return (
    <form>
      <InputTemperatureLegacy
        value={tempConsume}
        onChange={handleTempConsumeChange}
        validation={validateTempConsume}
        min={-40}
        max={40}
        language="es-ES"
        // ... 15+ more props
      />
      {/* Repeat for tempFreeze with different logic */}
    </form>
  );
};
```

**After (50 lines):**

```typescript
const OrdersForm = () => {
  const methods = useForm<OrdersFormValues>();

  return (
    <FormProvider {...methods}>
      <FormMiddlewareProvider
        formMethods={methods}
        fieldConfigs={ordersFormFieldConfigs}
      >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <InputTemperature name="defaultTempConsume" />
          <InputTemperature name="defaultTempFreeze" />
        </form>
      </FormMiddlewareProvider>
    </FormProvider>
  );
};
```

### **Migration Steps**

1. **Define field configs** with your existing validation rules
2. **Wrap your form** with FormMiddlewareProvider
3. **Replace legacy inputs** with middleware-enabled components
4. **Remove manual validation** and constraint logic
5. **Delete unused validation functions** and state management

## ✅ Best Practices

### **1. Field Configuration**

```typescript
// ✅ DO: Use descriptive field configs
const fieldConfigs = [
  {
    name: 'defaultTempConsume',
    type: 'temperature',
    validation: { required: true, min: -40, max: 40 },
    dependencies: { affects: [{ targetField: 'defaultTempFreeze', effect: 'constrainMax' }] }
  }
];

// ❌ DON'T: Put validation logic in components
const InputTemperatureBad = ({ name }) => {
  const [errors, setErrors] = useState([]);
  const validateInComponent = () => { /* manual validation */ };
};
```

### **2. Component Design**

```typescript
// ✅ DO: Keep components focused on UI
const InputTemperature = ({ name }) => {
  const middleware = useFormMiddleware();
  const constraints = middleware.getFieldConstraints(name);
  return <TextField.Root>{/* pure UI */}</TextField.Root>;
};

// ❌ DON'T: Mix business logic with UI
const InputTemperatureBad = ({ name, validation, constraints, formatting }) => {
  // 200 lines of mixed UI + business logic
};
```

### **3. Constants Usage**

```typescript
// ✅ DO: Use centralized constants
import { INPUT_DEBOUNCE_DELAY, TEMP_STEP } from '../FormMiddleware/FormMiddleware.constants';

// ❌ DON'T: Use magic numbers
setTimeout(() => { /* ... */ }, 1000); // What is 1000?
const newValue = value + 0.5; // What is 0.5?
```

### **4. Type Safety**

```typescript
// ✅ DO: Use typed field configs
const fieldConfigs: FieldConfig<OrdersFormValues>[] = [
  { name: 'defaultTempConsume', type: 'temperature' } // TypeScript ensures name exists
];

// ❌ DON'T: Use string literals
const fieldConfigs = [
  { name: 'defaultTempConsme', type: 'temperature' } // Typo not caught
];
```

## 🎯 Summary

The FormMiddleware system transforms complex, scattered form logic into a clean, declarative, and maintainable architecture. By centralizing field dependencies, validation, localization, and constraints, we've:

- **Reduced code complexity** by 85% in OrdersForm
- **Eliminated duplication** across temperature inputs
- **Solved typing interruption issues** with smart debouncing
- **Unified styling** across main form and table inputs
- **Enabled easy extension** to other forms in the application

The system is production-ready and successfully handles the complex temperature input requirements while maintaining excellent developer experience and type safety.

For questions or issues, refer to the implementation in:
- `apps/client/src/forms/FormMiddleware/`
- `apps/client/src/forms/InputTemperature/`
- `apps/client/src/pages/AdminPages/AdminOrdersPage/forms/OrdersForm/`
