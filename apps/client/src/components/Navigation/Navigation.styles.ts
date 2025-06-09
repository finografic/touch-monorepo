import { css } from '@emotion/react';
import { colors, layout } from 'styles';
import { stylesNavButton } from 'styles/custom/buttons.styles';

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

  .nav-button {
    ${stylesNavButton}
  }

  .nav-button-start {
    border: ${layout.borderWidth} solid ${colors.success};
    border-radius: 4px;
    background: transparent;
    color: ${colors.success};

    &:hover {
      border-color: ${colors.successLight};
      background-color: ${colors.successLight}11;
    }

    &[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        color: ${colors.greyDark};
        border-color: ${colors.greyDark};
        background-color: transparent;
      }
    }
  }
`;
