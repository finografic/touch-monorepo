import { useEffect, useState } from 'react';
import type { FC } from 'react';
import type { Temperature } from 'types/orders.types';
import { styles } from './TemperatureInput.styles';

interface TemperatureInputProps {
  value: number;
  onChange: (temp: Temperature) => void;
  defaultValue?: number;
  label: string;
  step?: number;
  min?: number;
  max?: number;
}

export const TemperatureInput: FC<TemperatureInputProps> = ({
  value,
  onChange,
  defaultValue = 20,
  label,
  step = 0.5,
  min = -10,
  max = 40,
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
      onChange({ value: newTemp, unit: '°C' });
    }
  };

  return (
    <div css={styles}>
      <div className="temperature-container">
        <label>{label}</label>
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
