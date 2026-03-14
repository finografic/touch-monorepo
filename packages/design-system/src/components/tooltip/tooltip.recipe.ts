/**
 * Tooltip Slot Recipe
 *
 * Slots:    trigger | positioner | content | arrow | arrowTip
 */
import { sva } from '@styled-system/css';

export const tooltipRecipe = sva({
  className: 'tooltip',
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
      _open: { animation: 'fade-in 120ms ease' },
      _closed: { animation: 'fade-out 120ms ease' },
    },

    arrow: {},

    arrowTip: {
      bg: 'bg.inverted',
    },
  },
});
