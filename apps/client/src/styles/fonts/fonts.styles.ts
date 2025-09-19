import { css } from '@emotion/react';
import { typography } from '../constants/base.constants';

export const cssFontDefaults = css`
  font-family: ${typography.fontFamily.sans.join(', ')} !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'kern' 1;
  font-kerning: normal;
`;

export const cssFontMono = css`
  font-family: ${typography.fontFamily.mono.join(', ')};
  ${css(typography.fontSmoothing.antialiased)}
`;
