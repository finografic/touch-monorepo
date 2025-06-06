export const dateFormats = {
  short: {
    en: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
    es: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  },
  long: {
    en: {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
    es: {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  },
} as const;

export const numberFormats = {
  currency: {
    en: {
      style: 'currency',
      currency: 'USD',
    },
    es: {
      style: 'currency',
      currency: 'EUR',
    },
  },
  decimal: {
    en: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    es: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
} as const;
