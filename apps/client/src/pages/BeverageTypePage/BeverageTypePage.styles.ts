import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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

  .beverage-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  .beverage-type {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    border: ${layout.borderWidth} solid ${colors.greyDark};
    border-radius: 8px;
    color: ${colors.info};
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s;
    background: transparent;
    padding: 1rem;
    text-align: center;

    &:hover {
      border-color: ${colors.info};
      transform: scale(1.02);
    }

    &.selected {
      border-color: ${colors.info};
      background-color: rgba(0, 191, 255, 0.1);
    }
  }

  .beverage-type.refresco {
    grid-column: 1 / -1;
  }
`;
