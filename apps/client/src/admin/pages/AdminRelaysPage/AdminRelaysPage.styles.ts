import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';

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
