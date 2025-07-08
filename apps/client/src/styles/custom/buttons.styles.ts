import { colors, layout } from 'styles';
import { css } from '@emotion/react';

// Base styles shared across all interactive buttons
export const stylesButtonBase = css`
  cursor: pointer;
  background: transparent;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* For absolute positioning of icons */

  color: ${colors.info};
  border-color: ${colors.infoDark}bb;
  border-width: ${layout.borderWidth};

  &:hover {
    color: ${colors.info};
    border: ${layout.borderWidth} solid ${colors.infoDark};
    border-color: ${colors.info};
    background-color: ${colors.info}11;
    transform: scale(1.025);
  }

  &:disabled,
  &.disabled,
  &[data-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
    color: ${colors.grey};
    border-color: ${colors.greyDark};
    background-color: transparent;
    &:hover {
      color: ${colors.grey};
      border-color: ${colors.greyDark};
      background-color: transparent;
      transform: none;
    }
  }

  /* Adjust for chevron icons to visually center the label */
  &.has-chevron {
    /* Add padding to compensate for the chevron */
    padding-left: 3rem;
    padding-right: 2rem;

    /* Position the chevron absolutely */
    svg {
      position: absolute;
      width: 30px;
      height: 30px;
      opacity: 0.8;
    }
  }

  /* For right-pointing chevrons */
  &.has-chevron-left {
    padding-left: 3.5rem;
    padding-right: 2.5rem;
    svg {
      left: 1.25rem;
      transform: translateX(25%);
    }
  }

  /* For right-pointing chevrons */
  &.has-chevron-right {
    padding-left: 2.5rem;
    padding-right: 3.5rem;
    svg {
      right: 1.25rem;
      transform: translateX(0);
    }
  }
`;

// Styles specific to navigation buttons
export const stylesSmallButton = css`
  ${stylesButtonBase}
  min-width: 200px;
  padding: 1.1rem 4rem;
  margin: 0 0.33rem;
  font-size: 1.4rem;
  line-height: 1;
  font-weight: 500;
  gap: 0.5rem;
  flex: 1;
  width: fit-content;
  border-radius: 4px;
`;
