/**
 * Switch Component
 *
 * Ark UI Switch primitive with design system styling.
 * Full a11y: role="switch", aria-checked, keyboard support.
 *
 * Usage:
 * ```tsx
 * import { Switch } from '@workspace/design-system/components';
 *
 * <Switch
 *   label="Enable minimal layout"
 *   checked={isMinimal}
 *   onCheckedChange={({ checked }) => setIsMinimal(checked)}
 * />
 * ```
 */
import { Switch as ArkSwitch } from '@ark-ui/react';
import { forwardRef } from 'react';

export interface SwitchProps {
  /** Label text displayed next to the switch */
  label?: string;
  /** Controlled checked state */
  checked?: boolean;
  /** Callback when checked state changes */
  onCheckedChange?: (details: { checked: boolean }) => void;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className for the root */
  className?: string;
}

export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  ({ label, checked, onCheckedChange, disabled, size = 'md', className, ...props }, ref) => {
    return (
      <ArkSwitch.Root
        ref={ref}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={className}
        {...props}
      >
        <ArkSwitch.Control data-size={size}>
          <ArkSwitch.Thumb className="switch-thumb" />
        </ArkSwitch.Control>
        {label && <ArkSwitch.Label>{label}</ArkSwitch.Label>}
        <ArkSwitch.HiddenInput />
      </ArkSwitch.Root>
    );
  },
);

Switch.displayName = 'Switch';
