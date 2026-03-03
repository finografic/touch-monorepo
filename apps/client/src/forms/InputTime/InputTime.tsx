import React, { useCallback, useEffect, useState } from 'react';

import { InputField } from '@workspace/design-system/forms';
import { useOptionalFormMiddleware } from 'forms/FormMiddleware';

import { formatTimeDuration, parseTimeDurationToSeconds } from 'utils/time.utils';
import { STEP_BUTTON_VARIANT } from '../FormMiddleware/FormMiddleware.constants';
import { Button } from 'components/Button';
import { useColors } from 'styles';
import { ChevronDownIcon, ChevronUpIcon, ExclamationTriangleIcon } from '@workspace/design-system/icons';
import { styles } from './InputTime.styles';

interface InputTimeProps {
  // FormMiddleware integration (when used in FormMiddleware forms)
  name?: string; // Field name for middleware integration

  // Standalone props (when used without FormMiddleware)
  value?: number; // in seconds
  defaultValue?: number; // in seconds
  min?: number; // in seconds
  max?: number; // in seconds
  step?: number; // in seconds, default 30 seconds
  disabled?: boolean;
  onTimeChange?: (seconds: number) => void; // Optional when using middleware
}

export const InputTime: React.FC<InputTimeProps> = ({
  name,
  value,
  defaultValue = 0,
  min = 0,
  max = 3600, // 60 minutes default
  step = 30, // 30 seconds default
  disabled = false,
  onTimeChange,
}) => {
  const { colors } = useColors();

  const middleware = useOptionalFormMiddleware();
  const isMiddlewareMode = Boolean(middleware && name);

  /*
  // TODO: REMOVE IF FORM WORKING CORRECTLY !!
  // Try to get FormMiddleware context (will be null if not in a FormMiddleware form)
  let middleware = null;
  try {
    middleware = useFormMiddleware();
  } catch {
    // Not in a FormMiddleware context, use standalone mode
  }

  // Determine if we're using middleware or standalone mode
  const isMiddlewareMode = middleware && name;
  */

  // Get middleware values when available
  const middlewareValue = isMiddlewareMode && middleware ? middleware.watch(name!) : undefined;
  const constraints = isMiddlewareMode && middleware ? middleware.getFieldConstraints(name!) : { min, max };
  const isEnabled =
    isMiddlewareMode && middleware ? middleware.isFieldEnabled(name!) && !disabled : !disabled;

  // Determine current value source
  const currentValue = isMiddlewareMode ? middlewareValue : value;

  // Helper function to notify value changes
  const notifyChange = useCallback(
    (seconds: number) => {
      if (isMiddlewareMode) {
        middleware!.setFieldValue(name!, seconds);
      } else if (onTimeChange) {
        onTimeChange(seconds);
      }
    },
    [isMiddlewareMode, middleware, name, onTimeChange],
  );
  // Time utilities are now imported from centralized utils

  // Check if we should show placeholder (when currentValue is undefined)
  const shouldShowPlaceholder = currentValue === undefined;
  const currentSeconds = shouldShowPlaceholder ? 0 : (currentValue ?? defaultValue);

  // Local state for display value and validation
  const [displayValue, setDisplayValue] = useState(() => {
    return shouldShowPlaceholder ? '' : formatTimeDuration(currentSeconds);
  });
  const [isInvalid, setIsInvalid] = useState(false);

  // Sync display when external value changes
  useEffect(() => {
    if (shouldShowPlaceholder) {
      setDisplayValue(''); // Empty string shows placeholder
      setIsInvalid(false);
    } else {
      setDisplayValue(formatTimeDuration(currentSeconds));
      setIsInvalid(false);
    }
  }, [currentValue, currentSeconds, formatTimeDuration, shouldShowPlaceholder]);

  const handleStepUp = useCallback(() => {
    const baseValue = currentValue ?? 0; // Start from 0 if undefined
    const newValue = Math.min(baseValue + step, constraints.max ?? max);
    setDisplayValue(formatTimeDuration(newValue));
    setIsInvalid(false);
    notifyChange(newValue);
  }, [currentValue, step, constraints.max, max, formatTimeDuration, notifyChange]);

  const handleStepDown = useCallback(() => {
    const baseValue = currentValue ?? 0; // Start from 0 if undefined
    const newValue = Math.max(baseValue - step, constraints.min ?? min);
    setDisplayValue(formatTimeDuration(newValue));
    setIsInvalid(false);
    notifyChange(newValue);
  }, [currentValue, step, constraints.min, min, formatTimeDuration, notifyChange]);

  // Handle user typing mm:ss format
  const handleDisplayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setDisplayValue(inputValue);

      // Reset invalid state while typing
      setIsInvalid(false);

      // If it's a valid mm:ss format, convert to seconds
      if (inputValue.match(/^\d{1,2}:\d{2}$/)) {
        const seconds = parseTimeDurationToSeconds(inputValue);
        const minConstraint = constraints.min ?? min;
        const maxConstraint = constraints.max ?? max;
        if (seconds >= minConstraint && seconds <= maxConstraint) {
          notifyChange(seconds);
        }
      }
    },
    [parseTimeDurationToSeconds, constraints.min, constraints.max, min, max, notifyChange],
  );

  // Prevent ENTER from submitting form
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur(); // Trigger blur to format the input
    }
  }, []);

  // Handle formatting on blur (transform digits to mm:ss)
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.trim();

      // If empty, keep it empty to show placeholder
      if (!inputValue) {
        setDisplayValue('');
        setIsInvalid(false);
        return;
      }

      // If it's already in mm:ss format, leave it
      if (inputValue.match(/^\d{1,2}:\d{2}$/)) {
        return;
      }

      // If it's just digits, try to format as mm:ss
      const digitsOnly = inputValue.replace(/\D/g, '');
      if (digitsOnly.length > 0) {
        let formattedValue = '';

        if (digitsOnly.length === 1) {
          // "5" → "00:05"
          formattedValue = `00:0${digitsOnly}`;
        } else if (digitsOnly.length === 2) {
          // "30" → "00:30"
          formattedValue = `00:${digitsOnly}`;
        } else if (digitsOnly.length === 3) {
          // "130" → "01:30"
          formattedValue = `0${digitsOnly[0]}:${digitsOnly.slice(1)}`;
        } else if (digitsOnly.length === 4) {
          // "1234" → "12:34"
          formattedValue = `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2, 4)}`;
        } else {
          // Too many digits, take first 4
          formattedValue = `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2, 4)}`;
        }

        // Validate the formatted time
        const seconds = parseTimeDurationToSeconds(formattedValue);
        const minConstraint = constraints.min ?? min;
        const maxConstraint = constraints.max ?? max;
        if (seconds >= minConstraint && seconds <= maxConstraint) {
          setDisplayValue(formattedValue);
          setIsInvalid(false);
          notifyChange(seconds);
        } else {
          // Invalid time, revert to previous valid value or empty
          if (currentValue !== undefined) {
            setDisplayValue(formatTimeDuration(currentValue));
          } else {
            setDisplayValue('');
          }
          setIsInvalid(false);
        }
      } else {
        // No valid digits found (like "zzzz"), mark as invalid
        setIsInvalid(true);
      }
    },
    [currentValue, formatTimeDuration, parseTimeDurationToSeconds, constraints.min, constraints.max, min, max, notifyChange],
  );

  return (
    <div css={styles} className={`input-time ${isInvalid ? 'field-warning' : ''}`}>
      <InputField.Root
        className="time-input-root"
        type="text"
        placeholder="mm:ss"
        disabled={!isEnabled}
        value={displayValue}
        onChange={handleDisplayChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        <InputField.Slot side="left" className="input-slot-left time-controls-slot">
          {!isInvalid && (
            <div>
              <Button
                type="button"
                variant={STEP_BUTTON_VARIANT}
                size="sm"
                onClick={handleStepUp}
                disabled={!isEnabled}
                style={{ height: '16px', width: '20px', minWidth: '20px' }}
                icon={<ChevronUpIcon style={{ height: '12px', width: '12px' }} />}
              />
              <Button
                type="button"
                variant={STEP_BUTTON_VARIANT}
                size="sm"
                onClick={handleStepDown}
                disabled={!isEnabled}
                style={{ height: '16px', width: '20px', minWidth: '20px' }}
                icon={<ChevronDownIcon style={{ height: '12px', width: '12px' }} />}
              />
            </div>
          )}
          {isInvalid && (
            <ExclamationTriangleIcon
              style={{
                color: colors.warningDark,
                marginLeft: '4px',
                height: '16px',
                width: '16px',
              }}
            />
          )}
        </InputField.Slot>
      </InputField.Root>
    </div>
  );
};

InputTime.displayName = 'InputTime';
