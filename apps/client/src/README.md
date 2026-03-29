# @finografic/zustand-context-creator

A lightweight, type-safe utility for creating Zustand stores with React Context integration. Create quick, dead-simple stores with minimal boilerplate while maintaining full type safety and excellent developer experience.

Inspired by patterns from Matt Pocock's TypeScript work, this utility abstracts and enhances the integration between Zustand and React Context, providing a clean, maintainable pattern for state management in React applications.

> **⚠️ Zustand v5 Compatibility Notice**: This utility has been updated to work with Zustand v5. See the [Zustand v5 Migration](#zustand-v5-migration) section for important changes and best practices.

## Features

- 🚀 **Quick Setup** - Create fully typed stores with minimal boilerplate
- 🔒 **Type Safe** - Full TypeScript support with excellent type inference
- 🎯 **Simple Pattern** - Clean structure for each store
- 🔄 **Auto-generated Setters** - Automatic creation of typed setters based on your store's schema
- 🛠 **Extensible** - Easy addition of custom setters and complex logic
- 📝 **Great DX** - Full IntelliSense support for types and autocompletion
- 🔍 **DevTools Ready** - Works seamlessly with Redux DevTools via Zustand middleware
- 💾 **Persistence** - Optional local storage persistence with granular control

## Installation

```bash
npm install @finografic/zustand-context-creator
# or
yarn add @finografic/zustand-context-creator
# or
pnpm add @finografic/zustand-context-creator
```

## Quick Start

### 1. Define Your Store Types

```typescript
// AppConfigContext.types.ts
import type { CreateSettersType } from '@finografic/zustand-context-creator';

export enum AppConfigKeys {
  theme = 'theme',
  language = 'language',
}

export type AppConfigValues = {
  [AppConfigKeys.theme]: 'light' | 'dark';
  [AppConfigKeys.language]: string;
};

const SETTER_PREFIX = 'AppConfig';
type AppConfigSetters = CreateSettersType<AppConfigValues, typeof SETTER_PREFIX>;

export type AppConfigStore = AppConfigValues & {
  actions: AppConfigSetters & {
    toggleTheme: () => void;
  };
};
```

### 2. Create Your Store Context

```typescript
// AppConfigContext.ts
import { createStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { useStore, type StoreApi } from 'zustand';

import { createSetters, createZustandContext } from '@finografic/zustand-context-creator';
import type { AppConfigStore, AppConfigValues } from './AppConfigContext.types';

export const SETTER_PREFIX = 'AppConfig';

export const defaultValue: AppConfigValues = {
  theme: 'light',
  language: 'en',
};

export const AppConfigContext = createZustandContext(({ initialValue }) => {
  return createStore<AppConfigStore>()(
    subscribeWithSelector(
      (set, _get): AppConfigStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          toggleTheme: () => {
            set((state) => ({
              theme: state.theme === 'light' ? 'dark' : 'light',
            }));
          },
        },
      }),
    ),
  );
});

type AppConfigReturn = Omit<AppConfigStore, 'actions'> & AppConfigStore['actions'];

export const useAppConfig = (): AppConfigReturn => {
  const store = AppConfigContext.useContext();
  if (!store) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }

  return useStore<StoreApi<AppConfigStore>, AppConfigReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
```

### 3. Use in Your App

```typescript
// App.tsx
import { AppConfigContext } from './providers/AppConfigProvider/AppConfigContext';

function App() {
  return (
    <AppConfigContext.Provider>
      <YourComponents />
    </AppConfigContext.Provider>
  );
}
```

### 4. Use in Components

```typescript
// MyComponent.tsx
import { useAppConfig } from './providers/AppConfigProvider/AppConfigContext';

export const MyComponent = () => {
  const { theme, language, setTheme, toggleTheme } = useAppConfig();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Current language: {language}</p>
      <button onClick={() => setTheme('dark')}>Set Dark Theme</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```

## Auto-generated Setter Types

You can auto-generate setter types for your store values using the `CreateSettersType` utility. This ensures your context types always match the setters created by `createSetters`.

### Usage

#### Without Prefix

```typescript
import type { CreateSettersType } from '@finografic/zustand-context-creator';

type TodoSetters = CreateSettersType<TodoValues>;
// Generates: setItems, setFilter
```

#### With Prefix

```typescript
import type { CreateSettersType } from '@finografic/zustand-context-creator';

const SETTER_PREFIX = 'Ui';
type UiSetters = CreateSettersType<TodoValues, typeof SETTER_PREFIX>;
// Generates: setUiItems, setUiFilter
```

You can use this utility in your context types for full type safety and maintainability.

## Advanced Usage

### Custom Setters

```typescript
export const TodoContext = createZustandContext(({ initialValue }) => {
  return createStore<TodoStore>()(
    subscribeWithSelector(
      (set, _get): TodoStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          // Custom complex setter
          bulkUpdateTodos: (updates: Partial<TodoItem>[]) => {
            set((state) => ({
              items: state.items.map((item) => {
                const update = updates.find((u) => u.id === item.id);
                return update ? { ...item, ...update } : item;
              }),
            }));
          },
        },
      }),
    ),
  );
});
```

### Using CreateSettersType in Context Types

```typescript
import type { CreateSettersType } from '@finografic/zustand-context-creator';

export interface TodoValues {
  items: TodoItem[];
  filter: 'all' | 'active' | 'completed';
}

const SETTER_PREFIX = '';
type TodoSetters = CreateSettersType<TodoValues, typeof SETTER_PREFIX>;

export type TodoActions = TodoSetters & {
  addTodo: (todo: TodoItem) => void;
  // ...other actions
};
```

## Zustand v5 Migration

This utility has been updated to work with Zustand v5. Here are the key changes and migration notes:

### Breaking Changes in v5

1. **Object Destructuring in Selectors**: Zustand v5 is more strict about object equality, which can cause infinite re-renders when using object destructuring in selectors.

2. **Store Subscriptions**: Direct `store.subscribe()` calls in React hooks cause infinite loops in v5.

### Required Changes

#### 1. Use `useShallow` for Object Selectors

**Before (v4 - causes infinite loops in v5):**

```typescript
return useStore(store, ({ actions, ...state }) => ({
  ...state,
  ...actions,
}));
```

**After (v5 compatible):**

```typescript
import { useShallow } from 'zustand/react/shallow';

return useStore(
  store,
  useShallow(({ actions, ...state }) => ({
    ...state,
    ...actions,
  })),
);
```

#### 2. Move Subscriptions to useEffect

**Before (v4 - causes infinite loops in v5):**

```typescript
export const useMyStore = () => {
  const store = MyContext.useContext();

  store.subscribe((state) => {
    // subscription logic
  });

  return useStore(store, selector);
};
```

**After (v5 compatible):**

```typescript
import { useEffect } from 'react';

export const useMyStore = () => {
  const store = MyContext.useContext();

  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      // subscription logic
    });
    return unsubscribe;
  }, [store]);

  return useStore(store, selector);
};
```

### Best Practices for v5

1. **Always use `useShallow`** when returning objects from selectors
2. **Move all subscriptions** to `useEffect` hooks with proper cleanup
3. **Avoid object destructuring** in selectors unless wrapped with `useShallow`
4. **Test thoroughly** after upgrading to ensure no infinite loops occur

### Error Debugging

If you see errors like:

```
Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate.
```

This usually means:
1. You need to add `useShallow` to a selector that returns an object
2. You have a `store.subscribe()` call outside of `useEffect`
3. You're creating new objects in selectors without proper memoization

## API Reference

### `createZustandContext`

Creates a Zustand store with React Context integration.

```typescript
function createZustandContext<TInitial extends object, TStore extends StoreApi<any>>(
  getStore: (props: { initialValue?: Partial<TInitial> }) => TStore
): {
  Context: React.Context<TStore | null>;
  Provider: React.ComponentType<{
    children?: React.ReactNode;
    initialValue?: Partial<TInitial>;
  }>;
  useContext: () => TStore | null;
}
```

### `createSetters`

Creates typed setter functions for Zustand store properties.

```typescript
function createSetters<
  TStore extends { [K in keyof TValues]: TValues[K] },
  TValues extends Record<string, any>,
  TPrefix extends string = '',
>({
  set,
  prefix,
  defaultValue,
}: {
  defaultValue: TValues;
  set: SetState<TStore>;
  prefix?: TPrefix;
}): CreateSettersType<TValues, TPrefix>
```

### `CreateSettersType`

Utility type that generates setter function types based on a values object type.

```typescript
type CreateSettersType<
  TValues extends Record<string, any>,
  TPrefix extends string = ''
> = {
  [K in keyof TValues as `set${TPrefix}${Capitalize<string & K>}`]: (val: TValues[K]) => void;
}
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) for details.

## License

MIT © [finografic](https://github.com/finografic)
