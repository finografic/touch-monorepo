/**
 * Button Recipe
 *
 * Panda CSS cva() recipe for buttons — mapped from existing button.constants.ts
 * and enhanced with Ark UI blog patterns.
 *
 * Usage with Ark UI:
 * ```tsx
 * import { ark } from '@ark-ui/react';
 * import { buttonRecipe } from '@workspace/design-system/recipes';
 *
 * <ark.button className={buttonRecipe({ size: 'md', variant: 'solid' })}>
 *   Click me
 * </ark.button>
 * ```
 */
import { defineRecipe } from '@pandacss/dev';

export const buttonRecipe = defineRecipe({
  className: 'button',
  description: 'Interactive button with size and variant options',

  base: {
    display: 'inline-flex',
    appearance: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
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
    size: {
      sm: {
        height: '9',
        minWidth: '9',
        fontSize: 'sm',
        paddingInline: '3',
        gap: '2',
        '& svg': { width: '4', height: '4' },
      },
      md: {
        height: '10',
        minWidth: '10',
        fontSize: 'sm',
        paddingInline: '4',
        gap: '2',
        '& svg': { width: '5', height: '5' },
      },
      lg: {
        height: '12',
        minWidth: '12',
        fontSize: 'md',
        paddingInline: '5',
        gap: '3',
        '& svg': { width: '5', height: '5' },
      },
    },

    variant: {
      solid: {
        bg: 'accent.solid',
        color: 'fg.inverted',
        borderColor: 'transparent',
        _hover: {
          bg: 'accent.emphasized',
        },
        _active: {
          bg: 'accent.fg',
        },
      },
      subtle: {
        bg: 'bg.subtle',
        color: 'fg.muted',
        borderColor: 'transparent',
        _hover: {
          bg: 'bg.emphasized',
        },
        _active: {
          bg: 'bg.muted',
        },
      },
      outline: {
        borderColor: 'border',
        color: 'fg.muted',
        bg: 'transparent',
        _hover: {
          bg: 'bg.subtle',
          borderColor: 'border.emphasized',
        },
        _active: {
          bg: 'bg.muted',
        },
      },
      ghost: {
        color: 'fg.muted',
        bg: 'transparent',
        borderColor: 'transparent',
        _hover: {
          bg: 'bg.subtle',
        },
        _active: {
          bg: 'bg.muted',
        },
      },
    },

    colorScheme: {
      primary: {},
      success: {},
      warning: {},
      danger: {},
      info: {},
      neutral: {},
    },
  },

  compoundVariants: [
    // Solid + color scheme overrides
    {
      variant: 'solid',
      colorScheme: 'success',
      css: { bg: 'success', _hover: { bg: 'success.dark' } },
    },
    {
      variant: 'solid',
      colorScheme: 'danger',
      css: { bg: 'danger', _hover: { bg: 'danger.dark' } },
    },
    {
      variant: 'solid',
      colorScheme: 'warning',
      css: { bg: 'warning', color: 'fg', _hover: { bg: 'warning.dark' } },
    },
    {
      variant: 'solid',
      colorScheme: 'info',
      css: { bg: 'info', _hover: { bg: 'info.dark' } },
    },
    // Outline + color scheme overrides
    {
      variant: 'outline',
      colorScheme: 'success',
      css: { borderColor: 'border.success', color: 'fg.success' },
    },
    {
      variant: 'outline',
      colorScheme: 'danger',
      css: { borderColor: 'border.danger', color: 'fg.danger' },
    },
    {
      variant: 'outline',
      colorScheme: 'warning',
      css: { borderColor: 'border.warning', color: 'fg.warning' },
    },
  ],

  defaultVariants: {
    size: 'md',
    variant: 'outline',
  },
});
