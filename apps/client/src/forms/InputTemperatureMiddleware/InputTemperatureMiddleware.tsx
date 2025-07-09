import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { IconButton, TextField } from '@radix-ui/themes';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { useFormMiddleware } from '../FormMiddleware/FormMiddleware.simple';
import { styles } from './InputTemperatureMiddleware.styles';
import {
  DEFAULT_TEMP_MAX,
  DEFAULT_TEMP_MIN,
  INPUT_DEBOUNCE_DELAY,
  STEP_BUTTON_SIZE,
  STEP_BUTTON_VARIANT,
  TEMP_INPUT_PLACEHOLDER,
  TEMP_STEP,
} from '../FormMiddleware/FormMiddleware.constants';

interface InputTemperatureMiddlewareProps {
  name: string;
  placeholder?: string;
  disabled?: boolean;
}

export const InputTemperatureMiddleware = forwardRef<HTMLInputElement, InputTemperatureMiddlewareProps>(
  ({ name, placeholder = TEMP_INPUT_PLACEHOLDER, disabled = false, ...props }, ref) => {
    const middleware = useFormMiddleware();
    const [displayValue, setDisplayValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
      };
    }, []);

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
              middleware.setFieldValue(name, parsedValue);
            }
          }
          setIsTyping(false);
        }, INPUT_DEBOUNCE_DELAY);
      },
      [middleware, name, constraints],
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
            middleware.setFieldValue(name, parsedValue);
            // Format the display value
            const formatted = middleware.formatValue(name, parsedValue);
            setDisplayValue(formatted);
          } else {
            // Invalid value - revert to previous valid value or empty
            if (currentValue !== undefined) {
              const formatted = middleware.formatValue(name, currentValue);
              setDisplayValue(formatted);
            } else {
              setDisplayValue('');
            }
          }
        }
      },
      [middleware, name, currentValue, constraints],
    );

    // Step up (immediate, no debounce)
    const handleStepUp = useCallback(() => {
      // Clear any pending debounced operation
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }

      setIsTyping(false);
      const newValue = Math.min((currentValue || 0) + TEMP_STEP, constraints.max || DEFAULT_TEMP_MAX);
      middleware.setFieldValue(name, newValue);
    }, [middleware, name, currentValue, constraints.max]);

    // Step down (immediate, no debounce)
    const handleStepDown = useCallback(() => {
      // Clear any pending debounced operation
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }

      setIsTyping(false);
      const newValue = Math.max((currentValue || 0) - TEMP_STEP, constraints.min || DEFAULT_TEMP_MIN);
      middleware.setFieldValue(name, newValue);
    }, [middleware, name, currentValue, constraints.min]);

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
      <div css={styles} className="temperature-input-middleware">
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
          <TextField.Slot side="left">
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
        </TextField.Root>
      </div>
    );
  },
);

InputTemperatureMiddleware.displayName = 'InputTemperatureMiddleware';
