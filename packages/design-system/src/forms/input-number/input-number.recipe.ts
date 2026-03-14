/**
 * InputNumber Recipe
 *
 * Slots:    root · label · control · input · incrementTrigger · decrementTrigger · prefix · suffix
 * Variants: size (sm | md | lg)
 */
import { sva } from '@styled-system/css';

export const inputNumberRecipe = sva({
  className: 'input-number',

  slots: ['root', 'label', 'control', 'input', 'incrementTrigger', 'decrementTrigger', 'prefix', 'suffix'],

  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5',
      width: '100%',
    },

    label: {
      fontWeight: 'semibold',
      color: 'fg.muted',
      userSelect: 'none',
    },

    control: {
      position: 'relative',
      display: 'flex',
      alignItems: 'stretch',
      width: '100%',
      borderWidth: 'default',
      borderStyle: 'solid',
      borderColor: 'border',
      borderRadius: 'md',
      bg: 'bg',
      overflow: 'hidden',
      transitionProperty: 'border-color, box-shadow',
      transitionDuration: 'normal',
      _focusWithin: {
        borderColor: 'accent.solid',
        boxShadow: '0 0 0 1px var(--colors-accent-focus-ring)',
      },
      _invalid: {
        borderColor: 'border.error',
        _focusWithin: { boxShadow: '0 0 0 1px var(--colors-fg-error)' },
      },
      _disabled: { opacity: 0.55, cursor: 'not-allowed' },
    },

    input: {
      flex: '1',
      minWidth: '0',
      border: 'none',
      bg: 'transparent',
      color: 'fg',
      outline: 'none',
      fontVariantNumeric: 'tabular-nums',
      _placeholder: { color: 'fg.subtle' },
      _disabled: { cursor: 'not-allowed' },
    },

    incrementTrigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      borderInlineStartWidth: 'light',
      borderInlineStartStyle: 'solid',
      borderInlineStartColor: 'border',
      color: 'fg.muted',
      cursor: 'pointer',
      _hover: { bg: 'bg.hover', color: 'fg' },
      _active: { bg: 'bg.muted' },
      _disabled: { opacity: 0.55, cursor: 'not-allowed', pointerEvents: 'none' },
    },

    decrementTrigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      borderInlineStartWidth: 'light',
      borderInlineStartStyle: 'solid',
      borderInlineStartColor: 'border',
      color: 'fg.muted',
      cursor: 'pointer',
      _hover: { bg: 'bg.hover', color: 'fg' },
      _active: { bg: 'bg.muted' },
      _disabled: { opacity: 0.55, cursor: 'not-allowed', pointerEvents: 'none' },
    },

    prefix: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      color: 'fg.muted',
      borderInlineEndWidth: 'light',
      borderInlineEndStyle: 'solid',
      borderInlineEndColor: 'border',
      bg: 'bg.muted',
      userSelect: 'none',
    },

    suffix: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      color: 'fg.muted',
      borderInlineStartWidth: 'light',
      borderInlineStartStyle: 'solid',
      borderInlineStartColor: 'border',
      bg: 'bg.muted',
      userSelect: 'none',
    },
  },

  variants: {
    size: {
      sm: {
        label: { fontSize: 'xs' },
        control: { height: '9' },
        input: { fontSize: 'sm', paddingInline: '2.5' },
        incrementTrigger: { width: '7', fontSize: 'xs' },
        decrementTrigger: { width: '7', fontSize: 'xs' },
        prefix: { paddingInline: '2', fontSize: 'xs' },
        suffix: { paddingInline: '2', fontSize: 'xs' },
      },
      md: {
        label: { fontSize: 'sm' },
        control: { height: '10' },
        input: { fontSize: 'sm', paddingInline: '3' },
        incrementTrigger: { width: '8', fontSize: 'sm' },
        decrementTrigger: { width: '8', fontSize: 'sm' },
        prefix: { paddingInline: '2.5', fontSize: 'sm' },
        suffix: { paddingInline: '2.5', fontSize: 'sm' },
      },
      lg: {
        label: { fontSize: 'md' },
        control: { height: '12' },
        input: { fontSize: 'md', paddingInline: '4' },
        incrementTrigger: { width: '10', fontSize: 'md' },
        decrementTrigger: { width: '10', fontSize: 'md' },
        prefix: { paddingInline: '3', fontSize: 'md' },
        suffix: { paddingInline: '3', fontSize: 'md' },
      },
    },
  },

  defaultVariants: { size: 'md' },
});
