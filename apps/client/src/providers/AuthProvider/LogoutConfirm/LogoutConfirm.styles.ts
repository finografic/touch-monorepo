import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';

export const styles = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 1.25rem;
  overflow: hidden;

  height: 180px;

  .form-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    gap: 1.5rem;
    height: 180px;

    .subtitle {
      margin-top: 1rem;
      text-align: center;
    }
  }

  .submit-button {
    width: 100%;
    color: ${colors.white};

    &:hover:not(:disabled) {
      background-color: ${colors.infoDark75};
      border-color: ${colors.infoDark75};
      color: ${colors.white};
    }
  }

  form {
    gap: 1.1rem;
  }
`;
