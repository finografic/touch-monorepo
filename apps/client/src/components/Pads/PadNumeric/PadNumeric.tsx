import { useCallback } from 'react';
import type { FC, ReactElement } from 'react';
import { Button } from '@radix-ui/themes';
import clsx from 'clsx';
import { styles } from './PadNumeric.styles';

interface PadNumericProps {
  // Core props
  value: number;
  onChange: (newValue: number) => void;

  // Constraints
  min?: number;
  max?: number;
  step?: number;

  // Display formatting
  label?: string;
  description?: string;
  decimalPlaces?: number;
  padZeros?: number;
  prefix?: string | ReactElement;
  suffix?: string | ReactElement;

  // Optional styling
  className?: string;
  disabled?: boolean;
}

export const PadNumeric: FC<PadNumericProps> = ({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  label,
  description,
  decimalPlaces = 0,
  padZeros = 2,
  prefix = '',
  suffix = '',
  className,
  disabled = false,
}) => {
  // Format the display value
  const formatValue = useCallback(
    (num: number): { numeric: string; prefix: string | ReactElement; suffix: string | ReactElement } => {
      const formatted = decimalPlaces > 0 ? num.toFixed(decimalPlaces) : Math.round(num).toString();

      const [whole, decimal] = formatted.split('.');
      const paddedWhole = whole.padStart(padZeros, '0');

      return {
        numeric: `${paddedWhole}${decimal ? '.' + decimal : ''}`,
        prefix,
        suffix,
      };
    },
    [decimalPlaces, padZeros, prefix, suffix],
  );

  // Check if increment/decrement is allowed
  const canIncrement = useCallback(() => {
    return !disabled && value + step <= max;
  }, [value, step, max, disabled]);

  const canDecrement = useCallback(() => {
    return !disabled && value - step >= min;
  }, [value, step, min, disabled]);

  // Handle increment/decrement
  const handleIncrement = useCallback(() => {
    if (canIncrement()) {
      onChange(value + step);
    }
  }, [value, step, onChange, canIncrement]);

  const handleDecrement = useCallback(() => {
    if (canDecrement()) {
      onChange(value - step);
    }
  }, [value, step, onChange, canDecrement]);

  return (
    <div css={styles} className={clsx('pad-numeric', className)}>
      <div className="pad-container">
        {/* Label & Description */}
        {(label || description) && (
          <div className="header">
            {label && <label>{label}</label>}
            {description && <p className="description">{description}</p>}
          </div>
        )}

        {/* Controls */}
        <div className="controls-container">
          <Button
            className="control-button increment"
            onClick={handleIncrement}
            disabled={!canIncrement()}
            variant="outline"
            color="gray"
          >
            +
          </Button>

          <div className="value-container">
            <span className="prefix">{formatValue(value).prefix}</span>
            <span className="numeric">{formatValue(value).numeric}</span>
            <span className="suffix">{formatValue(value).suffix}</span>
          </div>

          <Button
            className="control-button decrement"
            onClick={handleDecrement}
            disabled={!canDecrement()}
            variant="outline"
            color="gray"
          >
            -
          </Button>
        </div>
      </div>
    </div>
  );
};
