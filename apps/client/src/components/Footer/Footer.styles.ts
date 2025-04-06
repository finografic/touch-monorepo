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

  .control-btn {
    padding: 0.5rem 1.5rem;
    border: ${layout.borderWidth} solid ${colors.greyDark};
    border-radius: 4px;
    background: transparent;
    color: ${colors.info};
    cursor: pointer;
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
  }
`;
