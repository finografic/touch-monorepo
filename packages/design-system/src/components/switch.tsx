/**
 * Switch Component
 *
 * Typed wrapper around Ark UI Switch.
 * Ark handles all a11y: role="switch", aria-checked, keyboard (Space).
 *
 * Styling comes from `switchRecipe` applied to `Switch.Control` via `className`.
 * The `.switch-thumb` class on `Switch.Thumb` is targeted by the recipe.
 *
 * Usage:
 * ```tsx
 * import { Switch } from '@workspace/design-system/components';
 * // controlClass from consuming app's generated: switchRecipe({ size: 'md' })
 *
 * <Switch.Root
 *   checked={enabled}
 *   onCheckedChange={({ checked }) => setEnabled(checked)}
 * >
 *   <Switch.Control className={controlClass}>
 *     <Switch.Thumb className="switch-thumb" />
 *   </Switch.Control>
 *   <Switch.Label>Enable notifications</Switch.Label>
 *   <Switch.HiddenInput />
 * </Switch.Root>
 * ```
 *
 * Convenience wrapper (when you don't need to customise each part):
 * ```tsx
 * <SwitchField
 *   label="Dark mode"
 *   size="md"
 *   checked={isDark}
 *   onCheckedChange={({ checked }) => setIsDark(checked)}
 *   controlClassName={switchRecipe({ size: 'md' })}
 * />
 * ```
 */
import { Switch as ArkSwitch } from '@ark-ui/react';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

// Re-export all Ark Switch parts for composable use
export const Switch = ArkSwitch;

// ── Convenience wrapper ──────────────────────────────────────────────────────

export interface SwitchFieldProps {
  /** Text label beside the switch */
  label?: string;
  /** Controlled checked state */
  checked?: boolean;
  /** Callback on toggle */
  onCheckedChange?: (details: { checked: boolean }) => void;
  /** Disables the switch */
  disabled?: boolean;
  /** Size — drives which recipe class to pass as controlClassName */
  size?: 'sm' | 'md' | 'lg';
  /** className for the outer Root element */
  className?: string;
  /** className for the Control element — apply switchRecipe() output here */
  controlClassName?: string;
}

/**
 * SwitchField — opinionated one-liner: control + label + hidden input.
 * Use the bare `Switch.*` parts when you need full layout control.
 */
export const SwitchField = forwardRef<HTMLLabelElement, SwitchFieldProps>(
  ({ label, checked, onCheckedChange, disabled, size = 'md', className, controlClassName }, ref) => {
    return (
      <ArkSwitch.Root
        ref={ref}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        data-size={size}
        className={className}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
      >
        <ArkSwitch.Control className={controlClassName}>
          <ArkSwitch.Thumb className="switch-thumb" />
        </ArkSwitch.Control>
        {label && <ArkSwitch.Label>{label}</ArkSwitch.Label>}
        <ArkSwitch.HiddenInput />
      </ArkSwitch.Root>
    );
  },
);

SwitchField.displayName = 'SwitchField';

// Keep type export for backward compatibility
export type SwitchProps = ComponentPropsWithoutRef<typeof ArkSwitch.Root>;
