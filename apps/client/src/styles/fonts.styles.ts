import { css } from '@emotion/react';
import { colors } from './colors.styles';
import { typography } from './constants/base.constants';

const { fontFamily: twFontFamily, fontSmoothing: twFontSmoothing, fontWeight: twFontWeight } = typography;

export const cssFontDefaults = css`
  font-family: ${twFontFamily.sans.join(', ')};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'kern' 1;
  font-kerning: normal;
`;

export const cssFontMono = css`
  font-family: ${twFontFamily.mono.join(', ')};
  ${css(twFontSmoothing.antialiased)}
`;

export const cssLabels = css`
  display: inline-block;
  font-weight: ${twFontWeight.bold};
  letter-spacing: 0;
  color: ${colors.primaryDark};
  margin: 0.5em 0.5em 0.7em 0.1em;
  span {
    // NOTE: REMOVED: - 2024-04-14
    /* opacity: 0.66; */
  }
`;
