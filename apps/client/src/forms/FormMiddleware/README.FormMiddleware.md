# Form Middleware System

## Overview

The Form Middleware system is a centralized approach to handling complex form logic, validation, field dependencies, and localization. It extends React Hook Form with additional capabilities while keeping individual components clean and focused on UI.

## Key Benefits

### 1. **Centralized Logic**

- All field validation rules in one place
- Cross-field dependencies handled declaratively
- Localization logic centralized
- Progressive form behavior (like table row enabling) abstracted away

### 2. **Cleaner Components**

- Input components focus only on UI and user interaction
- No more complex validation logic mixed with UI code
- No manual handling of field dependencies
- Consistent behavior across all fields

### 3. **Declarative Configuration**

- Field behavior defined through configuration objects
- Easy to understand and modify field relationships
- Reusable across different forms

### 4. **Enhanced Developer Experience**

- Type-safe field configurations
- Centralized error handling
- Built-in localization support
- Progressive validation patterns

## Architecture

```
FormMiddlewareProvider
├── Field Configurations (validation, dependencies, localization)
├── Progressive Configurations (table/repeater logic)
└── Enhanced Context (extends useFormContext with additional methods)
```

## Current Form vs. Middleware Approach

### Current OrdersForm Issues

- 335 lines with mixed concerns
- Field dependencies handled manually in form component
- Validation logic scattered across components
- Localization logic duplicated in each input
- Temperature constraint logic hardcoded in form

### With Middleware

- Form component becomes ~50 lines of pure UI
- All logic moved to declarative configurations
- Input components become focused and reusable
- Consistent behavior across all fields
- Easy to test and maintain

## Example Usage

### 1. Configure Fields

```typescript
const fieldConfigs: FieldConfig<OrdersFormValues>[] = [
  {
    name: 'defaultTempConsume',
    type: 'temperature',
    validation: { required: true, min: -40, max: 40 },
    localization: { locale: 'es-ES', formatOnDisplay: true },
    dependencies: {
      affects: [{
        targetField: 'defaultTempFreeze',
        effect: 'constrainMax',
        calculate: (temp) => temp - MIN_TEMP_DIFFERENCE
      }]
    }
  }
];
```

### 2. Wrap Form

```typescript
<FormProvider {...methods}>
  <FormMiddlewareProvider
    formMethods={methods}
    fieldConfigs={fieldConfigs}
    progressiveConfigs={progressiveConfigs}
  >
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <InputTemperature name="defaultTempConsume" />
      <InputTemperature name="defaultTempFreeze" />
    </form>
  </FormMiddlewareProvider>
</FormProvider>
```

### 3. Clean Components

```typescript
const InputTemperature = ({ name }) => {
  const middleware = useFormMiddleware();

  // Middleware handles all the complex logic:
  const constraints = middleware.getFieldConstraints(name);
  const isEnabled = middleware.isFieldEnabled(name);
  const formattedValue = middleware.formatValue(name, value);

  return <input /* clean, focused UI */ />;
};
```

## Features Centralized

### Field Dependencies

- Automatic constraint updates (temp freeze max based on consume temp)
- Cross-field validation triggers
- Enable/disable logic based on other fields

### Localization

- Spanish comma formatting for temperature inputs
- Time formatting (mm:ss) - kept local for reusability
- Automatic parsing on input

### Progressive Forms

- Table row enabling logic (complete previous row to enable next)
- Validation-based progression
- Editable completed rows

### Validation

- Immediate error display with specific messages
- Dynamic constraint checking
- Field state management (touched, dirty, valid)

### Bulk Operations

- Random value generation for development
- Form-wide validation
- Field state queries

## Architectural Decision Framework

When deciding what logic to centralize vs. keep local, we use this framework:

### Centralize to Middleware When

✅ **Cross-field dependencies** exist (temp freeze depends on temp consume)
✅ **Form-specific business rules** apply (validation, constraints)
✅ **Complex state management** needed (debouncing, typing interruption)
✅ **Internationalization** complexity (Spanish comma/dot conversion)
✅ **Progressive behavior** required (enable next row when current complete)

### Keep Local When

✅ **Domain-specific logic** that's reusable (mm:ss ↔ seconds conversion)
✅ **UI/UX formatting** behavior (input parsing, display formatting)
✅ **Component-specific** interaction (keyboard shortcuts, focus handling)
✅ **Simple, self-contained** operations (format validation)
✅ **High reusability** across different contexts (charts, timers, standalone forms)

### Create Hybrid When

✅ **Component needs to work** both with and without middleware
✅ **Local logic exists** but form integration is beneficial
✅ **Maximum flexibility** required for different use cases

### Real-World Examples

```typescript
// Temperature: Complex cross-cutting concerns → Full Middleware
// - Spanish i18n, debouncing, cross-field constraints
<InputTemperature name="defaultTempConsume" />

// Time: Simple domain logic + form integration → Hybrid
// - Local mm:ss conversion, middleware for form state
<InputTime name="time_a" />          // Middleware mode
<InputTime value={seconds} onChange={handler} />  // Standalone mode

// Text: Simple input → Minimal middleware
// - Just form state, validation stays in form schema
<InputText name="drinkName" />
```

## Migration Path

1. **Phase 1**: Create middleware infrastructure (types, provider, hooks)
2. **Phase 2**: Configure existing OrdersForm fields
3. **Phase 3**: Migrate input components to use middleware
4. **Phase 4**: Remove complex logic from form components
5. **Phase 5**: Extend to other forms in the application

## Component Architecture Decisions

### InputTemperature: Full Middleware Integration

**Complex Cross-Cutting Concerns → Centralized**

```typescript
// MOVED TO MIDDLEWARE:
// - Spanish localization (comma/dot conversion)
// - 1000ms debouncing (typing interruption prevention)
// - Cross-field constraints (freeze temp max = consume temp - 2°C)
// - Dynamic validation with i18n messages

// KEPT LOCAL: UI interaction only
<TextField.Root>
  <TextField.Slot side="left">Step buttons</TextField.Slot>
  <TextField.Slot side="right">C° unit</TextField.Slot>
</TextField.Root>
```

### InputTime: Hybrid Approach

**Domain Logic Local + Form Logic Middleware**

```typescript
// KEPT LOCAL (Reusable Domain Logic):
const formatTime = (seconds) => "mm:ss"; // Time-specific conversion
const parseTime = (timeString) => seconds; // Format parsing
// Input formatting: "5" → "00:05", "130" → "01:30"

// MOVED TO MIDDLEWARE (Form Integration):
middleware.watch(name); // Form state
middleware.getFieldConstraints(name); // Dynamic constraints
middleware.isFieldEnabled(name); // Progressive enabling

// HYBRID (Context-Aware):
const notifyChange = (seconds) => {
  if (isMiddlewareMode) middleware.setFieldValue(name, seconds);
  else if (onTimeChange) onTimeChange(seconds);
};
```

**Why Different Approaches?**

| Complexity Type | InputTemperature | InputTime |
|-----------------|------------------|-----------|
| **Cross-field dependencies** | ✅ High (freeze max from consume) | ❌ Low (independent) |
| **Internationalization** | ✅ Complex (Spanish comma/dot) | ❌ None (universal mm:ss) |
| **Typing behavior** | ✅ Complex (debounce interruption) | ❌ Simple (immediate) |
| **Reusability need** | ❌ Form-specific constraints | ✅ High (charts, timers, etc.) |
| **Domain logic** | ❌ Simple (number) | ✅ Rich (time formatting) |

## Impact on Code Quality

### Before (Current InputTemperature)

- 233 lines with mixed concerns
- Manual RHF integration
- Complex validation logic
- Localization handled per-component

### After (With Middleware)

- ~80 lines focused on UI
- Declarative field behavior
- No manual validation logic
- Centralized localization

### Form Component

- **Before**: 335 lines with complex field dependencies
- **After**: ~50 lines of pure UI composition

### Hybrid Components (InputTime)

- **Dual Mode**: Works with or without FormMiddleware
- **Local Domain Logic**: mm:ss conversion stays in component
- **Middleware Integration**: Form state and constraints when available
- **Maximum Reusability**: Can be used in charts, timers, standalone forms

This approach transforms scattered, complex form logic into a clean, declarative, and maintainable system while preserving reusability where it matters most.
