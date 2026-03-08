import { colors } from '@workspace/design-system/tokens';

import { css } from '@emotion/react';

// Base styles shared across all interactive buttons
export const stylesButtonBase = css`
  cursor: pointer;
  background: transparent;
  transition:
    transform 200ms ease,
    border-color 200ms ease,
    color 200ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* For absolute positioning of icons */
  box-shadow: none;

  color: ${colors.infoDark};
  border-color: ${colors.infoDark};
  border-width: var(--border-widths-default);
  border-style: solid;

  color: ${colors.infoLight};
  border-color: ${colors.infoLight};

  :hover {
    color: ${colors.infoDark};
    border-color: ${colors.infoDark};
    background-color: ${colors.infoLighter};
  }

  /* Override Radix UI disabled styles */
  :disabled,
  &.disabled,
  &[data-disabled='true'] {
    opacity: 0.55;
    color: ${colors.defaultLight};
    border-color: ${colors.defaultLight};
    background-color: transparent;
    user-select: none;
    cursor: not-allowed;

    /* Ensure hover states don't override */
    :hover,
    :active {
      color: ${colors.defaultLight};
      border-color: ${colors.defaultLight};
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

  /* For left-pointing chevrons */
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

// Styles specific to navigation / small action buttons
export const stylesSmallButton = css`
  ${stylesButtonBase}
  font-size: 1.4rem;
  font-weight: var(--font-weights-semibold);
  min-width: 180px;
  padding: 0.9rem 3rem;
  margin: 0 0.33rem;
  line-height: 1;
  gap: 0.5rem;
  flex: 1;
  width: fit-content;
  border-radius: 4px;
`;
