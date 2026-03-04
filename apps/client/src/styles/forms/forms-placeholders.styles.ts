import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';
import { forms } from '../../forms/forms.config';

export const stylesPlaceholder = css`
  font-weight: ${forms.inputs.placeholder.fontWeight};
  text-indent: 0;
  font-style: italic;
  color: ${colors.grey};
  -webkit-text-fill-color: ${colors.grey};
  opacity: 0.7;
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
      opacity: 1!important;
    }
  }
`;
