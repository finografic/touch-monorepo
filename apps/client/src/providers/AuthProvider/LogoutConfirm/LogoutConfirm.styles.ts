import { css } from '@emotion/react';

import { colorsDirect as colors } from 'styles';

export const styles = css`
  display: flex;
  justify-content: center;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.25rem;

  > div {
    .subtitle {
      color: ${colors.textLight};
      font-size: 1.1em;
      font-weight: 400;
      text-align: center;
      margin: 1.33rem;
    }
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    min-height: 160px;
    overflow: hidden;
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

  .button {
    &.button--full-width {
      width: 100%;
    }
  }

  .error {
    color: ${colors.danger};
    font-size: 0.875rem;
    text-align: center;
    padding: 0.5rem;
    background-color: ${colors.danger25};
    border-radius: 4px;
    border: 1px solid ${colors.danger25};
  }
`;
