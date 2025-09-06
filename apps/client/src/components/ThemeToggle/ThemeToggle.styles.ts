import { css } from '@emotion/react';

export const styles = css`
  /* Theme toggle button container */
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: transparent;
    border: 2px solid var(--color-grey-light);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--color-grey-xlight);
      border-color: var(--color-info);
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }

    /* Icon styling */
    .icon {
      color: var(--color-info);
      transition: all 0.3s ease;
    }

    &:hover .icon {
      color: var(--color-white);
    }
  }

  /* Animation for icon transitions */
  .theme-toggle .icon {
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
  }

  .theme-toggle:hover .icon {
    transform: rotate(15deg);
  }
`;
