import { css } from '@emotion/react';

export const styles = css`
  .search-container {
    position: relative;
    width: 100%;
    z-index: 1000; /* Ensure container has high z-index */
  }

  .dropdown {
    border: 1px solid #a3a3a3; /* 20% darker gray to match other inputs */
    background: var(--color-background);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-radius: var(--radius-3);
    overflow: hidden;
    z-index: 9999; /* Very high z-index to appear above everything */
    position: absolute !important; /* Force absolute positioning */
  }

  .option {
    cursor: pointer;
    transition: background-color 0.15s ease;
    border-bottom: 1px solid var(--gray-3);

    &:last-child {
      border-bottom: none;
    }

    &:hover,
    &.focused {
      background-color: var(--gray-2);
    }

    &:active {
      background-color: var(--gray-3);
    }
  }

  /* Ensure flag images don't break layout */
  img {
    object-fit: cover;
    flex-shrink: 0;
  }

  /* Custom scrollbar for dropdown */
  .dropdown::-webkit-scrollbar {
    width: 6px;
  }

  .dropdown::-webkit-scrollbar-track {
    background: var(--gray-2);
  }

  .dropdown::-webkit-scrollbar-thumb {
    background: var(--gray-6);
    border-radius: 3px;
  }

  .dropdown::-webkit-scrollbar-thumb:hover {
    background: var(--gray-8);
  }
`;
