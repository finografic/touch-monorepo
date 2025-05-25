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

    label {
      font-size: 1.5rem;
      font-weight: 500;
      color: ${colors.textLight};
      text-align: center;
      max-width: 500px;
      margin: 0;
      padding: 0;
    }

    p {
      font-size: 1.2rem;
      font-weight: 400;
      color: ${colors.text};
      text-align: center;
      max-width: 320px;
      margin: 0;
      /* padding: 0; */
    }
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
    border-radius: 8px;
    padding: 1rem 2rem;
    font-size: 2rem;
    background: transparent;
    width: 100%;
    justify-content: center;
    border: ${layout.borderWidth} solid ${colors.greyXXDark}; /* greyDark at 80% opacity */
    color: ${colors.info};
  }

  .control-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 64px;
    border-radius: 8px;
    font-size: 2.5rem;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s;
    background: transparent;
    padding: 0;
    line-height: 1;
    border: ${layout.borderWidth} solid ${colors.info};
    color: ${colors.info};

    span {
      padding-bottom: 0.15em;
    }

    &:hover:not(:disabled) {
      transform: scale(1.02);
      border-color: ${colors.info};
      color: ${colors.info};
      background-color: ${colors.info}11;
    }

    &:disabled {
      cursor: not-allowed;
      background-color: transparent;
      border-color: ${colors.greyXDark};
      color: ${colors.greyXDark};
    }
  }

  .unit {
    font-size: 1.5rem;
    color: ${colors.info};
    margin-left: 0.5rem;
  }
`;
