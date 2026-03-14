import { CheckIcon, MinusIcon } from '@workspace/icons';

import { Checkbox as ArkCheckbox } from '@ark-ui/react';
import { createStyleContext } from '@styled-system/jsx';
import { forwardRef, type ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

import { checkboxRecipe } from './checkbox.recipe';
import type { CheckboxVariants } from './checkbox.types';

// ── Compound (createStyleContext) ─────────────────────────────────────────────

const { withProvider, withContext } = createStyleContext(checkboxRecipe);

export const Checkbox = {
  Root: withProvider(ArkCheckbox.Root, 'root'),
  Control: withContext(ArkCheckbox.Control, 'control'),
  Indicator: withContext(ArkCheckbox.Indicator, 'indicator'),
  Label: withContext(ArkCheckbox.Label, 'label'),
  HiddenInput: ArkCheckbox.HiddenInput,
};

// ── CheckboxField — convenience wrapper ───────────────────────────────────────

export interface CheckboxFieldClassNames {
  root?: string;
  control?: string;
  indicator?: string;
  label?: string;
  description?: string;
  errorText?: string;
}

export type CheckboxFieldProps = CheckboxVariants & {
  /** Label text beside the checkbox */
  label?: ReactNode;
  /** Helper text below the label */
  description?: ReactNode;
  /** RHF FieldError or plain string */
  error?: FieldError | string;
  /** Controlled checked state */
  checked?: boolean | 'indeterminate';
  onCheckedChange?: (details: { checked: boolean | 'indeterminate' }) => void;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
  /** Custom indicator icon; defaults to CheckIcon / MinusIcon */
  indicator?: ReactNode;
  /** Per-slot class overrides */
  classNames?: CheckboxFieldClassNames;
};

export const CheckboxField = forwardRef<HTMLLabelElement, CheckboxFieldProps>(
  (
    {
      label,
      description,
      error,
      checked,
      onCheckedChange,
      onBlur,
      name,
      disabled,
      size = 'md',
      indicator,
      classNames = {},
    },
    ref,
  ) => {
    const cls = checkboxRecipe({ size });
    const errorMessage = typeof error === 'string' ? error : error?.message;

    return (
      <ArkCheckbox.Root
        ref={ref}
        checked={checked}
        onCheckedChange={onCheckedChange}
        onBlur={onBlur}
        name={name}
        disabled={disabled}
        data-size={size}
        data-invalid={errorMessage ? 'true' : undefined}
        className={classNames.root ?? cls.root}
      >
        <ArkCheckbox.Control className={classNames.control ?? cls.control}>
          <ArkCheckbox.Indicator className={classNames.indicator ?? cls.indicator}>
            {indicator ?? (
              <>
                <CheckIcon className="icon" aria-hidden />
                <MinusIcon className="icon" aria-hidden data-indeterminate />
              </>
            )}
          </ArkCheckbox.Indicator>
        </ArkCheckbox.Control>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          {label && (
            <ArkCheckbox.Label className={classNames.label ?? cls.label}>
              {label}
            </ArkCheckbox.Label>
          )}
          {description && (
            <span className={classNames.description ?? cls.description}>{description}</span>
          )}
          {errorMessage && (
            <span className={classNames.errorText ?? cls.errorText} role="alert">
              {errorMessage}
            </span>
          )}
        </div>

        <ArkCheckbox.HiddenInput />
      </ArkCheckbox.Root>
    );
  },
);

CheckboxField.displayName = 'CheckboxField';
