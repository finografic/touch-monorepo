import type { FieldPath, FieldValues } from 'react-hook-form';
import type { FieldConfig } from './FormMiddleware.types';

// Localization utilities
export const formatTemperatureValue = (value: number, locale: string): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatTimeValue = (value: number): string => {
  const mins = Math.floor(value / 60);
  const secs = value % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const parseNumericValue = (displayValue: string): number | undefined => {
  const normalizedValue = displayValue.replace(',', '.');
  const parsed = Number.parseFloat(normalizedValue);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const parseTimeValue = (displayValue: string): number | undefined => {
  if (displayValue.includes(':')) {
    const [mins, secs] = displayValue.split(':').map(Number);
    if (!Number.isNaN(mins) && !Number.isNaN(secs)) {
      return mins * 60 + secs;
    }
  }
  return undefined;
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
