import { css } from '@emotion/react';
import { colors, layout } from 'styles';
import { stylesButtonBase } from 'styles/project/buttons.styles';

export const styles = css`
  ${stylesButtonBase}
  cursor: pointer;
  min-width: 150px;
  padding: 0.5rem 1.5rem;
  border: ${layout.borderWidth} solid ${colors.greyDark};
  border-radius: 4px;
  transition: all 0.2s;

  color: ${colors.info};
  border-color: ${colors.infoDark95};
  background: transparent;

  &:hover {
    color: ${colors.info};
    border-color: ${colors.info};
    background-color: ${colors.info10};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      border-color: ${colors.greyDark};
      background-color: transparent;
    }
  }
  /*
  .small-button,
  .button-start,
  .btn-start {
    display: none;
  }

  &.small-button,
  &.button-start,
  &.btn-start {
    display: none;
  } */

  &.button-start,
  &.btn-start {
    /* border-radius: 4px; */
    /* background: transparent; */
    color: ${colors.success};

    color: ${colors.defaultLight80};
    border-color: ${colors.defaultLight80};

    display: none;

    &:hover {
      border-color: ${colors.successLight};
      background-color: ${colors.successLight80};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        border-color: ${colors.greyDark};
        background-color: transparent;
      }
    }
  }
`;
