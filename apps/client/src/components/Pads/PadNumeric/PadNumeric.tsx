import React, { useCallback, useRef, useState } from 'react';
import type { FC, ReactElement } from 'react';
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
  // Key-repeat timing (like macOS system settings)
  initialRepeatDelay?: number; // "Delay until repeat" in ms (default: 500ms)
  repeatInterval?: number; // "Key repeat rate" in ms (default: 100ms)
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
  initialRepeatDelay = DEFAULT_INITIAL_REPEAT_DELAY,
  repeatInterval = DEFAULT_REPEAT_INTERVAL,
}) => {
  // Key-repeat state
  const [isRepeating, setIsRepeating] = useState(false);
  const repeatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isIncrementRef = useRef<boolean>(false);

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

  // Repeat functions that bypass canIncrement/canDecrement checks
  const repeatIncrement = useCallback(() => {
    let newValue = value + step;

    // Handle looping
    if (loop && newValue > max) {
      newValue = min;
    }

    console.log('PadNumeric: repeatIncrement', { value, step, newValue, loop, min, max });
    onChange(newValue);
  }, [value, step, onChange, loop, min, max]);

  const repeatDecrement = useCallback(() => {
    let newValue = value - step;

    // Handle looping
    if (loop && newValue < min) {
      newValue = max;
    }

    console.log('PadNumeric: repeatDecrement', { value, step, newValue, loop, min, max });
    onChange(newValue);
  }, [value, step, onChange, loop, min, max]);

  // Key-repeat functionality (like macOS system settings)
  const startRepeat = useCallback(
    (isIncrement: boolean) => {
      if (isRepeating || disabled) return;

      setIsRepeating(true);
      isIncrementRef.current = isIncrement;

      // Initial action (immediate response)
      if (isIncrement) {
        handleIncrement();
      } else {
        handleDecrement();
      }

      // Set up repeat after initial delay (like macOS "Delay until repeat")
      repeatTimeoutRef.current = setTimeout(() => {
        repeatIntervalRef.current = setInterval(() => {
          if (isIncrementRef.current) {
            repeatIncrement();
          } else {
            repeatDecrement();
          }
        }, repeatInterval); // Like macOS "Key repeat rate"
      }, initialRepeatDelay);
    },
    [
      isRepeating,
      handleIncrement,
      handleDecrement,
      repeatIncrement,
      repeatDecrement,
      initialRepeatDelay,
      repeatInterval,
      disabled,
    ],
  );

  // Enhanced mouse/touch event handlers (like system controls)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, isIncrement: boolean) => {
      e.preventDefault(); // Prevent context menu and text selection
      startRepeat(isIncrement);
    },
    [startRepeat],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, isIncrement: boolean) => {
      e.preventDefault(); // Prevent scrolling and context menu
      startRepeat(isIncrement);
    },
    [startRepeat],
  );

  const stopRepeat = useCallback(() => {
    setIsRepeating(false);

    if (repeatTimeoutRef.current) {
      clearTimeout(repeatTimeoutRef.current);
      repeatTimeoutRef.current = null;
    }

    if (repeatIntervalRef.current) {
      clearInterval(repeatIntervalRef.current);
      repeatIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    stopRepeat();
  }, [stopRepeat]);

  // Add cleanup effect
  React.useEffect(() => {
    return cleanup;
  }, [cleanup]);

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
            onMouseDown={(e) => handleMouseDown(e, true)}
            onMouseUp={stopRepeat}
            onMouseLeave={stopRepeat}
            onTouchStart={(e) => handleTouchStart(e, true)}
            onTouchEnd={stopRepeat}
            onTouchCancel={stopRepeat}
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
            onMouseDown={(e) => handleMouseDown(e, false)}
            onMouseUp={stopRepeat}
            onMouseLeave={stopRepeat}
            onTouchStart={(e) => handleTouchStart(e, false)}
            onTouchEnd={stopRepeat}
            onTouchCancel={stopRepeat}
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
