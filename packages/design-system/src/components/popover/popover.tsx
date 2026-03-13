/**
 * Popover Component
 *
 * Typed wrapper around Ark UI Popover.
 * Ark handles all a11y: dialog role, optional focus trap,
 * aria-expanded, aria-controls, Escape to close,
 * click-outside to dismiss.
 *
 * Styling comes from `popoverRecipe` applied per slot via `className`.
 *
 * Usage:
 * ```tsx
 * import { Popover } from '@workspace/design-system/components';
 * // cls from consuming app: popoverRecipe()
 *
 * <Popover.Root>
 *   <Popover.Trigger asChild>
 *     <button>Open popover</button>
 *   </Popover.Trigger>
 *   <Popover.Positioner className={cls.positioner}>
 *     <Popover.Content className={cls.content}>
 *       <Popover.Arrow className={cls.arrow}>
 *         <Popover.ArrowTip className={cls.arrowTip} />
 *       </Popover.Arrow>
 *       <Popover.Title className={cls.title}>Title</Popover.Title>
 *       <Popover.Description className={cls.description}>
 *         Some descriptive content.
 *       </Popover.Description>
 *       <Popover.CloseTrigger className={cls.closeTrigger} asChild>
 *         <button aria-label="Close"><XIcon /></button>
 *       </Popover.CloseTrigger>
 *     </Popover.Content>
 *   </Popover.Positioner>
 * </Popover.Root>
 * ```
 */
import { Popover as ArkPopover } from '@ark-ui/react';

// Re-export all Ark Popover parts
export const Popover = ArkPopover;
export type { PopoverOpenChangeDetails } from '@ark-ui/react';

