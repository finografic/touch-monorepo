# Generic Dialog System

📅 Jun 20, 2025

A configuration-driven dialog system built on top of Radix UI with automatic tab management.

## Features

- **Configuration-driven**: Define dialogs using simple config objects
- **Auto tab detection**: Shows tabs only when multiple content sections exist
- **Accessibility**: Built on Radix UI primitives with proper ARIA support
- **Theming**: Supports Radix UI theme customization
- **Flexible footer**: Configurable primary/secondary buttons
- **Size constraints**: Custom maxWidth and maxHeight options
- **Proper scrolling**: Vertical scrollbars when content overflows, footer stays fixed

## Components

### GenericDialog

The core component that accepts a `DialogConfig` and renders the appropriate UI.

### LanguageDialog

A specific implementation for language selection (single content, no tabs).

### AdminToolsDialog

A multi-tab dialog for admin tools with dynamic tab generation based on available data.

## Usage

```tsx
import { GenericDialog, type DialogConfig } from 'components/Dialog';

const config: DialogConfig = {
  title: 'My Dialog',
  size: '3',
  maxWidth: '800px',    // Optional: constrain width
  maxHeight: '80vh',    // Optional: constrain height
  minWidth: '400px',    // Optional: minimum width
  minHeight: '300px',   // Optional: minimum height
  theme: {
    appearance: 'dark',
    accentColor: 'blue',
  },
  tabs: [
    {
      id: 'content',
      label: 'Content',
      content: <MyComponent />,
    },
  ],
  footer: {
    primaryButton: {
      label: 'OK',
      onClick: handleClose,
    },
  },
};

<GenericDialog isOpen={isOpen} onClose={onClose} config={config} />
```

## Layout Structure

The dialog uses a **header → content → footer** flexbox layout:

- **Header**: Fixed at top, contains title and close button
- **Content**: Flexible height, scrollable when content overflows
- **Footer**: Fixed at bottom, always visible regardless of content height

## Auto Tab Behavior

- **Single tab**: Tabs UI is hidden, content renders directly
- **Multiple tabs**: Full tab interface with navigation
- **Accessibility**: Proper tab navigation and screen reader support

## Scrolling Behavior

- Content areas automatically show vertical scrollbars when content exceeds available height
- Footer remains fixed at bottom during scrolling
- Custom scrollbar styling for better visual integration
- Horizontal scrolling is prevented to maintain layout integrity

## Configuration Options

### Core Options

- `title`: Dialog title
- `size`: Radix UI dialog size ('1' | '2' | '3' | '4')
- `maxWidth`: Custom width constraint (e.g., '800px', '50vw', '90%')
- `maxHeight`: Custom height constraint (e.g., '600px', '80vh', '90%')
- `minWidth`: Custom minimum width constraint (e.g., '400px')
- `minHeight`: Custom minimum height constraint (e.g., '300px')
- `tabs`: Array of tab configurations

### Theme Options (Radix UI)

- `appearance`: 'light' | 'dark'
- `grayColor`: Radix UI gray color palette
- `accentColor`: Radix UI accent color palette
- `scaling`: UI scaling percentage

### Footer Options

- `primaryButton`: Main action button configuration
- `secondaryButton`: Secondary action button configuration
- Both support Radix UI `variant` and `color` options

## Examples

### Simple Dialog

```tsx
const simpleConfig: DialogConfig = {
  title: 'Confirm Action',
  maxWidth: '400px',
  tabs: [{ id: 'confirm', label: 'Confirm', content: <ConfirmMessage /> }],
  footer: {
    primaryButton: { label: 'Confirm', onClick: handleConfirm },
    secondaryButton: { label: 'Cancel', onClick: handleCancel },
  },
};
```

### Large Data Dialog

```tsx
const dataConfig: DialogConfig = {
  title: 'Data Viewer',
  size: '4',
  maxWidth: '90vw',
  maxHeight: '85vh',
  tabs: [
    { id: 'table', label: 'Table View', content: <DataTable /> },
    { id: 'json', label: 'JSON View', content: <DataDumper /> },
  ],
  footer: {
    primaryButton: { label: 'Export', onClick: handleExport },
  },
};
```
