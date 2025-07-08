import { css } from '@emotion/react';
import { forms } from 'styles/forms.styles';

export const styles = css`
  .temperature-input-root {
    .rt-TextFieldInput {
      text-align: right;
      padding: ${forms.inputs.padding};

      &:disabled {
        background-color: ${forms.inputs.disabled.background};
        border-color: ${forms.inputs.disabled.border.color};
        color: ${forms.inputs.disabled.text.color};
        font-weight: ${forms.inputs.disabled.text.fontWeight};
        opacity: ${forms.inputs.disabled.opacity};
      }

      &::placeholder {
        text-align: right;
        color: ${forms.inputs.placeholder.color};
        opacity: ${forms.inputs.placeholder.opacity};
        font-weight: ${forms.inputs.placeholder.fontWeight};
      }
    }
  }
`;
