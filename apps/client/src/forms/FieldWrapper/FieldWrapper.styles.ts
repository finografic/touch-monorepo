import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';
import { forms } from 'forms/forms.config';

export const styles = css`
  flex: 1;
  display: block;
  position: relative;
  padding: 0.75rem 0 0.25rem;

  label.field-label {
    /* NOTE: MOVED TO forms-base.styles.ts */
    font-size: ${forms.inputs.label.fontSize};
    font-weight: ${forms.inputs.label.fontWeight};
    color: ${forms.inputs.label.color};

    margin-top: ${forms.inputs.label.marginTop};
    margin-bottom: ${forms.inputs.label.marginBottom};
    padding-top: ${forms.inputs.label.paddingTop};
    padding-bottom: ${forms.inputs.label.paddingBottom};
    min-height: ${forms.inputs.label.minHeight};
    white-space: nowrap;

    & + div {
      width: 100%;
    }
  }

  .field-element {
    width: 100%;
  }

  .field-validation {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    border-radius: 4px;
    padding: 0.1rem 0;
    font-size: 0.8rem;
    font-weight: 600;
    margin-top: 0.125rem;
    width: max-content;
    min-width: 100%;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.25rem;

    svg.icon {
      width: 1rem;
      height: 1rem;
      margin-right: 0.15rem;
    }
  }

  .validation-error {
    justify-content: end;
    color: ${colors.dangerDark};
    transform: translate(-0.1rem, -0.33rem);
    svg.icon {
      margin-top: 0.1rem;
    }
  }

  .validation-warning {
    justify-content: end;
    color: ${colors.warningDark};
    transform: translate(-0.1rem, -0.33rem);
    svg.icon {
      margin-top: 0.1rem;
    }
  }
`;
