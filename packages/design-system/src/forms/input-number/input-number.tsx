import { ChevronDownIcon, ChevronUpIcon } from '@workspace/icons';

import { NumberInput as ArkNumberInput } from '@ark-ui/react';
import { forwardRef, type ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

import { inputNumberRecipe } from './input-number.recipe';
import type { InputNumberVariants } from './input-number.types';

export interface InputNumberProps extends InputNumberVariants {
  // ── Value ────────────────────────────────────────────────────────────────
  value?: number;
  defaultValue?: number;
  onChange?: (value: number | null) => void;
  onBlur?: () => void;
  name?: string;

  // ── Constraints ──────────────────────────────────────────────────────────
  min?: number;
  max?: number;
  step?: number;
  /** Decimal places shown and allowed. Default: any */
  precision?: number;

  // ── Formatting ───────────────────────────────────────────────────────────
  /** Intl.NumberFormat locale (e.g. 'en-US', 'de-DE'). Default: navigator.language */
  locale?: string;
  /** Extra Intl.NumberFormat options (e.g. { style: 'currency', currency: 'USD' }) */
  formatOptions?: Intl.NumberFormatOptions;

  // ── Decoration ───────────────────────────────────────────────────────────
  /** Content rendered before the input (e.g. "$", "€", an icon) */
  prefix?: ReactNode;
  /** Content rendered after the input (e.g. "%", "kg", "lbs") */
  suffix?: ReactNode;
  /** Show increment/decrement stepper buttons. Default: true */
  showStepper?: boolean;

  // ── Label / validation ───────────────────────────────────────────────────
  label?: ReactNode;
  error?: FieldError | string;

  // ── HTML ─────────────────────────────────────────────────────────────────
  id?: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      onBlur,
      name,
      min,
      max,
      step = 1,
      precision,
      locale,
      formatOptions,
      prefix,
      suffix,
      showStepper = true,
      label,
      error,
      id,
      disabled,
      readOnly,
      placeholder,
      size = 'md',
      className,
    },
    ref,
  ) => {
    const cls = inputNumberRecipe({ size });
    const errorMessage = typeof error === 'string' ? error : error?.message;

    const resolvedFormatOptions: Intl.NumberFormatOptions = {
      maximumFractionDigits: precision,
      minimumFractionDigits: precision,
      ...formatOptions,
    };

    return (
      <ArkNumberInput.Root
        id={id}
        name={name}
        value={value !== undefined ? String(value) : undefined}
        defaultValue={defaultValue !== undefined ? String(defaultValue) : undefined}
        onValueChange={({ valueAsNumber }) => onChange?.(isNaN(valueAsNumber) ? null : valueAsNumber)}
        min={min}
        max={max}
        step={step}
        locale={locale}
        formatOptions={resolvedFormatOptions}
        disabled={disabled}
        readOnly={readOnly}
        invalid={Boolean(errorMessage)}
        className={[cls.root, className].filter(Boolean).join(' ')}
      >
        {label && (
          <ArkNumberInput.Label className={cls.label}>{label}</ArkNumberInput.Label>
        )}

        <ArkNumberInput.Control className={cls.control}>
          {prefix && <span className={cls.prefix}>{prefix}</span>}

          <ArkNumberInput.Input
            ref={ref}
            onBlur={onBlur}
            placeholder={placeholder}
            className={cls.input}
          />

          {suffix && <span className={cls.suffix}>{suffix}</span>}

          {showStepper && (
            <>
              <ArkNumberInput.DecrementTrigger className={cls.decrementTrigger} aria-label="Decrement">
                <ChevronDownIcon className="icon icon-sm" aria-hidden />
              </ArkNumberInput.DecrementTrigger>
              <ArkNumberInput.IncrementTrigger className={cls.incrementTrigger} aria-label="Increment">
                <ChevronUpIcon className="icon icon-sm" aria-hidden />
              </ArkNumberInput.IncrementTrigger>
            </>
          )}
        </ArkNumberInput.Control>

        {errorMessage && (
          <span role="alert" style={{ fontSize: 'var(--font-sizes-sm)', color: 'var(--colors-fg-error)', fontWeight: 600 }}>
            {errorMessage}
          </span>
        )}
      </ArkNumberInput.Root>
    );
  },
);

InputNumber.displayName = 'InputNumber';
