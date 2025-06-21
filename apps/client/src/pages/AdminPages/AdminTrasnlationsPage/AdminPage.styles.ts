import { css } from '@emotion/react';
import { colors, layout } from 'styles';

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
      .item-button {
        width: 100%;
      }

      &.pad-rect {
        width: 300px;
      }
    }
  }

  .item-button {
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
  /* Admin page content - layout handles background and viewport sizing */
  color: ${colors.white};

  .admin-page {
    width: 100%;
    height: 100%;
  }

  .translation-section {
    background-color: ${colors.backgroundLight};
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid ${colors.greyDark};
  }

  .translation-item {
    background-color: ${colors.background};
    border-radius: 6px;
    padding: 1rem;
    border: 1px solid ${colors.grey};
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${colors.greyLight};
  }

  .form-input {
    background-color: ${colors.backgroundDark};
    border: 1px solid ${colors.greyDark};
    border-radius: 4px;
    padding: 0.5rem;
    color: ${colors.white};
    font-size: 0.875rem;

    &:focus {
      outline: none;
      border-color: ${colors.info};
      box-shadow: 0 0 0 2px ${colors.info}22;
    }

    &::placeholder {
      color: ${colors.grey};
    }
  }

  .error-message {
    color: ${colors.danger};
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
`;
