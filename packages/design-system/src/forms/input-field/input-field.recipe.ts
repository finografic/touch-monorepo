/**
 * InputField Recipe
 *
 * Compound text input with optional leading/trailing decoration slots.
 *
 * Slots:    root · input · slot
 * Variants: size (sm | md | lg)
 *
 * Slot positioning: apply `data-side="left"` or `data-side="right"` to the
 * slot element. The input's padding adjusts via `hasLeadingSlot` /
 * `hasTrailingSlot` compound variants on Root.
 */
import { sva } from '@styled-system/css';

export const inputFieldRecipe = sva({
  className: 'input-field',

  slots: ['root', 'input', 'slot'],

  base: {
    root: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },

    input: {
      flex: '1',
      width: '100%',
      borderWidth: 'default',
      borderStyle: 'solid',
      borderColor: 'border',
      borderRadius: 'md',
      bg: 'bg',
      color: 'fg',
      fontWeight: 'normal',
      outline: 0,
      transitionProperty: 'border-color, box-shadow',
      transitionDuration: 'normal',
      _placeholder: { color: 'fg.subtle' },
      _focusVisible: {
        borderColor: 'accent.solid',
        boxShadow: '0 0 0 1px var(--colors-accent-focus-ring)',
      },
      _disabled: { opacity: 0.55, cursor: 'not-allowed' },
      _invalid: {
        borderColor: 'border.error',
        _focusVisible: { boxShadow: '0 0 0 1px var(--colors-fg-error)' },
      },
    },

    slot: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'fg.muted',
      pointerEvents: 'none',
      '&[data-side="left"]': { left: '0' },
      '&[data-side="right"]': { right: '0' },
      '&[data-interactive]': { pointerEvents: 'auto', cursor: 'pointer' },
    },
  },

  variants: {
    size: {
      sm: {
        input: { height: '9', fontSize: 'sm', paddingInline: '3' },
        slot: { width: '9', height: '9', fontSize: 'sm' },
      },
      md: {
        input: { height: '10', fontSize: 'sm', paddingInline: '3' },
        slot: { width: '10', height: '10', fontSize: 'sm' },
      },
      lg: {
        input: { height: '12', fontSize: 'md', paddingInline: '4' },
        slot: { width: '12', height: '12', fontSize: 'md' },
      },
    },

    hasLeadingSlot: {
      true: {},
    },

    hasTrailingSlot: {
      true: {},
    },
  },

  compoundVariants: [
    { size: 'sm', hasLeadingSlot: true, css: { input: { paddingInlineStart: '9' } } },
    { size: 'sm', hasTrailingSlot: true, css: { input: { paddingInlineEnd: '9' } } },
    { size: 'md', hasLeadingSlot: true, css: { input: { paddingInlineStart: '10' } } },
    { size: 'md', hasTrailingSlot: true, css: { input: { paddingInlineEnd: '10' } } },
    { size: 'lg', hasLeadingSlot: true, css: { input: { paddingInlineStart: '12' } } },
    { size: 'lg', hasTrailingSlot: true, css: { input: { paddingInlineEnd: '12' } } },
  ],

  defaultVariants: { size: 'md' },
});
