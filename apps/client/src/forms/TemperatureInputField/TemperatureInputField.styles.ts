import { css } from '@emotion/react';

import { colors } from 'styles';
import { forms } from 'styles/forms/forms.styles';

export const styles = css`
  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 1.25rem;

  overflow: hidden;

  .form {
    display: none;
  }

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
        transition: border-color 0.1s ease;

        &:focus {
          outline: none;
          border-color: ${colors.info};
        }

        &.input-max-length-warning {
          border-color: ${colors.warningLight};
          animation: inputWarningPulse 100ms ease-out;
        }

        &.input-max-length-warning + .password-display-mask {
          color: ${colors.warning};
          -webkit-text-fill-color: ${colors.warningLight};
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      input#password {
        min-height: 54px;
        pointer-events: none;
        user-select: none;
        text-align: center;

        color: transparent;
        border: ${forms.inputs.border.width} solid ${colors.grey};
        background-color: transparent;
        transition: border-color 0.1s ease;

        &.input-filled,
        &:not(:empty) {
          border: ${forms.inputs.border.width} solid ${colors.greyXLight};
          background-color: transparent;
        }

        &:active:not(:disabled) {
          border: ${forms.inputs.border.width} solid ${colors.info};
          background-color: transparent;
        }

        &.input-max-length-warning {
          border: ${forms.inputs.border.width} solid ${colors.warningLight};
          background-color: transparent;
          animation: inputWarningPulse 100ms ease-out;
        }

        &.input-max-length-warning + .password-display-mask {
          color: ${colors.warning};
        }

        &[aria-invalid='true'] {
          border: ${forms.inputs.border.width} solid ${colors.warningLight};
          background-color: transparent;
        }

        &:empty {
          border: ${forms.inputs.border.width} solid ${colors.greyXXLight75};
          background-color: transparent;
        }

        &.input-error {
          border: ${forms.inputs.border.width} solid ${colors.warningLight};
          background-color: transparent;
        }

        &[aria-invalid='true']:not(:empty) + .password-display-mask {
          color: ${colors.warning}!important;
          -webkit-text-fill-color: ${colors.warningLight}!important;
        }

        &.input-error + .password-display-mask {
          color: ${colors.warning}!important;
          -webkit-text-fill-color: ${colors.warningLight}!important;
        }
      }

      .password-display-mask {
        position: relative;
        width: 100%;
        pointer-events: none;
        user-select: none;
        z-index: 1;
        padding: 12px 16px;
        min-height: 54px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: inherit;
        font-weight: 600;
        font-size: 1.25rem !important;
        color: ${colors.textXLight}!important;
        -webkit-text-fill-color: ${colors.textXLight}!important;
        border: ${forms.inputs.border.width} solid transparent;
        border-radius: 8px;
        letter-spacing: 0.15em;
        transition: color 0.1s ease;
      }
    }

    @keyframes inputWarningPulse {
      0% {
        border-color: ${colors.greyXLight};
      }
      50% {
        border-color: ${colors.warning};
      }
      100% {
        border-color: ${colors.warningLight};
      }
    }
  }

  form {
    gap: 1.1rem;
  } */
`;
