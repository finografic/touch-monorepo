import type { FC, ReactElement } from 'react';
import React, { useCallback, useRef, useState } from 'react';

import { Button } from '@radix-ui/themes';
import clsx from 'clsx';

import { styles } from './PadNumeric.styles';

// Key-repeat timing constants (like macOS system settings)
const DEFAULT_INITIAL_REPEAT_DELAY = 500; // ms - "Delay until repeat" (Long to Short)
const DEFAULT_REPEAT_INTERVAL = 100; // ms - "Key repeat rate" (Slow to Fast)

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
  loop = false,
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

  const canIncrement = useCallback(() => {
    if (disabled) return false;
    if (loop) return true; // Always allow increment when looping
    return value + step <= max;
  }, [value, step, max, disabled, loop]);

  const canDecrement = useCallback(() => {
    if (disabled) return false;
    if (loop) return true; // Always allow decrement when looping
    return value - step >= min;
  }, [value, step, min, disabled, loop]);

  const handleIncrement = useCallback(() => {
    if (!canIncrement()) return;

    let newValue = value + step;

    // Handle looping
    if (loop && newValue > max) {
      newValue = min;
    }

    onChange(newValue);
  }, [value, step, onChange, canIncrement, loop, min, max]);

  const handleDecrement = useCallback(() => {
    if (!canDecrement()) return;

    let newValue = value - step;

    // Handle looping
    if (loop && newValue < min) {
      newValue = max;
    }

    onChange(newValue);
  }, [value, step, onChange, canDecrement, loop, min, max]);

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
