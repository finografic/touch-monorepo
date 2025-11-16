# Dialog Organization Pattern

📅 Jun 20, 2025

This directory contains organized dialog implementations that follow a consistent structure pattern.

## Folder Structure Pattern

### Simple Dialogs (like LanguageDialog)

```
LanguageDialog/
├── index.ts              # Export the dialog component
└── LanguageDialog.tsx    # Main dialog component
```

### Complex Dialogs (like AdminToolsDialog)

```
AdminToolsDialog/
├── AdminToolsDialog.tsx       # Main dialog component
├── AdminToolsDialog.types.ts  # TypeScript interfaces and types
├── AdminToolsDialog.utils.ts  # Utility functions
├── ConfigDataList.tsx         # Additional components (flat)
└── index.ts                   # Export the dialog and types
```

## Creating New Dialogs

### 1. Simple Dialog

For dialogs with minimal complexity:

1. Create folder: `YourDialog/`
2. Create `YourDialog.tsx` with the main component
3. Create `index.ts` to export the component
4. Update main `dialogs/index.ts` to export your dialog

### 2. Complex Dialog

For dialogs with multiple components, utilities, or types:

1. Create folder: `YourDialog/`
2. Create `YourDialog.tsx` with the main component
3. Create `YourDialog.types.ts` for TypeScript interfaces
4. Create `YourDialog.utils.ts` for utility functions
5. Add additional components directly in folder (e.g., `SomeComponent.tsx`)
6. Create `index.ts` to export dialog and types (direct imports, no barrel files)
7. Update main `dialogs/index.ts` to export your dialog

## Benefits of This Pattern

- **Scalability**: Easy to grow from simple to complex
- **Reusability**: Components and utilities can be shared
- **Maintainability**: Clear separation of concerns
- **Consistency**: Same pattern across all dialogs
- **Type Safety**: Centralized type definitions
- **Vite-Friendly**: Avoids barrel files that can cause issues with Vite bundling
- **Direct Imports**: Clear import paths without nested folder/index.ts patterns

## Dialog Configuration

All dialogs use the `GenericDialog` component with a `DialogConfig` object:

```typescript
const config: DialogConfig = {
  title: 'Your Dialog Title',
  size: '3', // '1' | '2' | '3' | '4'
  maxWidth: '600px',
  maxHeight: '80vh',
  theme: {
    appearance: 'dark',
    accentColor: 'blue',
    grayColor: 'sand',
    scaling: '110%',
  },
  tabs: [
    {
      id: 'tab1',
      label: 'Tab Label',
      content: <YourContent />,
    },
  ],
  footer: {
    primaryButton: {
      label: 'OK',
      onClick: onClose,
      variant: 'soft',
      color: 'blue',
    },
  },
};
```
