import { css } from '@emotion/react';

import { colors } from 'styles';
import { forms } from 'styles/forms/forms.styles';

export const styles = css`
  &.p-inputgroup {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* border: 1px solid red; */
    height: ${forms.inputs.height};

    /* border: 1px solid blue !important; */

    .p-inputwrapper {
      padding: 0;
    }

    .p-inputnumber-button-group,
    .p-inputgroup-addon {
      /* height: ${forms.inputs.height}; */
      border: ${forms.inputs.border.width} solid ${forms.inputs.border.color};
    }

    .p-inputnumber-input {
      flex: 2;
    }

    .p-inputnumber-button-group,
    .p-inputnumber-input,
    .p-inputgroup-addon {
      height: ${forms.inputs.height};
    }

    .p-inputgroup-addon {
      border-left: none;
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
`;
