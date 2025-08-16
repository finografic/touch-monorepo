# @finografic/zustand-context-creator

A lightweight, type-safe utility for creating Zustand stores with React Context integration. Create quick, dead-simple stores with minimal boilerplate while maintaining full type safety and excellent developer experience.

Inspired by patterns from Matt Pocock's TypeScript work, this utility abstracts and enhances the integration between Zustand and React Context, providing a clean, maintainable pattern for state management in React applications.

> **⚠️ Zustand v5 Compatibility Notice**: This utility has been updated to work with Zustand v5. See the [Zustand v5 Migration](#zustand-v5-migration) section for important changes and best practices.

## Features

- 🚀 **Quick Setup** - Create fully typed stores with minimal boilerplate
- 🔒 **Type Safe** - Full TypeScript support with excellent type inference
- 🎯 **Simple Pattern** - Clean 3-file structure for each store
- 🔄 **Auto-generated Setters** - Automatic creation of typed setters based on your store's schema
- 🛠 **Extensible** - Easy addition of custom setters and complex logic
- 📝 **Great DX** - Full IntelliSense support for types and autocompletion
- 🔍 **DevTools Ready** - Built-in support for Redux DevTools
- 💾 **Persistence** - Optional local storage persistence with granular control

## Installation

```bash
npm install @finografic/zustand-context-creator
# or
yarn add @finografic/zustand-context-creator
```

## Quick Start

### 1. Define Your Store Types (types.ts)

```typescript
export enum TodoKeys {
  items = 'items',
  filter = 'filter'
}

export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type TodoValues = {
  [TodoKeys.items]: TodoItem[];
  [TodoKeys.filter]: 'all' | 'active' | 'completed';
};
```

### 2. Create Your Store Context (TodoContext.ts)

```typescript
import { createStore } from '@finografic/zustand-context-creator';

export const TodoContext = createStore({
  name: 'Todo',
  state: {
    items: [],
    filter: 'all'
  },
  actions: {
    addTodo: (state, todo: TodoItem) => ({
      items: [...state.items, todo]
    }),
    toggleTodo: (state, id: string) => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    })
  },
  options: {
    persist: true,
    devtools: true
  }
});
```

### 3. Use in Components

```typescript
import { TodoContext } from './TodoContext';

export const TodoList = () => {
  const { items, addTodo, toggleTodo } = TodoContext.use();

  return (
    <div>
      {items.map(item => (
        <TodoItem
          key={item.id}
          item={item}
          onToggle={() => toggleTodo(item.id)}
        />
      ))}
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
export const TodoContext = createStore({
  // ... other config
  actions: {
    // Standard actions
    addTodo: (state, todo: TodoItem) => ({
      items: [...state.items, todo]
    }),
    // Custom complex setter
    bulkUpdateTodos: (state, updates: Partial<TodoItem>[]) => ({
      items: state.items.map(item => {
        const update = updates.find(u => u.id === item.id);
        return update ? { ...item, ...update } : item;
      })
    })
  }
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

### Persistence Configuration

```typescript
export const TodoContext = createStore({
  // ... other config
  options: {
    persist: {
      enabled: true,
      name: 'todo-storage',
      whitelist: ['items'], // only persist items
    }
  }
});
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

#### 3. Remove Unused Subscribe Methods

The `subscribe` method in `createZustandContext` has been removed as it contained anti-patterns that cause issues in v5.

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

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) for details.

## License

MIT © [finografic](https://github.com/finografic)
