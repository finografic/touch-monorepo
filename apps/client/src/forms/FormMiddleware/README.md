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
- Time formatting (mm:ss)
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

## Migration Path

1. **Phase 1**: Create middleware infrastructure (types, provider, hooks)
2. **Phase 2**: Configure existing OrdersForm fields
3. **Phase 3**: Migrate input components to use middleware
4. **Phase 4**: Remove complex logic from form components
5. **Phase 5**: Extend to other forms in the application

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

This approach transforms scattered, complex form logic into a clean, declarative, and maintainable system.
