import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  cursor: pointer;
  min-width: 150px;
  padding: 0.5rem 1.5rem;
  border: ${layout.borderWidth} solid ${colors.greyDark};
  border-radius: 4px;
  transition: all 0.2s;

  color: ${colors.info};
  border-color: ${colors.infoDark}bb;
  background: transparent;

  &:hover {
    color: ${colors.info};
    border-color: ${colors.info};
    background-color: ${colors.info}11;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      border-color: ${colors.greyDark};
      background-color: transparent;
    }
  }

  &.btn-start {
    border: ${layout.borderWidth} solid ${colors.success};
    border-radius: 4px;
    background: transparent;
    color: ${colors.success};

    &:hover {
      border-color: ${colors.successLight};
      background-color: ${colors.successLight}88;
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
