import { css } from '@emotion/react';

import { colors } from 'styles';

export const styles = css`
  .loading,
  .error {
    text-align: center;
    padding: 2rem;
  }

  .error {
    color: ${colors.danger};
  }
`;
