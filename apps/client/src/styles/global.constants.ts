/**
 * Application-specific constants and styles
 * Extends base constants with app-specific values and implementations
 * Contains layout values specific to this application's needs
 */

import { css } from '@emotion/react';
import { colors } from './colors.styles';
import { baseLayout, button } from './base.constants';

// Base border styles using button constants
export const border = css`
  border-color: ${colors.greyXLight};
  border-style: ${button.border.style};
  border-width: ${button.border.width};
`;

// LAYOUT VARIABLES
export const layout = {
  fontSize: baseLayout.fontSize,
  padding: baseLayout.padding,
  borderWidth: baseLayout.borderWidth,
  borderRadius: baseLayout.borderRadius,
  pageColor: colors.white,
  bgColor: colors.white,
  header: {
    height: '80px',
  },
  footer: {
    height: '80px',
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
