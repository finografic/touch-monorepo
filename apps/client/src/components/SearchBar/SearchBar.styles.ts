import { css } from '@emotion/react';
import { colors } from 'styles';
import { forms } from 'styles/forms.styles';

export const styles = css`
  width: 100%;
  display: flex;
  align-items: center;

  .input-search {
    background-color: white;
    color: ${forms.inputs.text.color};
  }

  .rt-TextFieldRoot:where(.rt-variant-surface) :where(.rt-TextFieldInput)::placeholder {
    color: ${forms.inputs.placeholder.color};
    opacity: ${forms.inputs.placeholder.opacity};
    font-weight: ${forms.inputs.placeholder.fontWeight};
  }

  input + .rt-TextFieldSlot svg.icon {
    width: 1.25rem;
    height: 1.25rem;
    stroke-width: 3;
    color: ${colors.grey};
    opacity: 0.66;
  }

  input:focus + .rt-TextFieldSlot svg.icon,
  input:active + .rt-TextFieldSlot svg.icon {
    color: ${colors.infoXDark};
    opacity: 0.66;
  }
`;
