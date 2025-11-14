import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { IconButton, TextField } from '@radix-ui/themes';

import {
  CONSTRAINT_WARNING_TIMEOUT,
  DEFAULT_TEMP_MAX,
  DEFAULT_TEMP_MIN,
  INPUT_DEBOUNCE_DELAY,
  STEP_BUTTON_SIZE,
  STEP_BUTTON_VARIANT,
  TEMP_INPUT_PLACEHOLDER,
  TEMP_STEP,
} from '../FormMiddleware/FormMiddleware.constants';
import { useFormMiddleware } from '../FormMiddleware/FormMiddleware.simple';
import { useColors } from 'styles';
import { styles } from './InputTemperature.styles';

interface InputTemperatureProps {
  name: string;
  placeholder?: string;
  disabled?: boolean;
}

export const InputTemperature = forwardRef<HTMLInputElement, InputTemperatureProps>(
  ({ name, placeholder = TEMP_INPUT_PLACEHOLDER, disabled = false, ...props }, ref) => {
    const colors = useColors();
    const middleware = useFormMiddleware();
    const [displayValue, setDisplayValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isShowingWarning, setIsShowingWarning] = useState(false);
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Get current value and constraints from middleware
    const currentValue = middleware.watch(name);
    const constraints = middleware.getFieldConstraints(name);
    const isEnabled = middleware.isFieldEnabled(name) && !disabled;

    // Sync display value when external value changes (but not when user is typing)
    useEffect(() => {
      if (!isTyping) {
        if (currentValue !== undefined) {
          const formatted = middleware.formatValue(name, currentValue);
          setDisplayValue(formatted);
        } else {
          setDisplayValue('');
        }
      }
    }, [currentValue, middleware, name, isTyping]);

    // Cleanup timeouts on unmount
    useEffect(() => {
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        if (warningTimeoutRef.current) {
          clearTimeout(warningTimeoutRef.current);
        }
      };
    }, []);

    // Helper function to clear warning state
    const clearWarning = useCallback(() => {
      setIsShowingWarning(false);
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
        warningTimeoutRef.current = null;
      }
    }, []);

    // Helper function to show warning with auto-correction
    const showWarningWithAutoCorrection = useCallback(
      (invalidValue: string, correctValue: number | undefined) => {
        setIsShowingWarning(true);

        // Clear any existing warning timeout
        if (warningTimeoutRef.current) {
          clearTimeout(warningTimeoutRef.current);
        }

        // Set auto-correction timeout
        warningTimeoutRef.current = setTimeout(() => {
          if (correctValue !== undefined) {
            // Auto-correct to the constrained value
            const min = constraints.min ?? DEFAULT_TEMP_MIN;
            const max = constraints.max ?? DEFAULT_TEMP_MAX;
            const correctedValue = Math.max(min, Math.min(max, correctValue));

            middleware.setFieldValue(name, correctedValue);
            const formatted = middleware.formatValue(name, correctedValue);
            setDisplayValue(formatted);
          } else {
            // If no valid correction, revert to previous or empty
            if (currentValue !== undefined) {
              const formatted = middleware.formatValue(name, currentValue);
              setDisplayValue(formatted);
            } else {
              setDisplayValue('');
            }
          }
          setIsShowingWarning(false);
          setIsTyping(false);
        }, CONSTRAINT_WARNING_TIMEOUT);
      },
      [middleware, name, currentValue, constraints],
    );

    // Debounced parsing function
    const debouncedParseAndStore = useCallback(
      (inputValue: string) => {
        // Clear any existing timeout
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        // Set new timeout
        debounceTimeoutRef.current = setTimeout(() => {
          const parsedValue = middleware.parseValue(name, inputValue);
          if (parsedValue !== undefined) {
            // Validate against constraints
            const min = constraints.min ?? DEFAULT_TEMP_MIN;
            const max = constraints.max ?? DEFAULT_TEMP_MAX;

            if (parsedValue >= min && parsedValue <= max) {
              // Valid value - clear any warnings and store
              clearWarning();
              middleware.setFieldValue(name, parsedValue);
            } else {
              // Invalid value - show warning with auto-correction
              // Store the invalid value temporarily and show warning
              middleware.setFieldValue(name, parsedValue);
              showWarningWithAutoCorrection(inputValue, parsedValue);
            }
          } else {
            // Invalid format - clear warnings but don't store anything
            clearWarning();
          }
          setIsTyping(false);
        }, INPUT_DEBOUNCE_DELAY);
      },
      [middleware, name, constraints, clearWarning, showWarningWithAutoCorrection],
    );

    // Handle input changes (typing)
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setDisplayValue(inputValue);
        setIsTyping(true);

        // Debounce the parsing and storing
        debouncedParseAndStore(inputValue);
      },
      [debouncedParseAndStore],
    );

    // Handle blur (immediate formatting and parsing)
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trim();

        // Clear any pending debounced operation
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
          debounceTimeoutRef.current = null;
        }

        setIsTyping(false);

        if (!inputValue) {
          clearWarning();
          setDisplayValue('');
          middleware.setFieldValue(name, undefined);
          return;
        }

        // Immediate parsing and validation
        const parsedValue = middleware.parseValue(name, inputValue);
        if (parsedValue !== undefined) {
          // Validate against constraints
          const min = constraints.min ?? DEFAULT_TEMP_MIN;
          const max = constraints.max ?? DEFAULT_TEMP_MAX;

          if (parsedValue >= min && parsedValue <= max) {
            // Valid value - clear warnings and store with formatting
            clearWarning();
            middleware.setFieldValue(name, parsedValue);
            const formatted = middleware.formatValue(name, parsedValue);
            setDisplayValue(formatted);
          } else {
            // Invalid value - show warning with auto-correction
            middleware.setFieldValue(name, parsedValue);
            showWarningWithAutoCorrection(inputValue, parsedValue);
          }
        } else {
          // Invalid format - clear warnings
          clearWarning();
        }
      },
      [middleware, name, currentValue, constraints, clearWarning, showWarningWithAutoCorrection],
    );

    // Step up (immediate, no debounce)
    const handleStepUp = useCallback(() => {
      // Clear any pending debounced operation
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }

      clearWarning();
      setIsTyping(false);
      const newValue = Math.min((currentValue || 0) + TEMP_STEP, constraints.max || DEFAULT_TEMP_MAX);
      middleware.setFieldValue(name, newValue);
    }, [middleware, name, currentValue, constraints.max, clearWarning]);

    // Step down (immediate, no debounce)
    const handleStepDown = useCallback(() => {
      // Clear any pending debounced operation
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }

      clearWarning();
      setIsTyping(false);
      const newValue = Math.max((currentValue || 0) - TEMP_STEP, constraints.min || DEFAULT_TEMP_MIN);
      middleware.setFieldValue(name, newValue);
    }, [middleware, name, currentValue, constraints.min, clearWarning]);

    // Handle keyboard events
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          handleStepUp();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          handleStepDown();
        }
      },
      [handleStepUp, handleStepDown],
    );

    return (
      <div css={styles} className={`temperature-input ${isShowingWarning ? 'field-warning' : ''}`}>
        <TextField.Root
          className="temperature-input-root"
          type="text"
          placeholder={placeholder}
          disabled={!isEnabled}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          color="gray"
          size="3"
          variant="surface"
          {...props}
        >
          <TextField.Slot side="left" className="input-slot-left temperature-controls-slot">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '4px' }}>
              <IconButton
                type="button"
                variant={STEP_BUTTON_VARIANT}
                size={STEP_BUTTON_SIZE}
                onClick={handleStepUp}
                disabled={!isEnabled || (currentValue || 0) >= (constraints.max || DEFAULT_TEMP_MAX)}
                style={{ height: '16px', width: '20px', minWidth: '20px' }}
              >
                <ChevronUpIcon style={{ height: '12px', width: '12px' }} />
              </IconButton>
              <IconButton
                type="button"
                variant={STEP_BUTTON_VARIANT}
                size={STEP_BUTTON_SIZE}
                onClick={handleStepDown}
                disabled={!isEnabled || (currentValue || 0) <= (constraints.min || DEFAULT_TEMP_MIN)}
                style={{ height: '16px', width: '20px', minWidth: '20px' }}
              >
                <ChevronDownIcon style={{ height: '12px', width: '12px' }} />
              </IconButton>
            </div>
          </TextField.Slot>
          <TextField.Slot side="right" className="input-slot-right temperature-unit-slot">
            {isShowingWarning ? (
              <ExclamationTriangleIcon
                style={{
                  color: colors.warningDark,
                  height: '16px',
                  width: '16px',
                  marginRight: '4px',
                }}
              />
            ) : (
              <span
                style={{
                  color: 'var(--gray-11)',
                  fontSize: '14px',
                  fontWeight: '500',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  marginLeft: '4px',
                  marginRight: '4px',
                }}
              >
                C°
              </span>
            )}
          </TextField.Slot>
        </TextField.Root>
      </div>
    );
  },
);

InputTemperature.displayName = 'InputTemperature';
