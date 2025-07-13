# @finografic/zustand-context-creator

A lightweight, type-safe utility for creating Zustand stores with React Context integration. Create quick, dead-simple stores with minimal boilerplate while maintaining full type safety and excellent developer experience.

Inspired by patterns from Matt Pocock's TypeScript work, this utility abstracts and enhances the integration between Zustand and React Context, providing a clean, maintainable pattern for state management in React applications.

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

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) for details.

## License

MIT © [finografic](https://github.com/finografic)
