import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { formatTimeDisplay, isValidTimeInSeconds } from 'constants/time.config';
import { styles } from './TimeInput.styles';

export type TimeUnit = 'minutes' | 'seconds';

interface TimeInputProps {
  unit: TimeUnit;
  value: number; // Always in seconds for the total time
  onChange: (newTotalSeconds: number) => void;
  label: string;
  description: string;
  min?: number; // Minimum total seconds
  max?: number; // Maximum total seconds
  step?: number; // Step for this specific unit
}

export const TimeInput: FC<TimeInputProps> = ({
  unit,
  value: totalSeconds,
  onChange,
  label,
  description,
  min = 1,
  max = 300,
  step = 1,
}) => {
  // Calculate display value based on unit
  const getDisplayValue = () => {
    if (unit === 'minutes') {
      return Math.floor(totalSeconds / 60);
    }
    return totalSeconds % 60;
  };

  const [displayValue, setDisplayValue] = useState<number>(getDisplayValue());

  useEffect(() => {
    setDisplayValue(getDisplayValue());
  }, [totalSeconds, unit]);

  const handleChange = (newDisplayValue: number) => {
    let newTotalSeconds: number;

    if (unit === 'minutes') {
      // Keep current seconds, update minutes
      const currentSeconds = totalSeconds % 60;
      newTotalSeconds = newDisplayValue * 60 + currentSeconds;
    } else {
      // Keep current minutes, update seconds
      const currentMinutes = Math.floor(totalSeconds / 60);
      newTotalSeconds = currentMinutes * 60 + newDisplayValue;
    }

    // Validate the new total
    if (isValidTimeInSeconds(newTotalSeconds) && newTotalSeconds >= min && newTotalSeconds <= max) {
      setDisplayValue(newDisplayValue);
      onChange(newTotalSeconds);
    }
  };

  const getMinValue = () => {
    if (unit === 'minutes') return 0;
    return 0;
  };

  const getMaxValue = () => {
    if (unit === 'minutes') return Math.floor(max / 60);
    return 59; // Max seconds is always 59
  };

  const canIncrement = () => {
    if (unit === 'minutes') {
      const newTotal = totalSeconds + 60;
      return newTotal <= max;
    } else {
      const newTotal = totalSeconds + 1;
      return newTotal <= max && displayValue < 59;
    }
  };

  const canDecrement = () => {
    if (unit === 'minutes') {
      const newTotal = totalSeconds - 60;
      return newTotal >= min;
    } else {
      const newTotal = totalSeconds - 1;
      return newTotal >= min && displayValue > 0;
    }
  };

  return (
    <div css={styles}>
      <div className="time-container">
        <label>{label}</label>
        <p>{description}</p>
        <div className="input-container">
          <button
            className="control-button"
            onClick={() => handleChange(displayValue + (unit === 'minutes' ? 1 : 1))}
            disabled={!canIncrement()}
          >
            <span>+</span>
          </button>
          <div className="value-container">
            {String(displayValue).padStart(2, '0')}
            <span className="unit">{unit === 'minutes' ? 'Min' : 'Seg'}</span>
          </div>
          <button
            className="control-button"
            onClick={() => handleChange(displayValue - (unit === 'minutes' ? 1 : 1))}
            disabled={!canDecrement()}
          >
            <span>-</span>
          </button>
        </div>
        <div className="total-display">Total: {formatTimeDisplay(totalSeconds)}</div>
      </div>
    </div>
  );
};
