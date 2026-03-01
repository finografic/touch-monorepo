/**
 * Checkbox Component
 *
 * Typed wrapper around Ark UI Checkbox.
 * Ark handles all a11y: role="checkbox", aria-checked, indeterminate state,
 * keyboard support (Space to toggle).
 *
 * Styling comes from `checkboxRecipe` applied per slot via `classNames`.
 *
 * Usage — composable parts:
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
 *
 * Usage — convenience wrapper:
 * ```tsx
 * <CheckboxField
 *   label="Accept terms"
 *   size="md"
 *   checked={accepted}
 *   onCheckedChange={({ checked }) => setAccepted(checked)}
 *   classNames={checkboxRecipe({ size: 'md' })}
 * />
 * ```
 */
import { Checkbox as ArkCheckbox } from '@ark-ui/react';
import type { ReactNode } from 'react';
import { forwardRef } from 'react';

// Re-export all Ark Checkbox parts for composable use
export const Checkbox = ArkCheckbox;

// ── Convenience wrapper ──────────────────────────────────────────────────────

export interface CheckboxFieldClassNames {
  root?: string;
  control?: string;
  indicator?: string;
  label?: string;
}

export interface CheckboxFieldProps {
  /** Label text beside the checkbox */
  label?: ReactNode;
  /** Controlled checked state (true | false | 'indeterminate') */
  checked?: boolean | 'indeterminate';
  /** Callback on change */
  onCheckedChange?: (details: { checked: boolean | 'indeterminate' }) => void;
  /** Disables the checkbox */
  disabled?: boolean;
  /** Size hint — pass matching checkboxRecipe output in classNames */
  size?: 'sm' | 'md' | 'lg';
  /** Icon/node to render inside the control when checked */
  indicator?: ReactNode;
  /** Per-slot class names — apply checkboxRecipe() output here */
  classNames?: CheckboxFieldClassNames;
}

/**
 * CheckboxField — opinionated one-liner: control + indicator + label.
 * Use the bare `Checkbox.*` parts when you need full layout control.
 */
export const CheckboxField = forwardRef<HTMLLabelElement, CheckboxFieldProps>(
  (
    {
      label,
      checked,
      onCheckedChange,
      disabled,
      size = 'md',
      indicator,
      classNames = {},
    },
    ref,
  ) => {
    return (
      <ArkCheckbox.Root
        ref={ref}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        data-size={size}
        className={classNames.root}
      >
        <ArkCheckbox.Control className={classNames.control}>
          <ArkCheckbox.Indicator className={classNames.indicator}>
            {indicator ?? <DefaultCheckIcon />}
          </ArkCheckbox.Indicator>
        </ArkCheckbox.Control>
        {label && (
          <ArkCheckbox.Label className={classNames.label}>
            {label}
          </ArkCheckbox.Label>
        )}
        <ArkCheckbox.HiddenInput />
      </ArkCheckbox.Root>
    );
  },
);

CheckboxField.displayName = 'CheckboxField';

// Minimal inline checkmark — replace with your icon library in practice
function DefaultCheckIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: '100%', height: '100%' }}
      aria-hidden
    >
      <polyline points="2,6 5,9 10,3" />
    </svg>
  );
}
