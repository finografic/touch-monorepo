import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { IconButton, TextField } from '@radix-ui/themes';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { useFormMiddleware } from '../FormMiddleware/FormMiddleware.simple';
import { styles } from './InputTemperatureMiddleware.styles';

interface InputTemperatureMiddlewareProps {
  name: string;
  placeholder?: string;
  disabled?: boolean;
}

export const InputTemperatureMiddleware = forwardRef<HTMLInputElement, InputTemperatureMiddlewareProps>(
  ({ name, placeholder = '0', disabled = false, ...props }, ref) => {
    const middleware = useFormMiddleware();
    const [displayValue, setDisplayValue] = useState('');

    // Get current value and constraints from middleware
    const currentValue = middleware.watch(name);
    const constraints = middleware.getFieldConstraints(name);
    const isEnabled = middleware.isFieldEnabled(name) && !disabled;

    // Sync display value when external value changes
    useEffect(() => {
      if (currentValue !== undefined) {
        const formatted = middleware.formatValue(name, currentValue);
        setDisplayValue(formatted);
      } else {
        setDisplayValue('');
      }
    }, [currentValue, middleware, name]);

    // Handle input changes (typing)
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setDisplayValue(inputValue);

        // Middleware handles parsing
        const parsedValue = middleware.parseValue(name, inputValue);
        if (parsedValue !== undefined) {
          middleware.setFieldValue(name, parsedValue);
        }
      },
      [middleware, name],
    );

    // Handle blur (formatting)
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trim();

        if (!inputValue) {
          setDisplayValue('');
          return;
        }

        // Let middleware handle formatting
        if (currentValue !== undefined) {
          const formatted = middleware.formatValue(name, currentValue);
          setDisplayValue(formatted);
        }
      },
      [middleware, name, currentValue],
    );

    // Step up
    const handleStepUp = useCallback(() => {
      const newValue = Math.min((currentValue || 0) + 0.5, constraints.max || 50);
      middleware.setFieldValue(name, newValue);
    }, [middleware, name, currentValue, constraints.max]);

    // Step down
    const handleStepDown = useCallback(() => {
      const newValue = Math.max((currentValue || 0) - 0.5, constraints.min || -50);
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
        <TextField.Root>
          <input
            ref={ref}
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={!isEnabled}
            className="temperature-input"
            {...props}
          />
        </TextField.Root>

        {/* Step buttons */}
        <div className="step-buttons">
          <IconButton
            type="button"
            size="1"
            variant="ghost"
            onClick={handleStepUp}
            disabled={!isEnabled || (currentValue || 0) >= (constraints.max || 50)}
            className="step-up"
          >
            <ChevronUpIcon />
          </IconButton>
          <IconButton
            type="button"
            size="1"
            variant="ghost"
            onClick={handleStepDown}
            disabled={!isEnabled || (currentValue || 0) <= (constraints.min || -50)}
            className="step-down"
          >
            <ChevronDownIcon />
          </IconButton>
        </div>
      </div>
    );
  },
);

InputTemperatureMiddleware.displayName = 'InputTemperatureMiddleware';
