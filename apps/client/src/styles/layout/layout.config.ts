/**
 * Application-specific constants and styles
 * Extends base constants with app-specific values and implementations
 * Contains layout values specific to this application's needs
 */

import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';
import { button } from '../constants/button.constants';
import { border, padding, spacing } from './base.constants';

// Base border styles using button constants
export const cssBorder = css`
  border-color: ${colors.greyXLight};
  border-style: ${button.border.style};
  border-width: ${button.border.width};
`;

// NOTE: LAYOUT [DEFAULT VALUES]
export const layout = {
  fontSize: '1rem',
  padding: padding.default,
  borderWidth: border.width.default,
  borderRadius: border.radius.md, // '0.75rem'
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
