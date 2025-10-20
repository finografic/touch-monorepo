# Admin Orders Page - Tab & URL Sync Behavior

## Overview

The AdminOrdersPage manages two tabs with dynamic labels based on the URL state:
- **Tab 1**: "Listado de registros" (always "List")
- **Tab 2**: "Editar registro" (Edit) OR "Nuevo registro" (New) - **DYNAMIC**

## URL Structure (Hash for New, Param for Edit)

```
/admin/orders                    → List tab active, Tab 2 = "Nuevo registro"
/admin/orders#new                → New tab active, Tab 2 = "Nuevo registro"
/admin/orders/{orderId}          → Edit tab active, Tab 2 = "Editar registro"
```

**Why use hash for "new"?**
- ✅ Avoids backend CUID validation errors ("new" is not a valid CUID)
- ✅ No need to modify API route guards
- ✅ Clean separation: real IDs in path, "new" mode in hash

## Behavior Flows

### 1. **Navigate to Edit Mode**

```
User clicks "Edit" on an order
→ Navigate to: /admin/orders/{orderId}
→ No hash present, so default to #edit
→ Result: /admin/orders/{orderId}#edit
→ Tab 2 label: "Editar registro"
→ Active tab: "edit"
```

### 2. **Click "List" Tab from Edit Mode** ✅ **FIXED**

```
Current: /admin/orders/{orderId}#edit
User clicks "Listado de registros" tab
→ handleTabChange('list') called
→ Detects isEditMode = true
→ Navigates to: /admin/orders#list
→ orderId removed from URL
→ isEditMode becomes false
→ Tab 2 label changes: "Editar registro" → "Nuevo registro"
→ Active tab: "list"
```

### 3. **Click "New" Tab from Edit Mode** ✅ **FIXED**

```
Current: /admin/orders/{orderId}#edit
User clicks "Nuevo registro" tab (if visible)
→ handleTabChange('new') called
→ Detects isEditMode = true
→ Navigates to: /admin/orders#new
→ orderId removed from URL
→ isEditMode becomes false
→ Tab 2 label stays: "Nuevo registro"
→ Active tab: "new"
```

### 4. **Switch Between List and New (No Edit)**

```
Current: /admin/orders#list
User clicks "Nuevo registro" tab
→ handleTabChange('new') called
→ isEditMode = false
→ Only updates hash: /admin/orders#new
→ No page reload
→ Active tab: "new"
```

### 5. **Browser Back/Forward**

```
User presses back button
→ hashchange event fires
→ handleHashChange() updates activeTab
→ Tab UI updates to match hash
```

## Implementation Details

### Key Functions

#### `handleTabChange(tab: string)`

```typescript
const handleTabChange = useCallback((tab: string) => {
  setActiveTab(tab);

  // If switching away from edit mode, clear orderId from URL
  if (tab === 'list' && isEditMode) {
    navigate('/admin/orders#list');  // Full navigation to clear orderId
  } else if (tab === 'new' && isEditMode) {
    navigate('/admin/orders#new');   // Full navigation to clear orderId
  } else {
    // Just update hash without navigation (faster)
    window.history.replaceState(null, '', `#${tab}`);
  }
}, [isEditMode, navigate]);
```

#### Initial Tab Setup

```typescript
useEffect(() => {
  if (isEditMode && !window.location.hash) {
    // In edit mode without hash → default to 'edit'
    window.history.replaceState(null, '', '#edit');
    setActiveTab('edit');
  } else if (!window.location.hash) {
    // No edit mode, no hash → use current activeTab
    window.history.replaceState(null, '', `#${activeTab}`);
  }
}, [isEditMode, activeTab]);
```

## Tab Configuration

```typescript
const config = {
  tabs: [
    {
      id: 'list',
      label: 'Listado de registros',  // Static
      icon: <ListChecksIcon />,
      content: <TabList />,
    },
    isEditMode ? {
      id: 'edit',
      label: 'Editar registro',       // Dynamic (Edit mode)
      icon: <EditIcon />,
      content: <TabForm />,
    } : {
      id: 'new',
      label: 'Nuevo registro',        // Dynamic (Create mode)
      icon: <AddIcon />,
      content: <TabForm />,
    },
  ],
};
```

## State Flow Diagram

```
┌─────────────────────────────────────────────┐
│  URL: /admin/orders                         │
│  isEditMode: false                          │
│  Tab 2: "Nuevo registro"                    │
└─────────────────────────────────────────────┘
                    │
                    │ User clicks edit on order
                    ↓
┌─────────────────────────────────────────────┐
│  URL: /admin/orders/{orderId}#edit          │
│  isEditMode: true                           │
│  Tab 2: "Editar registro" ← DYNAMIC CHANGE │
└─────────────────────────────────────────────┘
                    │
                    │ User clicks "Listado" tab
                    ↓
┌─────────────────────────────────────────────┐
│  URL: /admin/orders#list                    │
│  isEditMode: false                          │
│  Tab 2: "Nuevo registro" ← DYNAMIC CHANGE  │
└─────────────────────────────────────────────┘
```

## Testing Checklist

- ✅ Navigate to `/admin/orders` → Tab 2 shows "Nuevo registro"
- ✅ Navigate to `/admin/orders/{orderId}` → Tab 2 shows "Editar registro"
- ✅ In edit mode, click "Listado" → URL changes to `/admin/orders#list`, Tab 2 becomes "Nuevo registro"
- ✅ In edit mode, click "Nuevo" (if visible) → URL changes to `/admin/orders#new`, Tab 2 stays "Nuevo registro"
- ✅ Browser back/forward buttons work correctly
- ✅ Direct URL access works (e.g., `/admin/orders/{orderId}#edit`)
- ✅ Hash updates without full page reload when possible

## Benefits

1. **URL as source of truth** - Refresh page maintains state
2. **Browser history works** - Back/forward buttons function correctly
3. **Dynamic tab labels** - UI updates based on URL params
4. **Shareable URLs** - Copy/paste URL maintains exact state
5. **No unnecessary reloads** - Only navigate when orderId needs to change

