import { css } from '@emotion/react';

import { colors } from '@finografic/design-system/tokens';

export const styles = css`
  button {
    margin: 0.2rem 0.33rem 0;
    padding: 0 2rem !important;

    &.button-toggle-key-column,
    &.button-add-new {
      padding: 0 0.5rem !important;
    }
  }

  button.button--outline:disabled {
    color: ${colors.grey};
  }

  margin-top: -4rem;
  margin-bottom: 1rem;
`;
