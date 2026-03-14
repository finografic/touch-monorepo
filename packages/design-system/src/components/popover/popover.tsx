/**
 * Popover Component
 *
 * Styled wrapper around Ark UI Popover using `createSlotRecipeContext`.
 * Ark handles all a11y: dialog role, optional focus trap,
 * aria-expanded, aria-controls, Escape to close, click-outside to dismiss.
 *
 * Recipe variant props are accepted directly on `Popover.Root` —
 * no manual recipe call or className threading needed.
 *
 * Usage:
 * ```tsx
 * import { Popover } from '@workspace/design-system/components';
 *
 * <Popover.Root>
 *   <Popover.Trigger asChild>
 *     <button>Open popover</button>
 *   </Popover.Trigger>
 *   <Popover.Positioner>
 *     <Popover.Content>
 *       <Popover.Arrow><Popover.ArrowTip /></Popover.Arrow>
 *       <Popover.Title>Title</Popover.Title>
 *       <Popover.Description>Some descriptive content.</Popover.Description>
 *       <Popover.CloseTrigger asChild>
 *         <button aria-label="Close" />
 *       </Popover.CloseTrigger>
 *     </Popover.Content>
 *   </Popover.Positioner>
 * </Popover.Root>
 * ```
 */
import { Popover as ArkPopover } from '@ark-ui/react';
import { createSlotRecipeContext } from 'internals/create-slot-recipe-context';

import { popoverRecipe } from './popover.recipe';

const { withProvider, withContext } = createSlotRecipeContext(popoverRecipe);

export const Popover = {
  // Root has no recipe slot — used only to provide recipe context to children.
  Root: withProvider(ArkPopover.Root),
  RootProvider: withProvider(ArkPopover.RootProvider),
  Trigger: withContext(ArkPopover.Trigger, 'trigger'),
  Anchor: ArkPopover.Anchor, // positioning anchor, no recipe slot
  Positioner: withContext(ArkPopover.Positioner, 'positioner'),
  Content: withContext(ArkPopover.Content, 'content'),
  Title: withContext(ArkPopover.Title, 'title'),
  Description: withContext(ArkPopover.Description, 'description'),
  CloseTrigger: withContext(ArkPopover.CloseTrigger, 'closeTrigger'),
  Arrow: withContext(ArkPopover.Arrow, 'arrow'),
  ArrowTip: withContext(ArkPopover.ArrowTip, 'arrowTip'),
  Context: ArkPopover.Context, // render prop
};

export type { PopoverOpenChangeDetails } from '@ark-ui/react';
