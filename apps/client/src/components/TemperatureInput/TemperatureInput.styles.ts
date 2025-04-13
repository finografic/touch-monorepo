import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  .temperature-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .description {
    color: ${colors.text};
    font-size: 1.2rem;
    text-align: center;
    max-width: 400px;
    line-height: 1.6;
    margin-top: -66%;
    padding-bottom: 2rem;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 180px; /* Set fixed width for the container */
  }

  .temp-display {
    display: flex;
    align-items: center;
    border: ${layout.borderWidth} solid ${colors.info};
    border-radius: 8px;
    padding: 1rem 2rem;
    font-size: 2rem;
    color: ${colors.info};
    background: transparent;
    width: 100%;
    justify-content: center;
  }

  .temp-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 44px;
    border: ${layout.borderWidth} solid ${colors.greyDark};
    border-radius: 8px;
    color: ${colors.info};
    font-size: 2rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    background: transparent;
    padding: 0;
    line-height: 1;

    span {
      /* baseline-shift: -1px;
       */
      padding-bottom: 0.15em;
    }

    &:hover:not(:disabled) {
      border-color: ${colors.info};
      transform: scale(1.02);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .unit {
    font-size: 1.5rem;
    color: ${colors.info};
    margin-left: 0.5rem;
  }
`;
