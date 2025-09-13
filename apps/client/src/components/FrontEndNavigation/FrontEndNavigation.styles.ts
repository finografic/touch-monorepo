import { css } from '@emotion/react';
import { colors, layout } from 'styles';
import { stylesSmallButton } from 'styles/project/buttons.styles';

export const styles = css`
  width: 100%;

  .nav-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .nav-root {
    width: fit-content;
  }

  .nav-list {
    display: flex;
    gap: 1rem;
    list-style: none;
    margin: 0;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background: transparent;
    justify-content: center;
    align-items: center;
  }

  .nav-item {
    position: relative;
    display: flex;
    justify-content: center;
  }

  .small-button,
  .small-button {
    ${stylesSmallButton}
  }

  .button-start {
    color: ${colors.successLight};
    border-color: ${colors.successLight};
    background: transparent;

    &:hover {
      color: ${colors.success};
      border-color: ${colors.success};
      background-color: ${colors.successXLight50};
    }

    &[data-disabled] {
      cursor: not-allowed;
      color: ${colors.greyXLight};
      &:hover {
        color: ${colors.greyXLight};
        border-color: ${colors.greyXLight};
        background-color: transparent;
      }
    }
  }

  .button-reset,
  .button-cancel {
    border-radius: 4px;
    background: transparent;
    border: ${layout.borderWidth} solid ${colors.warningLight};
    color: ${colors.warningLight};

    &:hover {
      color: ${colors.warning};
      border-color: ${colors.warning};
      background-color: ${colors.warning10};
    }

    &[data-disabled] {
      cursor: not-allowed;
      color: ${colors.greyXLight};
      &:hover {
        color: ${colors.greyXLight};
        border-color: ${colors.greyXLight};
        background-color: transparent;
      }
    }
  }
`;
