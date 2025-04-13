import { css } from '@emotion/react';
import { colors, layout } from 'styles';
import { useState, useEffect } from 'react';
import type { Temperature } from 'types/orders.types';

interface TemperatureInputProps {
  value: Temperature | null;
  onChange: (temp: Temperature) => void;
  defaultValue?: number;
  description: string;
  step?: number;
  min?: number;
  max?: number;
}

const styles = css`
  .temperature-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .description {
    color: ${colors.text};
    font-size: 1.2rem;
    text-align: center;
    max-width: 400px;
    line-height: 1.6;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 180px; /* Set fixed width for the container */
  }

  .temp-display {
    display: flex;
    align-items: center;
    border: ${layout.borderWidth} solid ${colors.info};
    border-radius: 8px;
    padding: 1rem 2rem;
    font-size: 2rem;
    color: ${colors.info};
    background: transparent;
    width: 100%;
    justify-content: center;
  }

  .temp-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 44px;
    border: ${layout.borderWidth} solid ${colors.greyDark};
    border-radius: 8px;
    color: ${colors.info};
    font-size: 2rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    background: transparent;
    padding: 0;
    line-height: 1;

    span {
      /* baseline-shift: -1px;
       */
      padding-bottom: 0.15em;
    }

    &:hover:not(:disabled) {
      border-color: ${colors.info};
      transform: scale(1.02);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .unit {
    font-size: 1.5rem;
    color: ${colors.info};
    margin-left: 0.5rem;
  }
`;

export const TemperatureInput = ({
  value,
  onChange,
  defaultValue = 20,
  description,
  step = 0.5,
  min = -10,
  max = 40,
}: TemperatureInputProps) => {
  // Initialize with either existing value or default
  const [temperature, setTemperature] = useState<number>(value?.value ?? defaultValue);

  useEffect(() => {
    // Update internal state if external value changes
    if (value?.value !== undefined) {
      setTemperature(value.value);
    }
  }, [value]);

  const handleTemperatureChange = (newTemp: number) => {
    if (newTemp >= min && newTemp <= max) {
      setTemperature(newTemp);
      onChange({ value: newTemp, unit: '°C' });
    }
  };

  return (
    <div css={styles}>
      <div className="temperature-container">
        <p className="description">{description}</p>
        <div className="input-container">
          <button
            className="temp-button"
            onClick={() => handleTemperatureChange(temperature + step)}
            disabled={temperature >= max}
          >
            <span>+</span>
          </button>
          <div className="temp-display">
            {temperature.toFixed(1)}
            <span className="unit">°C</span>
          </div>
          <button
            className="temp-button"
            onClick={() => handleTemperatureChange(temperature - step)}
            disabled={temperature <= min}
          >
            <span>-</span>
          </button>
        </div>
      </div>
    </div>
  );
};
