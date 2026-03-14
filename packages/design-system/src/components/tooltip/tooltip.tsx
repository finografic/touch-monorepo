/**
 * Tooltip Component
 *
 * Styled wrapper around Ark UI Tooltip using `createSlotRecipeContext`.
 * Ark handles all a11y: tooltip role, aria-describedby,
 * hover/focus show/hide, configurable open/close delay.
 *
 * Recipe variant props are accepted directly on `Tooltip.Root` —
 * no manual recipe call or className threading needed.
 *
 * Usage:
 * ```tsx
 * import { Tooltip } from '@workspace/design-system/components';
 *
 * <Tooltip.Root openDelay={300} closeDelay={100}>
 *   <Tooltip.Trigger asChild>
 *     <button aria-label="Help"><InfoIcon /></button>
 *   </Tooltip.Trigger>
 *   <Tooltip.Positioner>
 *     <Tooltip.Content>
 *       <Tooltip.Arrow><Tooltip.ArrowTip /></Tooltip.Arrow>
 *       Helpful hint text
 *     </Tooltip.Content>
 *   </Tooltip.Positioner>
 * </Tooltip.Root>
 * ```
 */
import { Tooltip as ArkTooltip } from '@ark-ui/react';
import { createSlotRecipeContext } from 'internals/create-slot-recipe-context';

import { tooltipRecipe } from './tooltip.recipe';

const { withProvider, withContext } = createSlotRecipeContext(tooltipRecipe);

export const Tooltip = {
  // Root has no recipe slot — used only to provide recipe context to children.
  Root: withProvider(ArkTooltip.Root),
  RootProvider: withProvider(ArkTooltip.RootProvider),
  Trigger: withContext(ArkTooltip.Trigger, 'trigger'),
  Positioner: withContext(ArkTooltip.Positioner, 'positioner'),
  Content: withContext(ArkTooltip.Content, 'content'),
  Arrow: withContext(ArkTooltip.Arrow, 'arrow'),
  ArrowTip: withContext(ArkTooltip.ArrowTip, 'arrowTip'),
  Context: ArkTooltip.Context, // render prop
};

export type { TooltipOpenChangeDetails } from '@ark-ui/react';
