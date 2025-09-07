import { button, colors, layout } from 'styles';
import { css } from '@emotion/react';

// Base styles shared across all interactive buttons
export const stylesButtonBase = css`
  cursor: pointer;
  background: transparent;
  transition: ${button.transition};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* For absolute positioning of icons */

  color: ${colors.infoDark};
  border-color: ${colors.infoDark};
  border-width: ${button.border.width};
  border-style: ${button.border.style};

  &:hover {
    color: ${colors.infoDark};
    border-color: ${colors.info};
    background-color: ${colors.infoLight};
    transform: scale(${button.transform.hoverScale});
  }

  /* Override Radix UI disabled styles */
  &:disabled,
  &.disabled,
  &[data-disabled='true'] {
    opacity: ${button.disabled.opacity};
    cursor: not-allowed;
    color: ${colors.default66} !important;
    border-color: ${colors.defaultLight66};
    background-color: transparent;
    pointer-events: none;

    /* Ensure hover states don't override */
    &:hover {
      color: ${colors.default66} !important;
      border-color: ${colors.defaultLight66};
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
