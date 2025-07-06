import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { IconButton, TextField } from '@radix-ui/themes';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

interface TimeInputProps {
  min?: number; // in seconds
  max?: number; // in seconds
  step?: number; // in seconds, default 30 seconds
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  defaultValue?: number; // in seconds
  value?: number; // in seconds
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
}

export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  (
    {
      min = 0,
      max = 3600, // 60 minutes default
      step = 30, // 30 seconds default
      placeholder = '00:00',
      disabled = false,
      name,
      defaultValue = 0,
      value,
      onChange,
      onBlur,
      onInput,
      ...props
    },
    ref,
  ) => {
    // Convert seconds to mm:ss format
    const formatTime = useCallback((seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    // Convert mm:ss format to seconds
    const parseTime = useCallback((timeString: string): number => {
      if (!timeString || !timeString.includes(':')) return 0;
      const [mins, secs] = timeString.split(':').map(Number);
      if (Number.isNaN(mins) || Number.isNaN(secs)) return 0;
      return mins * 60 + secs;
    }, []);

    // Local state for display value
    const [displayValue, setDisplayValue] = useState(() => formatTime(defaultValue));

    // Sync with external value changes
    useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(formatTime(value));
      }
    }, [value, formatTime]);

    const handleStepUp = useCallback(() => {
      log('__DEV: UP', 'grey', ref);
      if (ref && 'current' in ref && ref.current && onChange) {
        // log('__DEV: UP', 'grey', ref.current.value);
        // log('__DEV: UP', 'grey');
        const currentValue = Number.parseInt(ref.current.value, 10) || 0;

        // log('__DEV: UP', 'lime', { currentValue });

        const newValue = Math.min(currentValue + step, max);

        // log('__DEV: DOWN', 'lime', { currentValue, newValue });

        // Update hidden input and display
        ref.current.value = newValue.toString();
        setDisplayValue(formatTime(newValue));

        const syntheticEvent = {
          target: ref.current,
          currentTarget: ref.current,
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    }, [ref, step, max, onChange, formatTime]);

    const handleStepDown = useCallback(() => {
      log('__DEV: DOWN', 'grey');
      if (ref && 'current' in ref && ref.current && onChange) {
        // log('__DEV: DOWN', 'grey', ref.current.value);
        // log('__DEV: DOWN', 'grey');
        const currentValue = Number.parseInt(ref.current.value, 10) || 0;

        // log('__DEV: DOWN', 'yellow', { currentValue });

        const newValue = Math.max(currentValue - step, min);

        // log('__DEV: DOWN', 'yellow', { currentValue, newValue });

        // Update hidden input and display
        ref.current.value = newValue.toString();
        setDisplayValue(formatTime(newValue));

        const syntheticEvent = {
          target: ref.current,
          currentTarget: ref.current,
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    }, [ref, step, min, onChange, formatTime]);

    // Handle direct input (user typing mm:ss)
    const handleDisplayChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setDisplayValue(inputValue);

        // If it's a valid mm:ss format, update the hidden input
        if (inputValue.match(/^\d{1,2}:\d{2}$/)) {
          const seconds = parseTime(inputValue);
          if (seconds >= min && seconds <= max && ref && 'current' in ref && ref.current) {
            // log('__DEV: UP', 'lime', ref.current.value);
            ref.current.value = seconds.toString();
            if (onChange) {
              const syntheticEvent = {
                target: ref.current,
                currentTarget: ref.current,
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(syntheticEvent);
            }
          }
        }
      },
      [ref, parseTime, min, max, onChange],
    );

    return (
      <div style={{ position: 'relative' }}>
        {/* Hidden input for React Hook Form - stores seconds */}
        <input
          type="number"
          ref={ref}
          name={name}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onInput={onInput}
          // style={{ display: 'none' }}
          {...props}
        />

        {/* Visible input for mm:ss display */}
        <TextField.Root
          type="text"
          placeholder={placeholder}
          // disabled={disabled}
          value={displayValue}
          onChange={handleDisplayChange}
          size="3"
          variant="surface"
          color="gray"
          style={
            {
              '--text-field-color': 'var(--gray-12)',
              'color': 'var(--gray-12)',
            } as React.CSSProperties
          }
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
                marginLeft: '4px',
              }}
            >
              mm:ss
            </span>
          </TextField.Slot>
        </TextField.Root>
      </div>
    );
  },
);

TimeInput.displayName = 'TimeInput';
