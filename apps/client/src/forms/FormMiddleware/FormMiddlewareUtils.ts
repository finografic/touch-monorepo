import type { FieldPath, FieldValues } from 'react-hook-form';

import { formatTime, parseTime  } from 'utils/time.utils';

import type { FieldConfig } from './FormMiddleware.types';

// Localization utilities
export const formatTemperatureValue = (value: number, locale: string): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};

// Re-export formatTime for backward compatibility
export const formatTimeValue = formatTime;

export const parseNumericValue = (displayValue: string): number | undefined => {
  const normalizedValue = displayValue.replace(',', '.');
  const parsed = Number.parseFloat(normalizedValue);
  return Number.isNaN(parsed) ? undefined : parsed;
};

// Re-export parseTime for backward compatibility
export const parseTimeValue = (displayValue: string): number | undefined => {
  const result = parseTime(displayValue);
  return result === 0 && displayValue !== '00:00' ? undefined : result;
};

// Field validation utilities
export const isFieldComplete = <T extends FieldValues>(value: any): boolean => {
  return value !== undefined && value !== '' && value !== null;
};

export const generateRandomValue = <T extends FieldValues>(
  fieldConfig: FieldConfig<T>,
  min: number,
  max: number,
): any => {
  switch (fieldConfig.type) {
    case 'temperature': {
      return Math.round((Math.random() * (max - min) + min) * 2) / 2; // Round to 0.5
    }
    case 'time': {
      const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
      return Math.round(randomValue / 30) * 30; // Round to 30 seconds
    }
    case 'number': {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    default:
      return undefined;
  }
};
