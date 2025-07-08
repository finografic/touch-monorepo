import { css } from '@emotion/react';
import { forms } from 'styles/forms.styles';

export const styles = css`
  .time-input-root {
    .rt-TextFieldInput {
      text-align: right; /* Right align like temperature inputs */

      &:disabled {
        background-color: ${forms.inputs.disabled.background};
        border-color: ${forms.inputs.disabled.border.color};
        color: ${forms.inputs.disabled.text.color};
        font-weight: ${forms.inputs.disabled.text.fontWeight};
        opacity: ${forms.inputs.disabled.opacity};
      }
    }
  }
`;
