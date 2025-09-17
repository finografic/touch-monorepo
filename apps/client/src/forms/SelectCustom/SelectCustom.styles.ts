import { css } from '@emotion/react';

export const styles = css`
  .search-container {
    position: relative;
    width: 100%;
    z-index: 1000; /* Ensure container has high z-index */
  }

  .dropdown {
    background: var(--color-background);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-radius: var(--radius-3);
    overflow: hidden;
    z-index: 9999;
    position: absolute !important;

    /* ================================================================== */

    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 9999;
    margin-top: 4px;
    max-height: 300px;
    overflow-y: auto;
    background: var(--color-background);
    /* border: 1px solid red; */

    &:before {
      /* border: 1px solid blue; */
      /* inset: 0 !important; */
      /* box-shadow: none !important; */
      /* border: 0 !important; */
      /* border-width: 0 !important; */
    }
  }

  .option {
    cursor: pointer;
    transition: background-color 0.15s ease;
    border-bottom: 1px solid var(--gray-3);
    padding: 8px 12px;

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

  .option-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .option-value {
    font-weight: 500;
    color: var(--gray-12);
  }

  .option-label {
    font-size: 0.875rem;
    color: var(--gray-11);
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
