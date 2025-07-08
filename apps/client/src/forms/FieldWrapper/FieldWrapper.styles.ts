import { css } from '@emotion/react';
import { colors, spacing } from 'styles';

export const styles = css`
  flex: 1;
  display: block;
  position: relative;
  min-width: 180px;
  padding: 0.5rem 0 0.25rem;

  .field-label {
    padding: 0.5rem 0 0.25rem;
    display: block;
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
    color: ${colors.dangerDark};
  }

  .validation-warning {
    color: ${colors.warningDark};
  }
`;
