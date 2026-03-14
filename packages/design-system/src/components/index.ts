// ── Primitive components ─────────────────────────────────────────────────────
export type { SpinnerProps } from './spinner';
export { Spinner } from './spinner';

// ── Styled wrappers (recipe-ready) ───────────────────────────────────────────
export type { ButtonProps } from './button';
export { Button } from './button';

// Data table — TanStack Table + tableRecipe
export type {
  DataTableClassNames,
  DataTableColumn,
  DataTableProps,
  DataTableTableClassNames,
} from './data-table';
export { DataTable } from './data-table';

// ── Ark UI primitives (re-exported for consistent imports) ───────────────────
// Use these when you need full composition control.
// Apply recipe classNames per slot: e.g. checkboxRecipe({ size: 'md' })
export { Dialog } from './dialog';
export type { DialogContentPropsDS, DialogRootPropsDS, DialogSize } from './dialog/dialog.types';
export type { MenuOpenChangeDetails, MenuSelectionDetails } from './menu';
export { Menu } from './menu';
export type { PopoverOpenChangeDetails } from './popover';
export { Popover } from './popover';
export type { TabsFocusChangeDetails, TabsValueChangeDetails } from './tabs';
export { Tabs } from './tabs';
export { createToaster, Toast, Toaster } from './toast';
export type { TooltipOpenChangeDetails } from './tooltip';
export { Tooltip } from './tooltip';
