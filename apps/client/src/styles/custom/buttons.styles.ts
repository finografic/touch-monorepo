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
  border: ${layout.borderWidth} solid ${colors.greyDark};
  color: ${colors.info};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${colors.info};
    border-color: ${colors.info};
    background-color: ${colors.info}11;
  }

  &[data-disabled='true'],
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      border-color: ${colors.greyDark};
      background-color: transparent;
    }
  }
`;

// Styles specific to navigation buttons
export const stylesNavButton = css`
  ${stylesButtonBase}
  min-width: 150px;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  line-height: 1;
  font-weight: 500;
  height: 2.5rem;
  gap: 0.5rem;

  &.nav-button-start {
    border-color: ${colors.success};
    color: ${colors.success};

    &:hover:not([data-disabled='true']) {
      border-color: ${colors.successLight};
      background-color: rgba(1, 250, 20, 0.1);
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
