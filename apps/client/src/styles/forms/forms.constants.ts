import { css } from '@emotion/react';

import { colors } from '../colors/colors.styles';

// ======================================================================== //
// FORM CONFIGURATION - Single source of truth for form styling
// ======================================================================== //

export const forms = {
  inputs: {
    height: '2.5rem', // (orig: 2.5rem) 40px - consistent with Radix default
    padding: '0.5rem 0.5rem 0.5rem 0.75rem',
    transition: 'border-color 150ms ease, box-shadow 150ms ease',
    background: colors.white,

    border: {
      color: colors.greyXXLight75,
      width: '2px',
      radius: '6px',
      focus: {
        color: colors.greyXLight75,
      },
    },

    label: {
      color: colors.textXDark,
      fontSize: '0.9rem',
      fontWeight: 600,
    },

    text: {
      color: colors.textXDark,
      fontSize: '1rem',
      fontWeight: 600,
    },

    placeholder: {
      color: colors.grey,
      opacity: 0.5,
      fontWeight: 500,
      disabled: {
        color: colors.grey,
        opacity: 0.66,
        fontWeight: 500,
      },
    },

    hover: {
      border: {
        color: colors.greyDark,
        width: '1px',
        radius: '6px',
      },
      text: {
        color: colors.text,
        fontSize: '1rem',
        fontWeight: 600,
      },
    },

    focus: {
      border: {
        color: colors.primary,
        width: '1px',
        radius: '6px',
      },
      text: {
        color: colors.text,
        fontSize: '1rem',
        fontWeight: 600,
      },
    },

    disabled: {
      background: colors.greyXXLight,
      border: {
        color: colors.greyLight,
        width: '1px',
        radius: '6px',
      },
      text: {
        color: colors.greyDark,
        fontSize: '1rem',
        fontWeight: 400, // Lighter weight for disabled text
      },
      opacity: 0.6,
    },

    readOnly: {
      background: colors.greyXXLight25,
      border: {
        color: colors.greyLight,
        width: '1px',
        radius: '6px',
      },
      text: {
        color: colors.greyDark,
        fontSize: '1rem',
        fontWeight: 400, // Lighter weight for readonly text
      },
      opacity: 0.8,
    },
  },
  validation: {
    fontSize: '0.875rem',
    fontWeight: 600,
    colors: {
      warning: colors.warningDark,
      error: colors.dangerDark,
    },
  },
} as const;
