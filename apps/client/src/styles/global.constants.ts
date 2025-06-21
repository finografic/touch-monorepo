import { css } from '@emotion/react';
import { colors } from './colors.styles';
import { twLayout } from './tailwind/tailwind.constants';

export const border = css`
  border-color: ${colors.greyXLight};
  border-style: solid;
  border-width: 2px;
`;

// LAYOUT VARIABLES
export const layout = {
  fontSize: twLayout.fontSize,
  padding: twLayout.padding,
  borderWidth: twLayout.borderWidth,
  borderRadius: twLayout.borderRadius,
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
