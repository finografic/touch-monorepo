/**
 * Tooltip Component
 *
 * Typed wrapper around Ark UI Tooltip.
 * Ark handles all a11y: tooltip role, aria-describedby,
 * hover/focus show/hide, configurable open/close delay.
 *
 * Styling comes from `tooltipRecipe` applied per slot via `className`.
 *
 * Usage:
 * ```tsx
 * import { Tooltip } from '@workspace/design-system/components';
 * // cls from consuming app: tooltipRecipe()
 *
 * <Tooltip.Root openDelay={300} closeDelay={100}>
 *   <Tooltip.Trigger asChild>
 *     <button aria-label="Help"><InfoIcon /></button>
 *   </Tooltip.Trigger>
 *   <Tooltip.Positioner className={cls.positioner}>
 *     <Tooltip.Content className={cls.content}>
 *       <Tooltip.Arrow className={cls.arrow}>
 *         <Tooltip.ArrowTip className={cls.arrowTip} />
 *       </Tooltip.Arrow>
 *       Helpful hint text
 *     </Tooltip.Content>
 *   </Tooltip.Positioner>
 * </Tooltip.Root>
 * ```
 */
import { Tooltip as ArkTooltip } from '@ark-ui/react';

// Re-export all Ark Tooltip parts
export const Tooltip = ArkTooltip;
export type { TooltipOpenChangeDetails } from '@ark-ui/react';
