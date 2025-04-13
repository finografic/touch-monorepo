import { styles } from './TemperatureInput.styles';
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

export const TemperatureInput: React.FC<TemperatureInputProps> = ({
  value,
  onChange,
  defaultValue = 20,
  description,
  step = 0.5,
  min = -10,
  max = 40,
}) => {
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
