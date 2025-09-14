import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  .pad-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem;
    margin: 0 auto;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;

    label {
      font-size: 1.5rem;
      font-weight: 500;
      color: ${colors.textLight};
      margin: 0;
    }

    .description {
      font-size: 1.2rem;
      font-weight: 400;
      color: ${colors.text};
      max-width: 500px;
      margin: 0;
    }
  }

  .controls-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    min-width: 200px;
  }

  .control-button {
    width: 100%;
    height: 56px;
    font-size: 1.5rem;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &:not(:disabled) {
      &:hover {
        background-color: ${colors.infoLight33};
      }

      &:active {
        transform: scale(0.98);
      }
    }
  }

  .value-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    min-width: 200px;
    padding: 1rem;
    border: 2px solid ${colors.infoLight40};
    border-radius: 8px;
    background-color: transparent;
    transition: all 0.2s ease;
    gap: 0.5rem;

    &:focus-within {
      border-color: ${colors.infoLight};
      background-color: ${colors.infoXLight25};
    }

    .prefix,
    .suffix {
      font-size: 1.2rem;
      font-weight: 400;
      color: ${colors.info};
    }

    .numeric {
      font-size: 2.5rem;
      font-weight: 500;
      color: ${colors.infoLight};
      text-align: center;
    }
  }
`;
