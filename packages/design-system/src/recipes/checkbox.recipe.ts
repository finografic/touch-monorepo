/**
 * Checkbox Recipe (Slot Recipe)
 *
 * Styling for Ark UI's Checkbox compound component.
 * Ark handles all a11y: role="checkbox", aria-checked, indeterminate state,
 * keyboard support (Space to toggle).
 *
 * Slots:
 *   root      — the outer <label> wrapper
 *   control   — the visible checkbox box
 *   indicator — the checkmark / dash SVG inside the control
 *   label     — the text label beside the box
 *
 * Usage:
 * ```tsx
 * import { Checkbox } from '@workspace/design-system/components';
 * // cls from consuming app's generated: checkboxRecipe({ size: 'md' })
 *
 * <Checkbox.Root className={cls.root} size="md">
 *   <Checkbox.Control className={cls.control}>
 *     <Checkbox.Indicator className={cls.indicator}>
 *       <CheckIcon />
 *     </Checkbox.Indicator>
 *   </Checkbox.Control>
 *   <Checkbox.Label className={cls.label}>Accept terms</Checkbox.Label>
 *   <Checkbox.HiddenInput />
 * </Checkbox.Root>
 * ```
 */
import { defineSlotRecipe } from '@pandacss/dev';

export const checkboxRecipe = defineSlotRecipe({
  className: 'checkbox',
  description: 'Checkbox with label — accessible toggle with indeterminate state',

  slots: ['root', 'control', 'indicator', 'label'],

  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '2',
      cursor: 'pointer',
      userSelect: 'none',
      _disabled: {
        opacity: 0.55,
        cursor: 'not-allowed',
      },
    },
    control: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      borderRadius: 'xs',
      borderWidth: 'light',
      borderStyle: 'solid',
      borderColor: 'border',
      bg: 'bg',
      color: 'transparent',
      transitionProperty: 'background-color, border-color, color',
      transitionDuration: 'normal',
      _checked: {
        bg: 'accent.solid',
        borderColor: 'accent.solid',
        color: 'white',
      },
      _indeterminate: {
        bg: 'accent.solid',
        borderColor: 'accent.solid',
        color: 'white',
      },
      _hover: {
        borderColor: 'accent.emphasized',
      },
      _disabled: {
        bg: 'bg.subtle',
        borderColor: 'border.muted',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'accent.focusRing',
        outlineOffset: '2px',
      },
    },
    indicator: {
      '& svg': { flexShrink: 0 },
    },
    label: {
      color: 'fg',
      lineHeight: 'normal',
      _disabled: { color: 'fg.subtle' },
    },
  },

  variants: {
    size: {
      sm: {
        control:   { width: '4',   height: '4' },
        indicator: { width: '2.5', height: '2.5', '& svg': { w: '2.5', h: '2.5' } },
        label:     { fontSize: 'sm' },
      },
      md: {
        control:   { width: '5',   height: '5' },
        indicator: { width: '3',   height: '3',   '& svg': { w: '3',   h: '3' } },
        label:     { fontSize: 'md' },
      },
      lg: {
        control:   { width: '6',   height: '6' },
        indicator: { width: '4',   height: '4',   '& svg': { w: '4',   h: '4' } },
        label:     { fontSize: 'lg' },
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});
