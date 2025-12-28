import { css } from '@emotion/react';

import { colors } from 'styles';

export const styles = css`
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.white};
  color: ${colors.text};

  .rt-TabsTriggerInner {
    text-transform: capitalize;
  }
`;
