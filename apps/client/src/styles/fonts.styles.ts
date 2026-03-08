import { fontTokens } from '@workspace/design-system/tokens';

import { css } from '@emotion/react';

export const cssFontDefaults = css`
  font-family: ${fontTokens.sans.value};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'kern' 1;
  font-kerning: normal;
`;

export const cssFontMono = css`
  font-family: ${fontTokens.mono.value} !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;
