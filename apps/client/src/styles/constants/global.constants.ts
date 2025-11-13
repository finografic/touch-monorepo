/**
 * Application-specific constants and styles
 * Extends base constants with app-specific values and implementations
 * Contains layout values specific to this application's needs
 */

import { css } from '@emotion/react';

import { colors } from '../colors/colors-direct';
import { baseLayout, border } from './base.constants';
import { button } from './button.constants';
import { typography } from './typography.constants';

// Base border styles using button constants
export const cssBorder = css`
  border-color: ${colors.greyXLight};
  border-style: ${button.border.style};
  border-width: ${button.border.width};
`;

// LAYOUT VARIABLES
export const layout = {
  fontSize: typography.fontSize.base,
  padding: baseLayout.padding.default,
  borderWidth: border.width.default,
  borderRadius: border.radius.default, // '0.75rem'
  pageColor: colors.white,
  bgColor: colors.white,
  radius: border.radius.sm,
  radiusInner: border.radius.xs,
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

// Re-export from base.constants for convenience
export { border };

// Re-export spacing for convenience
export const spacing = baseLayout.spacing;

// Export button constants for easy access
export { button };
