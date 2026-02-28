import type { FC, ReactElement } from 'react';
import { useCallback } from 'react';

import clsx from 'clsx';
import { Button } from 'components/Button';

import { styles } from './PadNumeric.styles';

interface PadNumericProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  description?: string;
  decimalPlaces?: number;
  padZeros?: number;
  prefix?: string | ReactElement;
  suffix?: string | ReactElement;
  className?: string;
  disabled?: boolean;
  loop?: boolean; // Enable looping behavior (wrap around at min/max)
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
  loop: loopEnabled = false,
}) => {
  const formatValue = useCallback(
    (num: number): { numeric: string; prefix: string | ReactElement; suffix: string | ReactElement } => {
      const formatted = decimalPlaces > 0 ? num.toFixed(decimalPlaces) : Math.round(num).toString();

      const [whole, decimal] = formatted.split('.');
      const paddedWhole = whole.padStart(padZeros, '0');

      return {
        numeric: `${paddedWhole}${decimal ? `.${decimal}` : ''}`,
        prefix,
        suffix,
      };
    },
    [decimalPlaces, padZeros, prefix, suffix],
  );

  const getIncrementedValue = useCallback((): number | null => {
    if (disabled) return null;

    const nextValue = value + step;

    if (loopEnabled && nextValue > max) {
      return min;
    }

    return nextValue <= max ? nextValue : null;
  }, [value, step, max, min, disabled, loopEnabled]);

  const getDecrementedValue = useCallback((): number | null => {
    if (disabled) return null;

    const nextValue = value - step;

    if (loopEnabled && nextValue < min) {
      const stepsFromMin = Math.floor((max - min) / step);
      return min + stepsFromMin * step;
    }

    return nextValue >= min ? nextValue : null;
  }, [value, step, min, max, disabled, loopEnabled]);

  const handleIncrement = useCallback(() => {
    const nextValue = getIncrementedValue();
    if (nextValue !== null) {
      onChange(nextValue);
    }
  }, [getIncrementedValue, onChange]);

  const handleDecrement = useCallback(() => {
    const nextValue = getDecrementedValue();
    if (nextValue !== null) {
      onChange(nextValue);
    }
  }, [getDecrementedValue, onChange]);

  return (
    <div css={styles} className={clsx('pad-numeric', className)}>
      <div className="pad-container">
        {(label || description) && (
          <div className="header">
            {label && <label>{label}</label>}
            {description && <p className="description">{description}</p>}
          </div>
        )}
        <div className="controls-container">
          <Button
            className="control-button increment"
            onClick={handleIncrement}
            disabled={getIncrementedValue() === null}
            variant="outline"
            color="default"
            size="sm"
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
            disabled={getDecrementedValue() === null}
            variant="outline"
            color="default"
            size="sm"
          >
            -
          </Button>
        </div>
      </div>
    </div>
  );
};
