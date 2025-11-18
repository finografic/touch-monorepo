import { css } from '@emotion/react';

import { colors, layout, spacing } from 'styles';

export const stylesItemsGrid = css`
  .items-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;

    /* Create a more dynamic grid layout */
    grid-auto-rows: minmax(80px, auto);
    align-items: stretch;

    /* When vertical-flow class is added, items flow down columns instead of across rows */
    &.vertical-flow {
      grid-auto-flow: column;
      /* Ensure we have enough row space for items */
      grid-template-rows: repeat(4, minmax(80px, auto));
      grid-template-columns: repeat(2, 1fr);
    }

    /* Centers items when combined with vertical-flow */
    &.vertical-flow.centered-flow {
      /* Calculate columns based on number of items */
      grid-template-columns: repeat(1, minmax(200px, 300px));
      justify-content: center;

      /* Adjust max-width to prevent stretching */
      max-width: 800px;
      margin: 0 auto;

      /* Ensure consistent item sizing */
      .button-item {
        width: 100%;
      }

      &.pad-rect {
        width: 300px;
      }
    }
  }

  .button-item {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    border: ${layout.borderWidth} solid ${colors.greyDark};
    border-radius: 8px;
    color: ${colors.info};
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s;
    background: transparent;
    padding: 1rem;
    text-align: center;

    &:hover {
      border-color: ${colors.info};
      transform: scale(1.02);
    }

    &.selected {
      border-color: ${colors.info};
      background-color: rgba(0, 191, 255, 0.1);
    }

    /* Only make specific items span full width when needed */
    &.full-width {
      grid-column: 1 / -1;
      min-height: 100px;
    }
  }
`;

export const styles = css`
  .admin-section {
    margin-bottom: 0.5rem;
    &:last-of-type {
      margin-bottom: 2rem;
    }
  }

  .validation-error {
    display: none;
  }

  /* Translation form grid */
  .translation-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: ${spacing.default};
    align-items: start;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .translation-item {
      display: flex;
      flex-direction: column;
      gap: ${spacing.sm};

      .translation-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: ${colors.greyDark};
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: ${spacing.xs};
      }

      .translation-input {
        width: 100%;
        padding: ${spacing.md};
        border: 1px solid ${colors.greyLight};
        border-radius: 6px;
        background-color: ${colors.white};
        color: ${colors.text};
        font-size: 0.875rem;
        transition: border-color 0.2s ease;

        &:focus {
          outline: none;
          border-color: ${colors.info};
          box-shadow: 0 0 0 3px ${colors.infoLight};
        }

        &::placeholder {
          color: ${colors.grey};
        }

        &:disabled {
          background-color: ${colors.greyXLight};
          opacity: 0.7;
          cursor: not-allowed;
        }
      }

      .translation-error {
        color: ${colors.danger};
        font-size: 0.75rem;
        margin-top: ${spacing.xs};
      }
    }
  }

  /* Form actions */
  .form-actions {
    display: flex;
    justify-content: center;
    gap: ${spacing.default};
    margin-top: ${spacing.xxxl};
    padding-top: ${spacing.xl};
    border-top: 1px solid ${colors.greyLight};

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  /* Loading state */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    color: ${colors.greyDark};

    .loading-spinner {
      margin-bottom: ${spacing.default};
    }

    .loading-text {
      font-size: 1.125rem;
      color: ${colors.greyDark};
    }
  }

  /* Error state */
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    color: ${colors.danger};

    .error-text {
      font-size: 1.125rem;
      text-align: center;
    }
  }
`;
