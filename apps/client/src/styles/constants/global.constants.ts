/**
 * Application-specific constants and styles
 * Extends base constants with app-specific values and implementations
 * Contains layout values specific to this application's needs
 */

import { css } from '@emotion/react';

import { baseLayout, button } from './base.constants';
import { colors } from '../colors/colors-direct';

// Base border styles using button constants
export const border = css`
  border-color: ${colors.greyXLight};
  border-style: ${button.border.style};
  border-width: ${button.border.width};
`;

// LAYOUT VARIABLES
export const layout = {
  fontSize: baseLayout.fontSize.base,
  padding: baseLayout.padding.default,
  borderWidth: baseLayout.borderWidth[2],
  borderRadius: baseLayout.borderRadius.xl, // '0.5rem'
  pageColor: colors.white,
  bgColor: colors.white,
  radius: baseLayout.borderRadius.lg,
  radiusInner: baseLayout.borderRadius.md,
  header: {
    height: '70px',
  },
  footer: {
    height: '70px',
  },
  sidebar: {
    width: '300px',
  },
  navbar: {
    height: '41px',
  },
  drawer: {
    bar: {
      height: '66px',
    },
  },
  imagePreview: {
    height: '300px',
  },
} as const;

export const spacing = {
  0: '0',
  px: '1px',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
} as const;

// Export button constants for easy access
export { button };
