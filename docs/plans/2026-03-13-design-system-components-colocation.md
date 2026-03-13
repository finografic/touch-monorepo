# Design System Components Co-location Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor `packages/design-system/src/components` (and related recipes) into per-component co-located folders without changing any component or recipe logic.

**Architecture:** Each UI primitive (`button`, `dialog`, `menu`, `popover`, `tabs`, `toast`, `tooltip`, `spinner`) will live in its own kebab-case folder with `component-name.tsx`, `component-name.recipe.ts` (re-export shim to the existing recipe), `component-name.types.ts` (recipe props +/or existing props), and `index.ts` as the barrel. The existing `src/recipes` files remain the source of truth but are re-exported from component folders to avoid logic changes.

**Tech Stack:** TypeScript, React, Ark UI, Panda recipes, tsdown build for `@workspace/design-system`.

---

### Task 1: Button component co-location

**Files:**
- Create: `packages/design-system/src/components/button/index.ts`
- Create: `packages/design-system/src/components/button/button.types.ts`
- Create: `packages/design-system/src/components/button/button.recipe.ts`
- Create: `packages/design-system/src/components/button/button.tsx` (copy of existing `button.tsx`)
- Delete: `packages/design-system/src/components/button.tsx`

**Steps:**
1. Copy the contents of `packages/design-system/src/components/button.tsx` into a new file `packages/design-system/src/components/button/button.tsx`.
2. Create `button.recipe.ts` in the same folder that re-exports `buttonRecipe` from `../../recipes/button.recipe`.
3. Create `button.types.ts` that imports `RecipeProps` from `../../types/recipes.types`, imports `buttonRecipe` from `./button.recipe`, and exports `ButtonRecipeProps = RecipeProps<typeof buttonRecipe>`.
4. Create `index.ts` that re-exports everything from `./button` and `./button.types`.
5. Remove the original `packages/design-system/src/components/button.tsx`.
6. Run typecheck for the design-system package to ensure no errors.

### Task 2: Dialog component co-location and types

**Files:**
- Update: `packages/design-system/src/components/dialog/index.ts` (normalize to barrel pattern)
- Create: `packages/design-system/src/components/dialog/dialog.recipe.ts`
- Create: `packages/design-system/src/components/dialog/dialog.types.ts`
- Update: `packages/design-system/src/components/index.ts` dialog export path to `./dialog`
- Leave: `packages/design-system/src/components/dialog/dialog.tsx` implementation unchanged

**Steps:**
1. Add `dialog.recipe.ts` that re-exports `dialogRecipe` from `../../recipes/dialog.recipe`.
2. Create `dialog.types.ts` that imports `RecipeProps` from `../../types/recipes.types`, imports `dialogRecipe` from `./dialog.recipe`, and exports `DialogRecipeProps = RecipeProps<typeof dialogRecipe>`.
3. Replace `dialog/index.ts` with a barrel that `export * from './dialog'` and `export * from './dialog.types'`.
4. In `components/index.ts`, change dialog exports to use `from './dialog'` instead of `from './dialog/dialog'` while keeping the same named exports and `Dialog` re-export.
5. Run typecheck for the design-system package to ensure no errors.

### Task 3: Menu component co-location

**Files:**
- Create: `packages/design-system/src/components/menu/index.ts`
- Create: `packages/design-system/src/components/menu/menu.types.ts`
- Create: `packages/design-system/src/components/menu/menu.recipe.ts`
- Create: `packages/design-system/src/components/menu/menu.tsx` (copy of existing `menu.tsx`)
- Delete: `packages/design-system/src/components/menu.tsx`

**Steps:**
1. Copy the contents of `components/menu.tsx` into `components/menu/menu.tsx`.
2. Create `menu.recipe.ts` re-exporting `menuRecipe` from `../../recipes/menu.recipe`.
3. Create `menu.types.ts` defining `MenuRecipeProps = RecipeProps<typeof menuRecipe>`.
4. Create `index.ts` that re-exports everything from `./menu` and `./menu.types`.
5. Remove the original flat `menu.tsx` file.
6. Run typecheck for the design-system package.

### Task 4: Popover component co-location

**Files:**
- Create: `packages/design-system/src/components/popover/index.ts`
- Create: `packages/design-system/src/components/popover/popover.types.ts`
- Create: `packages/design-system/src/components/popover/popover.recipe.ts`
- Create: `packages/design-system/src/components/popover/popover.tsx` (copy of existing `popover.tsx`)
- Delete: `packages/design-system/src/components/popover.tsx`

**Steps:**
1. Copy `popover.tsx` into `popover/popover.tsx`.
2. Create `popover.recipe.ts` re-exporting `popoverRecipe` from `../../recipes/popover.recipe`.
3. Create `popover.types.ts` defining `PopoverRecipeProps = RecipeProps<typeof popoverRecipe>`.
4. Create `index.ts` barrel exporting from `./popover` and `./popover.types`.
5. Remove the original flat `popover.tsx` file.
6. Run typecheck for the design-system package.

### Task 5: Tabs component co-location

**Files:**
- Create: `packages/design-system/src/components/tabs/index.ts`
- Create: `packages/design-system/src/components/tabs/tabs.types.ts`
- Create: `packages/design-system/src/components/tabs/tabs.recipe.ts`
- Create: `packages/design-system/src/components/tabs/tabs.tsx` (copy of existing `tabs.tsx`)
- Delete: `packages/design-system/src/components/tabs.tsx`

**Steps:**
1. Copy `tabs.tsx` into `tabs/tabs.tsx`.
2. Create `tabs.recipe.ts` re-exporting `tabsRecipe` from `../../recipes/tabs.recipe`.
3. Create `tabs.types.ts` defining `TabsRecipeProps = RecipeProps<typeof tabsRecipe>`.
4. Create `index.ts` barrel exporting from `./tabs` and `./tabs.types`.
5. Remove the original flat `tabs.tsx` file.
6. Run typecheck for the design-system package.

### Task 6: Toast component co-location

**Files:**
- Create: `packages/design-system/src/components/toast/index.ts`
- Create: `packages/design-system/src/components/toast/toast.types.ts`
- Create: `packages/design-system/src/components/toast/toast.recipe.ts`
- Create: `packages/design-system/src/components/toast/toast.tsx` (copy of existing `toast.tsx`)
- Delete: `packages/design-system/src/components/toast.tsx`

**Steps:**
1. Copy `toast.tsx` into `toast/toast.tsx`.
2. Create `toast.recipe.ts` re-exporting `toastRecipe` from `../../recipes/toast.recipe`.
3. Create `toast.types.ts` defining `ToastRecipeProps = RecipeProps<typeof toastRecipe>`.
4. Create `index.ts` barrel exporting from `./toast` and `./toast.types`.
5. Remove the original flat `toast.tsx` file.
6. Run typecheck for the design-system package.

### Task 7: Tooltip component co-location

**Files:**
- Create: `packages/design-system/src/components/tooltip/index.ts`
- Create: `packages/design-system/src/components/tooltip/tooltip.types.ts`
- Create: `packages/design-system/src/components/tooltip/tooltip.recipe.ts`
- Create: `packages/design-system/src/components/tooltip/tooltip.tsx` (copy of existing `tooltip.tsx`)
- Delete: `packages/design-system/src/components/tooltip.tsx`

**Steps:**
1. Copy `tooltip.tsx` into `tooltip/tooltip.tsx`.
2. Create `tooltip.recipe.ts` re-exporting `tooltipRecipe` from `../../recipes/tooltip.recipe`.
3. Create `tooltip.types.ts` defining `TooltipRecipeProps = RecipeProps<typeof tooltipRecipe>`.
4. Create `index.ts` barrel exporting from `./tooltip` and `./tooltip.types`.
5. Remove the original flat `tooltip.tsx` file.
6. Run typecheck for the design-system package.

### Task 8: Spinner component co-location

**Files:**
- Create: `packages/design-system/src/components/spinner/index.ts`
- Create: `packages/design-system/src/components/spinner/spinner.types.ts`
- Create: `packages/design-system/src/components/spinner/spinner.tsx` (copy of existing `spinner.tsx`)
- Delete: `packages/design-system/src/components/spinner.tsx`

**Steps:**
1. Copy `spinner.tsx` into `spinner/spinner.tsx`.
2. Create `spinner.types.ts` that re-exports `SpinnerProps` from `./spinner` (no recipe-based type, since spinner has no recipe file).
3. Create `index.ts` barrel exporting from `./spinner` and `./spinner.types`.
4. Remove the original flat `spinner.tsx` file.
5. Run typecheck for the design-system package.

### Task 9: Normalize root components barrel

**Files:**
- Update: `packages/design-system/src/components/index.ts`

**Steps:**
1. Ensure button, spinner, menu, popover, tabs, toast, and tooltip exports continue to use `from './<name>'` so they now resolve to the new folder `index.ts` barrels.
2. Update dialog exports to use `from './dialog'` (folder barrel) instead of `from './dialog/dialog'`.
3. Confirm that no exports reference the old flat component paths.
4. Run typecheck for the design-system package.

