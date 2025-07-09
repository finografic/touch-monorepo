import React, { forwardRef, useCallback, useState } from 'react';
import { IconButton, TextField } from '@radix-ui/themes';
import { ChevronDownIcon, ChevronUpIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useFormContext } from 'react-hook-form';
import { colors } from 'styles';
import { styles } from './InputTemperature.styles';

interface InputTemperatureProps {
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  defaultValue?: number;
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onTemperatureChange?: (temperature: number) => void;
  language?: string; // For localization
}

export const InputTemperature = forwardRef<HTMLInputElement, InputTemperatureProps>(
  (
    {
      min = -50,
      max = 50,
      step = 0.5,
      placeholder = '0',
      disabled = false,
      name,
      defaultValue,
      value,
      onChange,
      onBlur,
      onInput,
      onTemperatureChange,
      language = 'es-ES',
      ...props
    },
    ref,
  ) => {
    const formContext = useFormContext();
    const { setError, clearErrors, trigger, setValue: rhfSetValue } = formContext || {};
    const [isInvalid, setIsInvalid] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');

    // Format temperature with proper localization for display
    function formatTemperature(temp: number, locale: string): string {
      if (Number.isNaN(temp) || temp === undefined || temp === null) return '';

      const rounded = Math.round(temp * 10) / 10;
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(rounded);
    }

    // Validation check with specific message and RHF integration
    const validateTemperature = useCallback(
      (temp: number): { isValid: boolean; message: string } => {
        if (Number.isNaN(temp)) {
          return { isValid: false, message: 'Invalid temperature' };
        }
        if (temp < min) {
          return { isValid: false, message: `Min value is ${formatTemperature(min, language)}` };
        }
        if (temp > max) {
          return { isValid: false, message: `Max value is ${formatTemperature(max, language)}` };
        }
        return { isValid: true, message: '' };
      },
      [min, max, language],
    );

    // Set RHF error for field wrapper to display
    const setValidationError = useCallback(
      (message: string) => {
        if (name && setError && formContext) {
          // First set the error
          setError(name, {
            type: 'validation',
            message: message,
          });

          // Mark field as touched and dirty so warning displays immediately
          if (rhfSetValue) {
            // Get current value and re-set it to mark as touched/dirty
            const currentValue = value ?? defaultValue;
            rhfSetValue(name, currentValue, {
              shouldTouch: true,
              shouldDirty: true,
              shouldValidate: false, // Don't validate again since we just set the error
            });
          }
        }
        setValidationMessage(message);
        setIsInvalid(true);
      },
      [name, setError, formContext, rhfSetValue, value, defaultValue],
    );

    // Clear RHF error
    const clearValidationError = useCallback(() => {
      if (name && clearErrors && formContext) {
        clearErrors(name);
      }
      setValidationMessage('');
      setIsInvalid(false);
    }, [name, clearErrors, formContext]);

    const performStepUp = useCallback(() => {
      if (ref && 'current' in ref && ref.current) {
        const currentValue = Number.parseFloat(ref.current.value || '0');
        const baseValue = Number.isNaN(currentValue) ? 0 : currentValue;
        const newTemp = Math.round((baseValue + step) * 10) / 10;

        if (newTemp <= max) {
          ref.current.value = newTemp.toString();
          // Trigger change event for RHF
          const event = new Event('change', { bubbles: true });
          ref.current.dispatchEvent(event);
          clearValidationError();
        }
      }
    }, [ref, step, max, clearValidationError]);

    const performStepDown = useCallback(() => {
      if (ref && 'current' in ref && ref.current) {
        const currentValue = Number.parseFloat(ref.current.value || '0');
        const baseValue = Number.isNaN(currentValue) ? 0 : currentValue;
        const newTemp = Math.round((baseValue - step) * 10) / 10;

        if (newTemp >= min) {
          ref.current.value = newTemp.toString();
          // Trigger change event for RHF
          const event = new Event('change', { bubbles: true });
          ref.current.dispatchEvent(event);
          clearValidationError();
        }
      }
    }, [ref, step, min, clearValidationError]);

    const handleStepUp = useCallback(() => {
      performStepUp();
    }, [performStepUp]);

    const handleStepDown = useCallback(() => {
      performStepDown();
    }, [performStepDown]);

    // Convert comma to dot for Spanish locales
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Convert comma to dot for proper number parsing
        if (inputValue.includes(',')) {
          e.target.value = inputValue.replace(',', '.');
        }

        clearValidationError();
        onChange?.(e);
      },
      [onChange, clearValidationError],
    );

    // Handle keyboard events
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          performStepUp();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          performStepDown();
        }
      },
      [performStepUp, performStepDown],
    );

    // Handle blur - format display and validate
    const handleInputBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trim();

        if (!inputValue) {
          clearValidationError();
          onBlur?.(e);
          return;
        }

        const parsedTemp = Number.parseFloat(inputValue);
        const validation = validateTemperature(parsedTemp);

        if (validation.isValid) {
          const rounded = Math.round(parsedTemp * 10) / 10;

          // Format the display value with localization (comma for Spanish)
          e.target.value = formatTemperature(rounded, language);
          clearValidationError();

          // Create a change event with the dot notation value for RHF
          const syntheticEvent = {
            ...e,
            target: { ...e.target, value: rounded.toString() },
            currentTarget: { ...e.currentTarget, value: rounded.toString() },
          } as React.ChangeEvent<HTMLInputElement>;

          onChange?.(syntheticEvent);
        } else {
          setValidationError(validation.message);
        }

        onBlur?.(e);
      },
      [language, validateTemperature, onBlur, onChange, setValidationError, clearValidationError],
    );

    // Determine what value to display
    const displayValue = React.useMemo(() => {
      if (value !== undefined) {
        return formatTemperature(value, language);
      }
      if (defaultValue !== undefined) {
        return formatTemperature(defaultValue, language);
      }
      return '';
    }, [value, defaultValue, language]);

    return (
      <div css={styles} className={`input-temperature ${isInvalid ? 'field-warning' : ''}`}>
        <TextField.Root
          className="temperature-input-root"
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          name={name}
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          onInput={onInput}
          ref={ref}
          size="3"
          variant="surface"
          color="gray"
          style={
            {
              '--text-field-color': 'var(--gray-12)',
              'color': 'var(--gray-12)',
              'textAlign': 'right',
            } as React.CSSProperties
          }
          {...props}
        >
          <TextField.Slot side="left">
            {!isInvalid && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '4px' }}>
                <IconButton
                  type="button"
                  variant="soft"
                  size="1"
                  onClick={handleStepUp}
                  disabled={disabled}
                  style={{ height: '16px', width: '20px', minWidth: '20px' }}
                >
                  <ChevronUpIcon style={{ height: '12px', width: '12px' }} />
                </IconButton>
                <IconButton
                  type="button"
                  variant="soft"
                  size="1"
                  onClick={handleStepDown}
                  disabled={disabled}
                  style={{ height: '16px', width: '20px', minWidth: '20px' }}
                >
                  <ChevronDownIcon style={{ height: '12px', width: '12px' }} />
                </IconButton>
              </div>
            )}
            {isInvalid && (
              <span title={validationMessage} style={{ marginLeft: '4px' }}>
                <ExclamationTriangleIcon
                  style={{
                    color: colors.warningDark,
                    height: '16px',
                    width: '16px',
                  }}
                />
              </span>
            )}
          </TextField.Slot>
          <TextField.Slot side="right">
            <span
              style={{
                color: 'var(--gray-11)',
                fontSize: '14px',
                fontWeight: '500',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              C°
            </span>
          </TextField.Slot>
        </TextField.Root>
      </div>
    );
  },
);

InputTemperature.displayName = 'InputTemperature';
