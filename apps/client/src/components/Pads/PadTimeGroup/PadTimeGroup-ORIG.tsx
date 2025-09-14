import { useCallback } from 'react';
import type { FC } from 'react';
import { formatTimeDisplay, isValidTimeInSeconds } from 'constants/time.config';
import { styles } from './PadTimeGroup.styles';

interface TimeInputGroupProps {
  value: number; // Total seconds
  onChange: (newTotalSeconds: number) => void;
  description?: string;
  min?: number;
  max?: number;
}

export const PadTimeGroup: FC<TimeInputGroupProps> = ({
  value: totalSeconds,
  onChange,
  description,
  min = 1,
  max = 300,
}) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const handleMinutesChange = useCallback(
    (newMinutes: number) => {
      const newTotalSeconds = newMinutes * 60 + seconds;
      if (isValidTimeInSeconds(newTotalSeconds) && newTotalSeconds >= min && newTotalSeconds <= max) {
        onChange(newTotalSeconds);
      }
    },
    [seconds, onChange, min, max],
  );

  const handleSecondsChange = useCallback(
    (newSeconds: number) => {
      const newTotalSeconds = minutes * 60 + newSeconds;
      if (isValidTimeInSeconds(newTotalSeconds) && newTotalSeconds >= min && newTotalSeconds <= max) {
        onChange(newTotalSeconds);
      }
    },
    [minutes, onChange, min, max],
  );

  const canIncrementMinutes = () => {
    const newTotal = totalSeconds + 60;
    return newTotal <= max;
  };

  const canDecrementMinutes = () => {
    const newTotal = totalSeconds - 60;
    return newTotal >= min;
  };

  const canIncrementSeconds = () => {
    const newTotal = totalSeconds + 1;
    return newTotal <= max && seconds < 59;
  };

  const canDecrementSeconds = () => {
    const newTotal = totalSeconds - 1;
    return newTotal >= min && seconds > 0;
  };

  return (
    <div css={styles}>
      <div className="time-group-container">
        {description && <p className="description">{description}</p>}

        <div className="inputs-container">
          {/* Minutes Input */}
          <div className="time-input">
            <label>Minutos</label>

            <div className="input-container">
              <button
                className="control-button"
                onClick={() => handleMinutesChange(minutes + 1)}
                disabled={!canIncrementMinutes()}
              >
                <span>+</span>
              </button>

              <div className="value-container">
                <span className="value">{String(minutes).padStart(2, '0')}</span>
                <span className="unit">Min</span>
              </div>

              <button
                className="control-button"
                onClick={() => handleMinutesChange(minutes - 1)}
                disabled={!canDecrementMinutes()}
              >
                <span>-</span>
              </button>
            </div>
          </div>

          {/* Seconds Input */}
          <div className="time-input">
            <label>Segundos</label>

            <div className="input-container">
              <button
                className="control-button"
                onClick={() => handleSecondsChange(seconds + 1)}
                disabled={!canIncrementSeconds()}
              >
                <span>+</span>
              </button>

              <div className="value-container">
                <span className="value">{String(seconds).padStart(2, '0')}</span>
                <span className="unit">Seg</span>
              </div>

              <button
                className="control-button"
                onClick={() => handleSecondsChange(seconds - 1)}
                disabled={!canDecrementSeconds()}
              >
                <span>-</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
