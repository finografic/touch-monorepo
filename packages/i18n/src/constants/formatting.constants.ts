import type { RegionLocale } from 'config';
import type { I18nDateFormat, I18nNumberFormat } from 'types/i18n.types';

// Date and number formatting configurations (keep here - app-specific formatting rules)
export const dateFormats: Record<RegionLocale, I18nDateFormat> = {
  'es-ES': {
    short: 'dd/MM/yyyy',
    long: 'dd MMMM yyyy',
    time: 'HH:mm',
    dateTime: 'dd/MM/yyyy HH:mm',
  },
  'en-GB': {
    short: 'dd/MM/yyyy',
    long: 'dd MMMM yyyy',
    time: 'HH:mm',
    dateTime: 'dd/MM/yyyy HH:mm',
  },
  'ca-ES': {
    short: 'dd/MM/yyyy',
    long: 'dd MMMM yyyy',
    time: 'HH:mm',
    dateTime: 'dd/MM/yyyy HH:mm',
  },
} as const;

export const numberFormats: Record<RegionLocale, I18nNumberFormat> = {
  'es-ES': {
    decimal: ',',
    thousands: '.',
    currency: 'EUR',
  },
  'en-GB': {
    decimal: '.',
    thousands: ',',
    currency: 'GBP',
  },
  'ca-ES': {
    decimal: ',',
    thousands: '.',
    currency: 'EUR',
  },
} as const;
