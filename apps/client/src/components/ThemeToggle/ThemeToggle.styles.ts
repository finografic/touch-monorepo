import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  /* Theme toggle button - targets the button element directly */
  &.btn.theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: transparent;
    border: none !important;
    border-width: 0;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0.75rem 1rem;
    min-width: auto;
    width: auto;

    /* Icon styling - matches toolbar pattern */
    svg.icon {
      color: ${colors.greyLight};
      transition: all 0.3s ease;
    }

    &:hover {
      border-color: transparent;
      svg.icon {
        color: ${colors.info};
      }
    }

    &:active {
      transform: scale(0.95);
    }
  }

  /* Animation for icon transitions */
  &.btn.theme-toggle svg.icon {
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
  }

  &.btn.theme-toggle:hover svg.icon {
    transform: rotate(15deg);
  }
`;
