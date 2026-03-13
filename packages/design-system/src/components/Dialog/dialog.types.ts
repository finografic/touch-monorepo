import type { DialogRootProps } from '@ark-ui/react';
import type { Dialog as ArkDialog } from '@ark-ui/react';
import type React from 'react';

import type { RecipeProps } from '../../types/recipes.types';
import type { dialogRecipe } from './dialog.recipe';

export type DialogRecipeProps = RecipeProps<typeof dialogRecipe>;

// ── Size scale ────────────────────────────────────────────────────────────────

export type DialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'cover' | 'full';

// ── Dialog.Root ───────────────────────────────────────────────────────────────

export interface DialogRootPropsDS extends Omit<DialogRootProps, 'onOpenChange'> {
  /** Controlled open state */
  open?: boolean;
  /** Called when the dialog requests open/close */
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface DialogContentPropsDS extends React.ComponentPropsWithoutRef<typeof ArkDialog.Content> {
  /** Controls panel dimensions. @default 'md' */
  size?: DialogSize;
}
