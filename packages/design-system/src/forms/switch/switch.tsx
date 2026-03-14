import { Switch as ArkSwitch } from '@ark-ui/react';
import { forwardRef, type ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

import { switchRecipe } from './switch.recipe';
import type { SwitchVariants } from './switch.types';

// ── Bare compound re-export ───────────────────────────────────────────────────
// Use Switch.* parts when you need full layout control.
// Apply switchRecipe() to Switch.Control; add className="switch-thumb" to Switch.Thumb.
export const Switch = ArkSwitch;

// ── SwitchField — convenience wrapper ────────────────────────────────────────

export type SwitchFieldProps = SwitchVariants & {
  label?: ReactNode;
  description?: ReactNode;
  error?: FieldError | string;
  checked?: boolean;
  onCheckedChange?: (details: { checked: boolean }) => void;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
  className?: string;
  controlClassName?: string;
};

export const SwitchField = forwardRef<HTMLLabelElement, SwitchFieldProps>(
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
      className,
      controlClassName,
    },
    ref,
  ) => {
    const errorMessage = typeof error === 'string' ? error : error?.message;
    const controlCls = controlClassName ?? switchRecipe({ size });

    return (
      <ArkSwitch.Root
        ref={ref}
        name={name}
        checked={checked}
        onCheckedChange={onCheckedChange}
        onBlur={onBlur}
        disabled={disabled}
        data-size={size}
        className={className}
        style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}
      >
        <ArkSwitch.Control className={controlCls}>
          <ArkSwitch.Thumb className="switch-thumb" />
        </ArkSwitch.Control>

        {(label || description || errorMessage) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
            {label && <ArkSwitch.Label>{label}</ArkSwitch.Label>}
            {description && (
              <span style={{ fontSize: 'var(--font-sizes-sm)', color: 'var(--colors-fg-muted)' }}>
                {description}
              </span>
            )}
            {errorMessage && (
              <span
                role="alert"
                style={{ fontSize: 'var(--font-sizes-sm)', color: 'var(--colors-fg-error)', fontWeight: 600 }}
              >
                {errorMessage}
              </span>
            )}
          </div>
        )}

        <ArkSwitch.HiddenInput />
      </ArkSwitch.Root>
    );
  },
);

SwitchField.displayName = 'SwitchField';
