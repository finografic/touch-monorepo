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
      color: ${colors.successDark};
      border-color: ${colors.successLight};
      background-color: ${colors.successXLight50};
    }

    &[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
      color: ${colors.greyDark};
      &:hover {
        color: ${colors.greyDark};
        border-color: ${colors.greyDark};
        background-color: transparent;
      }
    }
  }

  .button-reset,
  .button-cancel {
    border: ${layout.borderWidth} solid ${colors.warningDark};
    border-radius: 4px;
    background: transparent;
    color: ${colors.warningDark};

    &:hover {
      color: ${colors.warningDark};
      border-color: ${colors.warning};
      background-color: ${colors.warning10};
    }

    &[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
      color: ${colors.greyDark};
      &:hover {
        color: ${colors.greyDark};
        border-color: ${colors.greyDark};
        background-color: transparent;
      }
    }
  }
`;
