import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { InputNumber } from 'primereact/inputnumber';

import { DEFAULT_TEMP_MAX, DEFAULT_TEMP_MIN, TEMP_STEP } from '../FormMiddleware/FormMiddleware.constants';

interface TemperatureInputFieldProps {
  name: string;
  locale?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (value: number | null) => void;
}

/**
 * Reusable PrimeReact-based temperature input component
 *
 * Features:
 * - Automatic locale formatting (Spanish: "25,0" vs English: "25.0")
 * - Spinner buttons for easy increment/decrement
 * - Min/max constraints with validation
 * - Integrates with React Hook Form via Controller
 * - Displays °C suffix
 *
 * @example
 * // Basic usage
 * <TemperatureInputField name="temperature" locale="es-ES" />
 *
 * @example
 * // With dynamic constraints
 * <TemperatureInputField
 *   name="freezeTemp"
 *   locale="es-ES"
 *   min={-50}
 *   max={consumeTemp - 5}
 * />
 */
export const TemperatureInputField: React.FC<TemperatureInputFieldProps> = ({
  name,
  locale = 'es-ES',
  min = DEFAULT_TEMP_MIN,
  max = DEFAULT_TEMP_MAX,
  step = TEMP_STEP,
  disabled = false,
  placeholder = 'Temperature',
  onChange,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="p-inputgroup">
          <InputNumber
            id={field.name}
            value={field.value}
            onValueChange={(e) => {
              field.onChange(e.value);
              if (onChange) {
                onChange(e.value);
              }
            }}
            locale={locale}
            showButtons
            buttonLayout="stacked"
            step={step}
            min={min}
            max={max}
            minFractionDigits={1}
            maxFractionDigits={1}
            placeholder={placeholder}
            disabled={disabled}
            style={{ width: '100%' }}
          />
          <span className="p-inputgroup-addon">°C</span>
        </div>
      )}
    />
  );
};

