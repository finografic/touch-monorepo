import { css } from '@emotion/react';
import { formsBase, formsReset } from 'styles/forms/forms-base.styles';
import { formsValidation } from 'styles/forms/forms-validation.styles';
import { formsInputs } from 'styles/forms/forms-inputs.styles';
import { formsSelect } from 'styles/forms/forms-select.styles';

export { forms } from './forms.constants';

export const cssForms = css`
  ${formsReset}
  ${formsBase}
  ${formsValidation}
  ${formsInputs}
`;
