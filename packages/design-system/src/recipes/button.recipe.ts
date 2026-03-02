/**
 * Button Recipe
 *
 * Panda CSS defineRecipe() for buttons.
 *
 * All CSS is generated STATICALLY at build time (panda codegen).
 * At runtime, buttonRecipe({ variant, colorScheme, size }) returns only
 * a string of pre-existing class names — no CSS is created or injected.
 *
 * Architecture: colorPalette
 * ─────────────────────────────────────────────────────────────────────
 * The `colorScheme` variant sets `colorPalette` to the matching token
 * group (e.g. 'primary'). The `variant` styles then reference
 * `colorPalette.*` shade names, which Panda resolves to the correct
 * palette at codegen time — so the variant styles are written once and
 * work for all 8 color schemes with no compound variants.
 *
 * The only compound variant needed is warning+solid (amber base is too
 * light for white text — needs dark fg instead).
 *
 * Sizes:  xs · sm · md · lg · xl                   default: md
 * Variants: solid · subtle · outline · ghost · link  default: outline
 * Colors: default · primary · secondary · success · warning · danger · info · grey
 *         default: default
 * Booleans: iconOnly (square, no padding) · (loading / disabled via data attrs)
 *
 * Usage:
 * ```tsx
 * import { ark } from '@ark-ui/react';
 * import { buttonRecipe } from '@workspace/design-system/recipes';
 *
 * <ark.button className={buttonRecipe({ size: 'md', variant: 'solid', colorScheme: 'primary' })}>
 *   Click me
 * </ark.button>
 * ```
 */
import { defineRecipe } from '@pandacss/dev';

export const buttonRecipe = defineRecipe({
  className: 'button',
  description: 'Interactive button — size × variant × colorScheme',

  base: {
    display: 'inline-flex',
    appearance: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    position: 'relative',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    borderWidth: 'default',
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: 'md',
    cursor: 'pointer',
    flexShrink: 0,
    outline: 0,
    lineHeight: '1.2',
    isolation: 'isolate',
    fontWeight: 'semibold',
    transitionProperty: 'background-color, border-color, color, box-shadow, transform',
    transitionDuration: 'normal',
    transitionTimingFunction: 'default',
    _disabled: {
      opacity: 0.55,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
    _loading: {
      cursor: 'wait',
      opacity: 0.7,
      pointerEvents: 'none',
    },
    _focusVisible: {
      outline: '2px solid',
      outlineColor: 'accent.focusRing',
      outlineOffset: '2px',
    },
    '& svg': {
      flexShrink: 0,
    },
  },

  variants: {
    // ── Size ──────────────────────────────────────────────────────────
    size: {
      xs: {
        h: '7',
        minW: '7',
        px: '2',
        gap: '1',
        fontSize: 'xs',
        '& svg': { w: '3', h: '3' },
      },
      sm: {
        h: '8',
        minW: '8',
        px: '3',
        gap: '1.5',
        fontSize: 'sm',
        '& svg': { w: '4', h: '4' },
      },
      md: {
        h: '10',
        minW: '10',
        px: '4',
        gap: '2',
        fontSize: 'sm',
        '& svg': { w: '4', h: '4' },
      },
      lg: {
        h: '11',
        minW: '11',
        px: '5',
        gap: '2',
        fontSize: 'md',
        '& svg': { w: '5', h: '5' },
      },
      xl: {
        h: '12',
        minW: '12',
        px: '6',
        gap: '2.5',
        fontSize: 'md',
        '& svg': { w: '5', h: '5' },
      },
    },

    // ── Variant ───────────────────────────────────────────────────────
    // All color references use `colorPalette.*` — resolved per colorScheme
    // at codegen time. See colorScheme variant below.
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

    // ── Color scheme ──────────────────────────────────────────────────
    // Sets colorPalette to the matching token group. The variant styles
    // above reference colorPalette.* — Panda resolves each combination
    // to the correct palette at codegen, generating static CSS for all
    // 8 × 5 = 40 variant/color combinations automatically.
    colorScheme: {
      default:   { colorPalette: 'neutral' },
      primary:   { colorPalette: 'primary' },
      secondary: { colorPalette: 'secondary' },
      success:   { colorPalette: 'success' },
      warning:   { colorPalette: 'warning' },
      danger:    { colorPalette: 'danger' },
      info:      { colorPalette: 'info' },
      grey:      { colorPalette: 'grey' },
    },

    // ── Icon-only ─────────────────────────────────────────────────────
    // Removes horizontal padding so the button collapses to a square.
    // minW already equals h in every size variant, so the result is
    // exactly h × h with no extra space around the icon.
    iconOnly: {
      true: {
        paddingInline: '0',
      },
    },
  },

  compoundVariants: [
    // warning.base (amber-500) is too light for white text — override to dark fg
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
