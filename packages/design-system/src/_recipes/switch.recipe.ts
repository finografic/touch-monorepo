/**
 * Switch Recipe
 *
 * Styling recipe for Ark UI's Switch component.
 * Ark UI handles all the a11y (role="switch", aria-checked, keyboard).
 *
 * Usage with Ark UI:
 * ```tsx
 * import { Switch } from '@ark-ui/react';
 *
 * <Switch.Root>
 *   <Switch.Control className={switchRecipe()}>
 *     <Switch.Thumb className="switch-thumb" />
 *   </Switch.Control>
 *   <Switch.Label>Enable feature</Switch.Label>
 * </Switch.Root>
 * ```
 */
import { sva } from '../../styled-system/css';

export const switchRecipe = sva({
  className: 'ds-switch',
  // description: 'Toggle switch control styling',

  base: {
    'display': 'inline-flex',
    'alignItems': 'center',
    'position': 'relative',
    'borderRadius': 'full',
    'cursor': 'pointer',
    'transitionProperty': 'background-color',
    'transitionDuration': 'normal',
    'bg': 'bg.emphasized',
    '_checked': {
      bg: 'accent.solid',
    },
    '_disabled': {
      opacity: 0.55,
      cursor: 'not-allowed',
    },
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
        '& .switch-thumb': {
          width: '3',
          height: '3',
          _checked: { transform: 'translateX(0.75rem)' },
        },
      },
      md: {
        'width': '9',
        'height': '5',
        '& .switch-thumb': {
          width: '4',
          height: '4',
          _checked: { transform: 'translateX(1rem)' },
        },
      },
      lg: {
        'width': '12',
        'height': '7',
        '& .switch-thumb': {
          width: '5',
          height: '5',
          _checked: { transform: 'translateX(1.25rem)' },
        },
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});
