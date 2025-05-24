import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  .temperature-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    min-width: 340px;
    margin: 0 auto;
  }

  .description {
    color: ${colors.text};
    font-size: 1.2rem;
    text-align: center;
    max-width: 500px;
    line-height: 1.6;
    padding-bottom: 2rem;
  }

  label {
    font-size: 1.5rem;
    font-weight: 500;
    color: ${colors.textLight};
    text-align: center;
    max-width: 500px;
    margin-bottom: 5%;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    width: 180px; /* Set fixed width for the container */
    margin-bottom: 10%;
  }

  .value-container {
    display: flex;
    align-items: center;
    border: ${layout.borderWidth} solid rgba(128, 128, 128, 0.5); /* greyDark at 80% opacity */
    border-radius: 8px;
    padding: 1rem 2rem;
    font-size: 2rem;
    color: ${colors.info};
    background: transparent;
    width: 100%;
    justify-content: center;
  }

  .control-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 64px;
    border: ${layout.borderWidth} solid ${colors.info}99; /* info at 70% opacity */
    border-radius: 8px;
    color: ${colors.info};
    font-size: 2.5rem;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s;
    background: transparent;
    padding: 0;
    line-height: 1;

    span {
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
