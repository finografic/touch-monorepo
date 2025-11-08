import { css } from '@emotion/react';

import { forms } from 'styles/forms/forms.constants';
import { colors } from 'styles/colors/colors.styles';

export const stylesPlaceholder = css`
  font-weight: ${forms.inputs.placeholder.fontWeight};
  color: ${colors.grey};
  -webkit-text-fill-color: ${colors.grey};
  color: ${colors.success};
  -webkit-text-fill-color: ${colors.success};
  opacity: 0.5;
`;

export const cssPlaceholder = css`
  input,
  textarea,
  div[role='textbox'] {
    ::-webkit-input-placeholder {
      ${stylesPlaceholder}
    }
    ::-moz-placeholder {
      ${stylesPlaceholder}
    }
    :-ms-input-placeholder {
      ${stylesPlaceholder}
    }
    ::placeholder {
      ${stylesPlaceholder}
    }
  }

  input:read-only,
  textarea:read-only,
  div[role='textbox']:read-only {
    ::-webkit-input-placeholder {
      ${stylesPlaceholder}
      opacity: 1!important;
    }
    ::-moz-placeholder {
      ${stylesPlaceholder}
      opacity: 1!important;
    }
    :-ms-input-placeholder {
      ${stylesPlaceholder}
      opacity: 1!important;
    }
    ::placeholder {
      ${stylesPlaceholder}
      opacity: 1!important;
    }
  }
`;
