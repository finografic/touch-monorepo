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

    /* Remove gap between button group and input */
    .p-inputnumber {
      display: flex;
      gap: 0;
      flex: 1;
    }

    .p-inputnumber-button-group,
    .p-inputgroup-addon {
      /* height: ${forms.inputs.height}; */
      border: ${forms.inputs.border.width} solid ${forms.inputs.border.color};
    }

    .p-inputnumber-input {
      flex: 1;
      margin: 0;
      text-align: right;
      padding: 0 0.75rem;
    }

    .p-inputnumber-button-group,
    .p-inputnumber-input,
    .p-inputgroup-addon {
      height: ${forms.inputs.height};
    }

    .p-inputgroup-addon {
      border-left: none;
    }

    .p-inputnumber-button-group {
      border-right: none !important;
      border-radius: ${forms.inputs.border.radius} 0 0 ${forms.inputs.border.radius} !important;
      button.p-inputnumber-button {
        color: ${colors.greyLight};
        svg {
          height: 16px;
          width: 16px;
        }
        &:not(:disabled):hover {
          background-color: ${colors.greyXXLight25} !important;
        }
      }
    }

    &.is-disabled {
      .p-inputnumber-button-group {
        button.p-inputnumber-button {
          color: ${colors.greyLight};
          background-color: ${colors.greyXXLight25};
        }
      }
    }
  }
`;
