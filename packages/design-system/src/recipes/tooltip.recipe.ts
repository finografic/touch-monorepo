/**
 * Tooltip Recipe (Slot Recipe)
 *
 * Styling for Ark UI's Tooltip compound component.
 * Ark handles all a11y: tooltip role, aria-describedby,
 * hover/focus show/hide, delay timers.
 *
 * Slots:
 *   trigger    — the element that activates the tooltip (no visual style)
 *   positioner — floating positioner (Ark-managed)
 *   content    — the tooltip bubble
 *   arrow      — the arrow container (Ark-managed)
 *   arrowTip   — the visible arrow triangle
 *
 * Usage:
 * ```tsx
 * import { Tooltip } from '@workspace/design-system/components';
 * // cls from consuming app: tooltipRecipe()
 *
 * <Tooltip.Root openDelay={300} closeDelay={100}>
 *   <Tooltip.Trigger asChild>
 *     <button aria-label="More info"><InfoIcon /></button>
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
import type { RecipeProps } from 'src/types/recipes.types';
import { sva } from '../../styled-system/css';

export const tooltipRecipe = sva({
  slots: ['trigger', 'positioner', 'content', 'arrow', 'arrowTip'],

  base: {
    trigger: {},

    positioner: {
      zIndex: 'tooltip',
    },

    content: {
      bg: 'bg.inverted',
      color: 'fg.inverted',
      fontSize: 'xs',
      fontWeight: 'medium',
      px: '2.5',
      py: '1.5',
      borderRadius: 'md',
      maxW: '16rem',
      lineHeight: 'tight',

      _open: {
        animation: 'fade-in 120ms ease',
      },

      _closed: {
        animation: 'fade-out 120ms ease',
      },
    },

    arrow: {},

    arrowTip: {
      bg: 'bg.inverted',
    },
  },
});

export type TooltipRecipeProps = RecipeProps<typeof tooltipRecipe>;
