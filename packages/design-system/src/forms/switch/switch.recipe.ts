/**
 * Switch Recipe
 *
 * Variants: size (sm | md | lg)
 *
 * Apply to Switch.Control. Target Switch.Thumb with `.switch-thumb` class.
 */
import { cva } from '@styled-system/css';

export const switchRecipe = cva({
  base: {
    'display': 'inline-flex',
    'alignItems': 'center',
    'position': 'relative',
    'borderRadius': 'full',
    'cursor': 'pointer',
    'transitionProperty': 'background-color',
    'transitionDuration': 'normal',
    'bg': 'bg.emphasized',
    '_checked': { bg: 'accent.solid' },
    '_disabled': { opacity: 0.55, cursor: 'not-allowed' },
    '_focusVisible': { outline: '2px solid', outlineColor: 'accent.focusRing', outlineOffset: '2px' },

    '& .switch-thumb': {
      display: 'block',
      borderRadius: 'full',
      bg: 'white',
      transitionProperty: 'transform',
      transitionDuration: 'normal',
      boxShadow: 'sm',
    },
  },

  variants: {
    size: {
      sm: {
        'width': '7',
        'height': '4',
        '& .switch-thumb': { width: '3', height: '3', _checked: { transform: 'translateX(0.75rem)' } },
      },
      md: {
        'width': '9',
        'height': '5',
        '& .switch-thumb': { width: '4', height: '4', _checked: { transform: 'translateX(1rem)' } },
      },
      lg: {
        'width': '12',
        'height': '7',
        '& .switch-thumb': { width: '5', height: '5', _checked: { transform: 'translateX(1.25rem)' } },
      },
    },
  },

  defaultVariants: { size: 'md' },
});
