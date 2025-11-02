import { css } from '@emotion/react';

import { colors } from 'styles';

export const styles = css`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  margin-top: 1.25rem;

  .submit-button {
    width: 100%;
    color: ${colors.white};

    &:hover:not(:disabled) {
      background-color: ${colors.infoDark75};
      border-color: ${colors.infoDark75};
      color: ${colors.white};
    }
  }
  .error {
    color: ${colors.danger};
    font-size: 0.875rem;
    text-align: center;
    padding: 0.5rem;
    background-color: ${colors.danger25};
    border-radius: 4px;
    border: 1px solid ${colors.danger25};
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;

    .label {
      font-size: 0.875rem;
      font-weight: 500;
      color: ${colors.text};

      .hint {
        font-weight: 400;
        color: ${colors.grey};
        margin-left: 0.5rem;
        font-size: 0.75rem;
      }
    }
  }
`;

export const keypadStyles = css`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 0 auto;

  .keypad-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    /* grid-template-rows: repeat(4, 1fr); */
    gap: 0.8rem;
    width: 100%;
    max-width: 300px;

    .keypad-button {
      aspect-ratio: 1;
      min-height: 60px;
      min-height: 70px;
      font-size: 1.25rem;
      font-weight: 600;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      &:active:not(:disabled) {
        transform: scale(0.95);
        transition: transform 0.1s ease;
      }

      &.keypad-button-backspace {
        font-size: 1.5rem;
        font-weight: 400;
      }

      &.keypad-button-empty {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }
  }
`;
