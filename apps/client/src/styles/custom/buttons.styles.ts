import { colors, layout } from 'styles';
import { css } from '@emotion/react';

// Common dimensions for different button types
export const padProps = {
  pad: {
    width: '110px',
    height: '110px',
  },
  padLG: {
    width: '150px',
    height: '150px',
  },
  special: {
    width: '150px',
    height: '239px',
  },
};

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
  }

  &[data-disabled='true'],
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: ${colors.grey};
    border-color: ${colors.greyDark};
    background-color: transparent;
    &:hover {
      border-color: ${colors.greyDark};
      background-color: transparent;
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
      left: 1.25rem;
      transform: translateX(-25%);
      width: 20px;
      height: 20px;
      opacity: 0.8;
    }
  }

  /* For right-pointing chevrons */
  &.has-chevron-right {
    /* Add padding to compensate for the chevron */
    padding-left: 2rem;
    padding-right: 3rem;

    /* Position the chevron absolutely */
    svg {
      position: absolute;
      right: 1.25rem;
      transform: translateX(25%);
      width: 20px;
      height: 20px;
      opacity: 0.8;
    }
  }
`;

// Styles specific to navigation buttons
export const stylesNavButton = css`
  ${stylesButtonBase}
  min-width: 180px;
  padding: 0.8rem 3rem;
  margin: 0 0.33rem;
  font-size: 1.1rem;
  line-height: 1;
  font-weight: 500;
  gap: 0.5rem;
  flex: 1;
  width: fit-content;
  border-radius: 4px;

  &.nav-button-start {
    border-color: ${colors.success};
    color: ${colors.success};

    &:hover:not([data-disabled='true']) {
      border-color: ${colors.successLight};
      background-color: ${colors.successLight}11;
    }
  }
`;

// Styles specific to pads
export const stylesPad = css`
  ${stylesButtonBase}
  font-size: 1.5rem;
  padding: 1rem;
  text-align: center;

  &.pad-menu {
    border-radius: 50%;
  }

  &:hover:not(.disabled) {
    transform: scale(1.05);
  }

  &.checked {
    border-color: ${colors.info};
    background-color: ${colors.info}11;
  }

  &.disabled {
    border-color: ${colors.grey};
    color: ${colors.grey};

    &:hover {
      transform: none;
    }
  }
`;
