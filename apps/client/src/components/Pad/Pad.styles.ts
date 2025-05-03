import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const padStyles = css`
  /* width: 110px;
  height: 110px;
  border-radius: 50%;
  border: ${layout.borderWidth} solid ${colors.greyDark};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${colors.info};
  transition: all 0.3s;
  background-color: transparent;
  cursor: pointer;
  padding: 1rem;
  text-align: center; */

  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  border: ${layout.borderWidth} solid ${colors.greyDark};
  border-radius: 8px;
  color: ${colors.info};
  background: transparent;
  font-size: 1.5rem;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(.disabled) {
    border-color: ${colors.info};
    transform: scale(1.05);
  }

  &.selected {
    border-color: ${colors.info};
    background-color: rgba(0, 191, 255, 0.1);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: ${colors.grey};
    color: ${colors.grey};

    &:hover {
      transform: none;
    }
  }

  /* Specific styles for radio/checkbox types */
  &.radio {
    /* Add any radio-specific styles */
  }

  &.checkbox {
    border-radius: 12px; /* Make checkboxes more square */

    &.selected {
      border-color: ${colors.success};
      background-color: rgba(1, 250, 20, 0.1);
    }
  }
`;

// ======================================================================== //

export const ___padStyles = css`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: ${layout.borderWidth} solid ${colors.greyDark};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${colors.info};
  transition: all 0.3s;
  background-color: transparent;
  cursor: pointer;
  padding: 1rem;
  text-align: center;

  &:hover:not(.disabled) {
    border-color: ${colors.info};
    transform: scale(1.05);
  }

  &.selected {
    border-color: ${colors.info};
    background-color: rgba(0, 191, 255, 0.1);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: ${colors.grey};
    color: ${colors.grey};

    &:hover {
      transform: none;
    }
  }

  /* Specific styles for radio/checkbox types */
  &.radio {
    /* Add any radio-specific styles */
  }

  &.checkbox {
    border-radius: 12px; /* Make checkboxes more square */

    &.selected {
      border-color: ${colors.success};
      background-color: rgba(1, 250, 20, 0.1);
    }
  }
`;
