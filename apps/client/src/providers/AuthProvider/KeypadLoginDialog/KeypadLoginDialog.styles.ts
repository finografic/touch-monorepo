import { css } from '@emotion/react';

import { colors } from 'styles';

export const styles = css`
  display: flex;
  flex-direction: column;
  /* gap: 1.5rem;
  gap: 1rem; */
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
    padding: 0.25rem 0 0;
    margin-bottom: 0.1rem;
    border: 1px solid red;
    /* justify-content: center;
    align-items: center; */

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

    .password-input-wrapper {
      position: relative;
      width: 100%;

      .password-input-overlay {
        position: absolute;
        width: 100%;
        color: transparent;
        caret-color: transparent;
        background: transparent;
        border: 2px solid ${colors.grey};
        border-radius: 8px;
        padding: 12px 16px;
        font-size: 16px;
        z-index: 2;
        top: 0;
        left: 0;

        &:focus {
          outline: none;
          border-color: ${colors.info};
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      .password-display-mask {
        position: relative;
        width: 100%;
        pointer-events: none;
        z-index: 1;
        padding: 12px 16px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-family: inherit;
        color: ${colors.text};
        border: 2px solid transparent;
        border-radius: 8px;
        letter-spacing: 0.3em;
      }
    }
  }

  form {
    gap: 0.9rem !important;
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
