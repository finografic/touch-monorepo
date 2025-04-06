import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${colors.background};
  color: ${colors.white};
  padding: 2rem;

  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: ${colors.info};
  }

  .selected-pads {
    color: ${colors.text};
    margin-bottom: 2rem;
  }

  .controls {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
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
