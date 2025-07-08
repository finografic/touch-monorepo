import React, { useCallback, useEffect, useState } from 'react';
import { IconButton, TextField } from '@radix-ui/themes';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { styles } from './InputTime.styles';

interface InputTimeProps {
  value?: number; // in seconds
  defaultValue?: number; // in seconds
  min?: number; // in seconds
  max?: number; // in seconds
  step?: number; // in seconds, default 30 seconds
  disabled?: boolean;
  onTimeChange: (seconds: number) => void;
}

export const InputTime: React.FC<InputTimeProps> = ({
  value,
  defaultValue = 0,
  min = 0,
  max = 3600, // 60 minutes default
  step = 30, // 30 seconds default
  disabled = false,
  onTimeChange,
}) => {
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

  // Check if we should show placeholder (when value is undefined)
  const shouldShowPlaceholder = value === undefined;
  const currentSeconds = shouldShowPlaceholder ? 0 : (value ?? defaultValue);

  // Local state for display value
  const [displayValue, setDisplayValue] = useState(() => {
    return shouldShowPlaceholder ? '' : formatTime(currentSeconds);
  });

  // Sync display when external value changes
  useEffect(() => {
    if (shouldShowPlaceholder) {
      setDisplayValue(''); // Empty string shows placeholder
    } else {
      setDisplayValue(formatTime(currentSeconds));
    }
  }, [value, currentSeconds, formatTime, shouldShowPlaceholder]);

  const handleStepUp = useCallback(() => {
    const baseValue = value ?? 0; // Start from 0 if undefined
    const newValue = Math.min(baseValue + step, max);
    setDisplayValue(formatTime(newValue));
    onTimeChange(newValue);
  }, [value, step, max, formatTime, onTimeChange]);

  const handleStepDown = useCallback(() => {
    const baseValue = value ?? 0; // Start from 0 if undefined
    const newValue = Math.max(baseValue - step, min);
    setDisplayValue(formatTime(newValue));
    onTimeChange(newValue);
  }, [value, step, min, formatTime, onTimeChange]);

  // Handle user typing mm:ss format
  const handleDisplayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setDisplayValue(inputValue);

      // If it's a valid mm:ss format, convert to seconds
      if (inputValue.match(/^\d{1,2}:\d{2}$/)) {
        const seconds = parseTime(inputValue);
        if (seconds >= min && seconds <= max) {
          onTimeChange(seconds);
        }
      }
    },
    [parseTime, min, max, onTimeChange],
  );

  // Handle formatting on blur (transform digits to mm:ss)
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.trim();

      // If empty, keep it empty to show placeholder
      if (!inputValue) {
        setDisplayValue('');
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
        const seconds = parseTime(formattedValue);
        if (seconds >= min && seconds <= max) {
          setDisplayValue(formattedValue);
          onTimeChange(seconds);
        } else {
          // Invalid time, revert to previous valid value or empty
          if (value !== undefined) {
            setDisplayValue(formatTime(value));
          } else {
            setDisplayValue('');
          }
        }
      }
    },
    [value, formatTime, parseTime, min, max, onTimeChange],
  );

  return (
    <div css={styles} className="input-time">
      <TextField.Root
        className="time-input-root"
        type="text"
        placeholder="mm:ss"
        disabled={disabled}
        value={displayValue}
        onChange={handleDisplayChange}
        onBlur={handleBlur}
        color="gray"
        size="3"
        variant="surface"
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
        {/* <TextField.Slot side="right">
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
        </TextField.Slot> */}
      </TextField.Root>
    </div>
  );
};

InputTime.displayName = 'InputTime';
