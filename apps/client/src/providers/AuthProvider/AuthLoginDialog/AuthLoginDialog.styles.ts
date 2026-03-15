import { css } from '@emotion/react';

import { colors } from '@finografic/design-system/tokens';

export const styles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.25rem;

  .submit-button {
    width: 100%;
    color: ${colors.white};

    &:hover:not(:disabled) {
      background-color: ${colors.infoDark};
      border-color: ${colors.infoDark};
      color: ${colors.white};
    }
  }
  .error {
    color: ${colors.danger};
    font-size: 0.875rem;
    text-align: center;
    padding: 0.5rem;
    background-color: ${colors.dangerLight};
    border-radius: 4px;
    border: 1px solid ${colors.dangerLighter};
  }
`;
