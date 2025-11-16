# 🎨 Icon System

📅 Sep 28, 2025

Modern, organized icon system with automatic type generation and consistent styling.

## 📁 Structure

```
styles/icons/
├── index.ts          # Main exports
├── icons.ts          # Icon definitions and map
├── icons.utils.ts    # Helper utilities
├── icons.css         # Icon styling
└── README.md         # This file
```

## 🚀 Usage

### Basic Icon Usage

```tsx
import { HomeIcon, EditIcon, DeleteIcon } from 'styles/icons';

// Direct usage
<HomeIcon />
<EditIcon className="text-blue-500" />
<DeleteIcon size={24} />
```

### Dynamic Icon Usage

```tsx
import { getIconByName, ICON_MAP, type IconName } from 'styles/icons';

// Get icon by name
const iconName: IconName = 'HomeIcon';
const IconComponent = getIconByName(iconName);
<IconComponent />

// Render icon from string
function DynamicIcon({ name }: { name: IconName }) {
  const Icon = ICON_MAP[name];
  return <Icon />;
}
```

### Button Integration

```tsx
import { Button } from 'components/Button';
import { SaveIcon, type IconType } from 'styles/icons';

// With specific icon
<Button icon={<SaveIcon />}>Save</Button>

// With icon type
const icon: IconType = SaveIcon;
<Button icon={<icon />}>Save</Button>
```

## 🔧 Types

### Available Types

- `IconName` - Union of all available icon names
- `IconType` - Type of icon components
- `ICON_MAP` - Map of icon names to components

### Type Safety

```tsx
// ✅ Type-safe icon names
const validIcon: IconName = 'HomeIcon';

// ❌ TypeScript error
const invalidIcon: IconName = 'NonExistentIcon';
```

## ➕ Adding New Icons

1. **Import the icon** in `icons.ts`:

```tsx
import { NewIcon as _NewIcon } from 'lucide-react';
```

2. **Create wrapped export**:

```tsx
export const NewIcon = createIconWrapper(_NewIcon);
```

3. **Add to ICON_MAP**:

```tsx
export const ICON_MAP = {
  // ... existing icons
  NewIcon,
} as const;
```

That's it! Types are automatically generated. ✨

## 🎨 Styling

All icons automatically get the `.icon` class and inherit styling from `icons.css`:

- Consistent sizing (1.25rem default)
- Smooth transitions
- Color inheritance (`currentColor`)
- Size variants (`.icon-sm`, `.icon-md`, `.icon-lg`, `.icon-xl`)
- Interactive states for buttons

## 🔍 Available Icons

Current icon count: **${Object.keys(ICON_MAP).length}** icons

### Categories

- **Core UI**: Close, Menu, Dropdown, etc.
- **Navigation**: Home, Back, Forward, etc.
- **Actions**: Edit, Delete, Add, Save, etc.
- **Status**: Success, Warning, Error, Info, etc.
- **Theme**: Sun, Moon, etc.
- **Admin**: User, Lock, Shield, etc.

## 🚀 Benefits

- ✅ **Zero maintenance** - Types auto-generated
- ✅ **Consistent styling** - All icons use same CSS
- ✅ **Type safety** - Full TypeScript support
- ✅ **Tree shaking** - Only import what you use
- ✅ **Dynamic usage** - Runtime icon selection
- ✅ **Easy migration** - Drop-in replacement for react-icons
