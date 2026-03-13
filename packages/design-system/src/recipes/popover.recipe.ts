/**
 * Popover Recipe (Slot Recipe)
 *
 * Styling for Ark UI's Popover compound component.
 * Ark handles all a11y: dialog role, focus trap (optional),
 * aria-expanded, aria-controls, Escape to close.
 *
 * Slots:
 *   trigger      — button that opens the popover
 *   positioner   — floating positioner (Ark-managed)
 *   content      — the popover panel
 *   title        — optional heading inside the panel
 *   description  — optional body text
 *   closeTrigger — × dismiss button
 *   arrow        — the arrow container (Ark-managed)
 *   arrowTip     — the visible arrow triangle
 *
 * Usage:
 * ```tsx
 * import { Popover } from '@workspace/design-system/components';
 * // cls from consuming app: popoverRecipe()
 *
 * <Popover.Root>
 *   <Popover.Trigger className={cls.trigger} asChild>
 *     <button>More info</button>
 *   </Popover.Trigger>
 *   <Popover.Positioner className={cls.positioner}>
 *     <Popover.Content className={cls.content}>
 *       <Popover.Arrow className={cls.arrow}>
 *         <Popover.ArrowTip className={cls.arrowTip} />
 *       </Popover.Arrow>
 *       <Popover.Title className={cls.title}>Settings</Popover.Title>
 *       <Popover.Description className={cls.description}>
 *         Adjust your preferences below.
 *       </Popover.Description>
 *       <Popover.CloseTrigger className={cls.closeTrigger} asChild>
 *         <button aria-label="Close"><XIcon /></button>
 *       </Popover.CloseTrigger>
 *     </Popover.Content>
 *   </Popover.Positioner>
 * </Popover.Root>
 * ```
 */
import type { RecipeProps } from 'src/types/recipes.types';

import { sva } from '../../styled-system/css';

export const popoverRecipe = sva({
  slots: ['trigger', 'positioner', 'content', 'title', 'description', 'closeTrigger', 'arrow', 'arrowTip'],

  base: {
    trigger: {},

    positioner: {
      zIndex: 'popover',
    },

    content: {
      position: 'relative',
      bg: 'bg.panel',
      borderWidth: 'light',
      borderStyle: 'solid',
      borderColor: 'border',
      borderRadius: 'lg',
      boxShadow: 'lg',
      padding: '4',
      maxW: '20rem',
      width: 'max-content',
      _open: { animation: 'scale-in 120ms ease' },
      _closed: { animation: 'scale-out 120ms ease' },
    },

    title: {
      fontSize: 'sm',
      fontWeight: 'semibold',
      color: 'fg',
      paddingRight: '6',
      marginBottom: '1',
    },

    description: {
      fontSize: 'sm',
      color: 'fg.muted',
      lineHeight: 'normal',
    },

    closeTrigger: {
      position: 'absolute',
      top: '3',
      right: '3',
      cursor: 'pointer',
      color: 'fg.muted',
      borderRadius: 'sm',
      _hover: {
        color: 'fg',
        bg: 'bg.subtle',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'accent.focusRing',
        outlineOffset: '2px',
      },
    },

    arrow: {},

    arrowTip: {
      bg: 'bg.panel',
      borderTopWidth: '1px',
      borderLeftWidth: '1px',
      borderColor: 'border',
    },
  },
});

export type PopoverRecipeProps = RecipeProps<typeof popoverRecipe>;
