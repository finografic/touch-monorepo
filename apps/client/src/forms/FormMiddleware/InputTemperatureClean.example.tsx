import React, { forwardRef, useCallback, useState } from 'react';
import { IconButton, TextField } from '@radix-ui/themes';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { useFormMiddleware } from './FormMiddleware';
import { colors } from 'styles';

interface InputTemperatureCleanProps {
  name: string;
  placeholder?: string;
  disabled?: boolean;
}

// Example of how InputTemperature would look with the middleware
export const InputTemperatureClean = forwardRef<HTMLInputElement, InputTemperatureCleanProps>(
  ({ name, placeholder = '0', disabled = false, ...props }, ref) => {
    const middleware = useFormMiddleware();
    const [displayValue, setDisplayValue] = useState('');

    // All the complex logic is now handled by middleware:
    // - Localization (comma/dot conversion)
    // - Validation with specific error messages
    // - Dynamic constraints based on other fields
    // - Field dependencies (temperature relationships)

    const constraints = middleware.getFieldConstraints(name);
    const isEnabled = middleware.isFieldEnabled(name) && !disabled;
    const currentValue = middleware.watch(name);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setDisplayValue(inputValue);

        // Middleware handles parsing and validation
        const parsedValue = middleware.parseValue(name, inputValue);
        if (parsedValue !== undefined) {
          middleware.setFieldValue(name, parsedValue);
        }
      },
      [middleware, name],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trim();
        if (!inputValue) {
          setDisplayValue('');
          return;
        }

        // Middleware handles formatting and sets localized display value
        const formatted = middleware.formatValue(name, currentValue);
        setDisplayValue(formatted);
      },
      [middleware, name, currentValue],
    );

    const handleStepUp = useCallback(() => {
      const newValue = Math.min((currentValue || 0) + 0.5, constraints.max || 50);
      middleware.setFieldValue(name, newValue);
      setDisplayValue(middleware.formatValue(name, newValue));
    }, [middleware, name, currentValue, constraints.max]);

    const handleStepDown = useCallback(() => {
      const newValue = Math.max((currentValue || 0) - 0.5, constraints.min || -50);
      middleware.setFieldValue(name, newValue);
      setDisplayValue(middleware.formatValue(name, newValue));
    }, [middleware, name, currentValue, constraints.min]);

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

    // Display value comes from middleware formatting
    const valueToDisplay =
      displayValue || (currentValue !== undefined ? middleware.formatValue(name, currentValue) : '');

    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <TextField.Root>
          <TextField.Slot />
          <input
            ref={ref}
            value={valueToDisplay}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={!isEnabled}
            style={{
              textAlign: 'right',
              paddingRight: '60px',
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
            }}
            {...props}
          />
        </TextField.Root>

        {/* Step buttons */}
        <div
          style={{
            position: 'absolute',
            right: '4px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
          }}
        >
          <IconButton
            type="button"
            size="1"
            variant="ghost"
            onClick={handleStepUp}
            disabled={!isEnabled || (currentValue || 0) >= (constraints.max || 50)}
            style={{ height: '18px', width: '24px' }}
          >
            <ChevronUpIcon style={{ height: '12px', width: '12px' }} />
          </IconButton>
          <IconButton
            type="button"
            size="1"
            variant="ghost"
            onClick={handleStepDown}
            disabled={!isEnabled || (currentValue || 0) <= (constraints.min || -50)}
            style={{ height: '18px', width: '24px' }}
          >
            <ChevronDownIcon style={{ height: '12px', width: '12px' }} />
          </IconButton>
        </div>
      </div>
    );
  },
);

InputTemperatureClean.displayName = 'InputTemperatureClean';
