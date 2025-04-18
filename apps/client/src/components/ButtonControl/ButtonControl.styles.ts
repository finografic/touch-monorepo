import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  position: relative;
  bottom: 3rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 1rem;

  .controls {
    display: flex;
    gap: 2rem;
  }

  .btn-control {
    cursor: pointer;
    min-width: 150px;
    padding: 0.5rem 1.5rem;
    border: ${layout.borderWidth} solid ${colors.greyDark};
    border-radius: 4px;
    background: transparent;
    color: ${colors.info};
    transition: all 0.2s;

    &:hover {
      border-color: ${colors.info};
      background-color: rgba(0, 191, 255, 0.1);
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
        background-color: rgba(1, 250, 20, 0.1);
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
  }
`;
