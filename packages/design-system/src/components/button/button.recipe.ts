/**
 * Button Recipe
 *
 * Variants: size (xs|sm|md|lg|xl) · variant (solid|subtle|outline|ghost|link)
 *           colorScheme (default|primary|secondary|success|warning|danger|info|grey)
 *           iconOnly (boolean)
 *
 * Architecture: `colorScheme` sets `colorPalette` — all variant styles
 * reference `colorPalette.*` tokens, so they work across all color schemes
 * with no compound variants (except warning+solid which needs dark fg).
 */
import { cva } from '@styled-system/css';

export const buttonRecipe = cva({
  base: {
    'display': 'inline-flex',
    'appearance': 'none',
    'alignItems': 'center',
    'justifyContent': 'center',
    'userSelect': 'none',
    'position': 'relative',
    'whiteSpace': 'nowrap',
    'verticalAlign': 'middle',
    'borderWidth': 'default',
    'borderStyle': 'solid',
    'borderColor': 'transparent',
    'borderRadius': 'md',
    'cursor': 'pointer',
    'flexShrink': 0,
    'outline': 0,
    'lineHeight': '1.2',
    'isolation': 'isolate',
    'fontWeight': 'semibold',
    'transitionProperty': 'background-color, border-color, color, box-shadow, transform',
    'transitionDuration': 'normal',
    'transitionTimingFunction': 'default',

    '_disabled': {
      opacity: 0.55,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },

    '_loading': {
      cursor: 'wait',
      opacity: 0.7,
      pointerEvents: 'none',
    },

    '_focusVisible': {
      outline: '2px solid',
      outlineColor: 'accent.focusRing',
      outlineOffset: '2px',
    },

    '& svg': {
      flexShrink: 0,
    },
  },

  variants: {
    size: {
      xs: {
        'h': '7',
        'minW': '7',
        'px': '2',
        'gap': '1',
        'fontSize': 'xs',
        '& svg': { w: '3', h: '3' },
      },
      sm: {
        'h': '8',
        'minW': '8',
        'px': '3',
        'gap': '1.5',
        'fontSize': 'sm',
        '& svg': { w: '4', h: '4' },
      },
      md: {
        'h': '10',
        'minW': '10',
        'px': '4',
        'gap': '2',
        'fontSize': 'sm',
        '& svg': { w: '4', h: '4' },
      },
      lg: {
        'h': '11',
        'minW': '11',
        'px': '5',
        'gap': '2',
        'fontSize': 'md',
        '& svg': { w: '5', h: '5' },
      },
      xl: {
        'h': '12',
        'minW': '12',
        'px': '6',
        'gap': '2.5',
        'fontSize': 'md',
        '& svg': { w: '5', h: '5' },
      },
    },

    variant: {
      solid: {
        bg: 'colorPalette.base',
        color: 'white',
        borderColor: 'colorPalette.base',
        _hover: {
          bg: 'colorPalette.dark',
          borderColor: 'colorPalette.dark',
        },
        _active: {
          bg: 'colorPalette.darker',
          borderColor: 'colorPalette.darker',
        },
      },

      subtle: {
        bg: 'colorPalette.xlight',
        color: 'colorPalette.darker',
        borderColor: 'colorPalette.lighter',
        _hover: {
          bg: 'colorPalette.lighter',
          color: 'colorPalette.xxdark',
          borderColor: 'colorPalette.dark',
        },
        _active: {
          bg: 'colorPalette.light',
          borderColor: 'colorPalette.darker',
        },
      },

      outline: {
        bg: 'transparent',
        color: 'colorPalette.base',
        borderColor: 'colorPalette.base',
        _hover: {
          bg: 'colorPalette.xlight',
          color: 'colorPalette.dark',
          borderColor: 'colorPalette.dark',
        },
        _active: {
          bg: 'colorPalette.lighter',
        },
      },

      ghost: {
        bg: 'transparent',
        color: 'colorPalette.base',
        borderColor: 'transparent',
        _hover: {
          bg: 'colorPalette.xlight',
          color: 'colorPalette.dark',
        },
        _active: {
          bg: 'colorPalette.lighter',
        },
      },

      link: {
        bg: 'transparent',
        color: 'colorPalette.base',
        borderColor: 'transparent',
        paddingInline: '0',
        height: 'auto',
        minWidth: '0',
        textDecoration: 'underline',
        textUnderlineOffset: '2px',
        _hover: {
          color: 'colorPalette.dark',
          textDecorationThickness: '2px',
        },
        _active: {
          color: 'colorPalette.darker',
        },
      },
    },

    colorScheme: {
      default: { colorPalette: 'neutral' },
      primary: { colorPalette: 'primary' },
      secondary: { colorPalette: 'secondary' },
      success: { colorPalette: 'success' },
      warning: { colorPalette: 'warning' },
      danger: { colorPalette: 'danger' },
      info: { colorPalette: 'info' },
      grey: { colorPalette: 'grey' },
    },

    iconOnly: {
      true: {
        paddingInline: '0',
      },
    },
  },

  compoundVariants: [
    {
      variant: 'solid',
      colorScheme: 'warning',
      css: { color: 'fg' },
    },
  ],

  defaultVariants: {
    size: 'md',
    variant: 'outline',
    colorScheme: 'default',
  },
});
