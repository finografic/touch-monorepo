# Responsive Collapsing Navigation

📅 Oct 15, 2025

A smart navigation component that automatically collapses overflow items into a "More" dropdown menu, with mobile hamburger support.

## Features

### 🖥️ **Desktop Mode**

- Shows all nav items that fit in available width
- Automatically moves overflow items to "More ⬇️" dropdown
- Recalculates dynamically on window resize
- No horizontal scrolling or wrapping

### 📱 **Mobile Mode**

- Shows hamburger menu (🍔) below configurable breakpoint
- All items accessible via dropdown
- Configurable breakpoint: `sm`, `md`, `lg`, or `xl`

### ✨ **Smart Features**

- ResizeObserver for responsive recalculation
- Active item highlighting (both in nav and dropdowns)
- Smooth transitions during navigation
- Disabled state during page transitions
- Maintains all existing navigation behavior

---

## Usage

### Basic Usage

Replace your existing `<AdminNavigation />` with:

```tsx
import { AdminNavigationV2 } from 'admin/components/AdminNavigation';

// In your layout component:
<AdminNavigationV2 />
```

### With Custom Mobile Breakpoint

```tsx
// Show hamburger on tablets and below (< 992px)
<AdminNavigationV2 mobileBreakpoint="lg" />

// Show hamburger only on small phones (< 576px)
<AdminNavigationV2 mobileBreakpoint="sm" />
```

---

## Breakpoints

| Breakpoint | Width     | Description                |
|-----------|-----------|----------------------------|
| `sm`      | < 576px   | Extra small devices        |
| `md`      | < 768px   | Small devices (default)    |
| `lg`      | < 992px   | Medium devices             |
| `xl`      | < 1200px  | Large devices              |

---

## How It Works

### Desktop Behavior

1. **Measure Container Width**
   Uses `ResizeObserver` to detect container size changes

2. **Calculate Visible Items**
   Measures each nav item width and determines which fit

3. **Show "More" Dropdown**
   If items overflow, shows "More ⬇️" button with dropdown

4. **Dynamic Recalculation**
   Automatically adjusts when window resizes

### Mobile Behavior

1. **Detect Breakpoint**
   Checks if window width is below configured breakpoint

2. **Show Hamburger**
   Renders hamburger icon (🍔) instead of individual items

3. **All Items in Dropdown**
   Dropdown contains all navigation items

---

## Example: Integration

### Before (Old Navigation)

```tsx
// apps/client/src/admin/AdminLayout.tsx
import { AdminNavigation } from 'admin/components/AdminNavigation';

export const AdminLayout = () => (
  <div>
    <AdminNavigation />
    {/* ... rest of layout */}
  </div>
);
```

### After (New Responsive Navigation)

```tsx
// apps/client/src/admin/AdminLayout.tsx
import { AdminNavigationV2 } from 'admin/components/AdminNavigation';

export const AdminLayout = () => (
  <div>
    <AdminNavigationV2 mobileBreakpoint="md" />
    {/* ... rest of layout */}
  </div>
);
```

---

## Architecture

### Files Created

1. **`useResponsiveNav.tsx`**
   Hook that manages responsive behavior
   - Calculates visible/overflow items
   - Detects mobile vs desktop
   - Handles resize events

2. **`AdminNavigationV2.tsx`**
   Main navigation component
   - Renders visible items
   - Renders "More" dropdown for overflow
   - Renders hamburger for mobile

3. **`AdminNavigation.styles.ts`** (updated)
   Added dropdown styles and button alignment

---

## API Reference

### `<AdminNavigationV2>`

```tsx
interface AdminNavigationV2Props {
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl';
}
```

**Props:**
- `mobileBreakpoint` (optional): When to switch to hamburger menu
  - Default: `'md'` (< 768px)

---

## Benefits

✅ **Better UX** - No more hidden or scrolling nav items
✅ **Responsive** - Works on all screen sizes
✅ **Smart** - Automatically adjusts to content
✅ **Accessible** - Keyboard navigation supported
✅ **Familiar** - Common UX pattern (like browser tabs)
✅ **Flexible** - Configurable mobile breakpoint

---

## Migration Guide

### Step 1: Update Import

```diff
- import { AdminNavigation } from 'admin/components/AdminNavigation';
+ import { AdminNavigationV2 } from 'admin/components/AdminNavigation';
```

### Step 2: Replace Component

```diff
- <AdminNavigation />
+ <AdminNavigationV2 mobileBreakpoint="md" />
```

### Step 3: Test

1. ✅ Desktop: Resize window to see items collapse into "More"
2. ✅ Mobile: Check hamburger appears below breakpoint
3. ✅ Navigation: Verify all routes still work
4. ✅ Active states: Check active item highlighting

---

## Troubleshooting

### Items not collapsing properly?

**Issue:** All items visible even when they don't fit
**Solution:** Check that the parent container has a constrained width

### "More" button always showing?

**Issue:** Overflow items detected incorrectly
**Solution:** Ensure nav items render before calculation (check for conditional rendering)

### Mobile breakpoint not working?

**Issue:** Hamburger not appearing at expected width
**Solution:** Verify breakpoint prop is one of: `sm`, `md`, `lg`, `xl`

---

## Future Enhancements

- [ ] Persist "More" dropdown state across navigation
- [ ] Add keyboard shortcuts for dropdown
- [ ] Animate items moving between visible/overflow
- [ ] Support custom "More" button text/icon
- [ ] Add priority system (keep certain items always visible)

