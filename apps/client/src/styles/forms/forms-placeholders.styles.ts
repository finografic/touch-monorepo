import { css } from '@emotion/react';

import { forms } from 'styles/forms/forms.constants';
import { colors } from 'styles';

export const stylesPlaceholder = css`
  font-weight: ${forms.inputs.placeholder.fontWeight};
  color: ${colors.default75};
  -webkit-text-fill-color: ${colors.default75};
  opacity: 0.4;
  text-indent: 0;
  font-style: italic;
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
    }
    ::-moz-placeholder {
      ${stylesPlaceholder}
    }
    :-ms-input-placeholder {
      ${stylesPlaceholder}
    }
    ::placeholder {
      ${stylesPlaceholder}
      opacity: 0.40!important;
    }
  }
`;
