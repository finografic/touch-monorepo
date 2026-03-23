import { css } from '@emotion/react';

import { colors } from '@finografic/design-system/tokens';

export const styles = css`
  .loading,
  .error {
    text-align: center;
    padding: 2rem;
  }

  .error {
    color: ${colors.danger};
  }

  .admin-section > .admin-section-content {
    margin-top: 0;
  }
`;
