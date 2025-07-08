import React, { forwardRef, useCallback } from 'react';
import { IconButton, TextField } from '@radix-ui/themes';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
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
}

export const InputTemperature = forwardRef<HTMLInputElement, InputTemperatureProps>(
  (
    {
      min,
      max,
      step = 0.5,
      placeholder = '0',
      disabled = false,
      name,
      defaultValue,
      value,
      onChange,
      onBlur,
      onInput,
      ...props
    },
    ref,
  ) => {
    const handleStepUp = useCallback(() => {
      if (ref && 'current' in ref && ref.current && onChange) {
        const currentValue = Number.parseFloat(ref.current.value) || 0;
        const newValue = currentValue + step;

        // Check max boundary
        if (max !== undefined && newValue > max) return;

        // Update the input value and trigger onChange for RHF
        ref.current.value = newValue.toString();
        const syntheticEvent = {
          target: ref.current,
          currentTarget: ref.current,
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    }, [ref, step, max, onChange]);

    const handleStepDown = useCallback(() => {
      if (ref && 'current' in ref && ref.current && onChange) {
        const currentValue = Number.parseFloat(ref.current.value) || 0;
        const newValue = currentValue - step;

        // Check min boundary
        if (min !== undefined && newValue < min) return;

        // Update the input value and trigger onChange for RHF
        ref.current.value = newValue.toString();
        const syntheticEvent = {
          target: ref.current,
          currentTarget: ref.current,
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    }, [ref, step, min, onChange]);

    // Show placeholder when value is undefined or empty
    const shouldShowPlaceholder = value === undefined || value === null || Number.isNaN(value);
    const displayValue = shouldShowPlaceholder ? undefined : value;

    return (
      <div css={styles} className="input-temperature">
        <TextField.Root
          className="temperature-input-root"
          type="number"
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          name={name}
          defaultValue={defaultValue}
          value={displayValue}
          onChange={onChange}
          onBlur={onBlur}
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
