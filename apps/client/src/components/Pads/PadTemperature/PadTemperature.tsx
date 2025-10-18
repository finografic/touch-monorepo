import { useEffect, useState } from 'react';

import type { FC } from 'react';

import type { Temperature } from 'types/orders.types';
import type { TemperatureKey } from 'types/temperature.types';

import { styles } from './PadTemperature.styles';

interface TemperatureInputProps {
  name: TemperatureKey;
  value: number;
  onChange: (name: TemperatureKey, temp: Temperature) => void;
  defaultValue?: number;
  label: string;
  description?: string;
  step?: number;
  min?: number;
  max?: number;
}

export const PadTemperature: FC<TemperatureInputProps> = ({
  name,
  value,
  onChange,
  defaultValue = 25,
  label,
  description,
  step = 0.5,
  min = -10,
  max = 30,
}) => {
  // Initialize with either existing value or default
  const [temperature, setTemperature] = useState<number>(value ?? defaultValue);

  useEffect(() => {
    // Update internal state if external value changes
    if (value !== undefined) {
      setTemperature(value);
    }
  }, [value]);

  const handleTemperatureChange = (newTemp: number) => {
    if (newTemp >= min && newTemp <= max) {
      setTemperature(newTemp);
      onChange(name, { value: newTemp, unit: '°C' });
    }
  };

  return (
    <div css={styles}>
      <div className="temperature-container">
        {label && <label>{label}</label>}
        {description && <p>{description}</p>}
        <div className="input-container">
          <button
            className="control-button"
            onClick={() => handleTemperatureChange(temperature + step)}
            disabled={temperature >= max}
          >
            <span>+</span>
          </button>
          <div className="value-container">
            {temperature.toFixed(1)}
            <span className="unit">°C</span>
          </div>
          <button
            className="control-button"
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
