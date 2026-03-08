import { css } from '@emotion/react';

import { formsBase, formsReset } from './forms-base.styles';
import { formsInputs } from './forms-inputs.styles';
import { cssPlaceholder } from './forms-placeholders.styles';
import { formsSelect } from './forms-select.styles';
import { formsValidation } from './forms-validation.styles';

export { forms } from 'forms/forms.config';

export const cssForms = css`
  /* ${formsReset}
  ${formsBase}
  ${formsValidation}
  ${formsSelect}
  ${formsInputs}
  ${cssPlaceholder} */
`;
