import { css } from '@emotion/react';

import { button, colors } from 'styles';
import { forms } from 'styles/forms/forms.styles';

export const styles = css`
  display: flex;
  flex-direction: column;
  /* gap: 1.5rem;
  gap: 1rem; */
  justify-content: center;
  align-items: center;
  margin-top: 1.25rem;

  overflow: hidden;

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
        pointer-events: none;
        user-select: none;
        border-radius: 8px;
        padding: 12px 16px;
        font-size: 16px;
        z-index: 2;
        top: 0;
        left: 0;

        &:focus {
          outline: none;
          border-color: ${colors.info};
          /* box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); */
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      input#password {
        min-height: 54px !important;
        pointer-events: none;
        user-select: none;
        text-align: center !important;

        color: transparent !important;
        /* color: ${colors.greyXLight} !important; */
        border: ${forms.inputs.border.width} solid ${colors.grey};
        background-color: transparent;

        &:empty {
          border: ${forms.inputs.border.width} solid ${colors.greyXXLight75};
          background-color: transparent;
        }

        &:not(:empty) {
          border: ${forms.inputs.border.width} solid ${colors.grey};
          background-color: transparent;
        }

        &:active:not(:disabled) {
          border: ${forms.inputs.border.width} solid ${colors.info};
          background-color: transparent;
        }

        &[aria-invalid='true'] {
          border: ${forms.inputs.border.width} solid ${colors.warningLight};
          background-color: transparent;
        }

        &[aria-invalid='true'] + .password-display-mask {
          color: ${colors.warning};
        }
      }

      .password-display-mask {
        position: relative;
        width: 100%;
        /* pointer-events: none;
        user-select: none; */
        z-index: 1;
        padding: 12px 16px;
        min-height: 54px;
        display: flex;
        align-items: center;
        justify-content: center;
        /* font-size: 20px; */
        font-family: inherit;
        color: ${colors.text};
        border: ${forms.inputs.border.width} solid transparent;
        border-radius: 8px;
        letter-spacing: 0.15em;
      }
    }
  }

  form {
    gap: 1.1rem;
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
      min-height: 70px;
      font-size: 1.25rem;
      font-weight: 600;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      color: ${colors.greyLight};
      border: 2px solid ${colors.greyXXLight};
      background-color: transparent;

      &:hover:not(:disabled) {
        transform: scale(0.95);
        transition: transform 0.1s ease;
        color: ${colors.greyLight};
        border: 2px solid ${colors.greyLight};
        background-color: ${colors.greyXXLight50};
      }

      &:active:not(:disabled) {
        transform: scale(0.95);
        transition: transform 0.1s ease;
        color: ${colors.info};
        border: 2px solid ${colors.info};
        background-color: ${colors.infoLight50};
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
