import { css } from '@emotion/react';

import { colors } from 'styles';

export const styles = css`
  .slot-grid-container {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    margin-bottom: 2rem;
    width: 800px;
  }

  .slot-list {
    display: grid;
    row-gap: 1rem;
    padding: 1rem 0;
    border-radius: var(--radius-3);
  }

  .slot-grid-item {
    /* Target the Row component (react-grid-system) */
    width: 800px;
    > div {
      display: flex;
      align-items: center; /* Vertically align button and dropdown */
      width: 100%; /* Ensure Row takes full width */
    }
    button {
      cursor: pointer;
    }

    &.header {
      /* padding: 0.5rem 1rem; */
      color: ${colors.grey};
      font-weight: 600;
      margin-top: 1rem;
      margin-bottom: 1.5rem;
    }
  }

  .col {
    display: flex;
    flex-direction: column;
    width: 100%; /* Ensure columns stretch to fill available space */
  }

  .col-button {
    button.slot-button {
      margin: 2px;
      width: 36px;
      height: 36px;
      background-color: transparent;
      cursor: pointer;
    }
  }

  .col-type {
    color: ${colors.greyXLight};
  }

  .col-select {
    .relay-assign-select {
      width: 100%; /* Stretch select to fill column width */
      max-width: none; /* Remove max-width constraint */
    }
  }

  .col-status {
    display: flex;
    align-items: center;
    width: 100%; /* Ensure status column stretches */
  }

  .relay-status-indicator {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    line-height: 1;
    color: white;

    &.relay-on {
      background: ${colors.successLight};
    }

    &.relay-off {
      background: ${colors.greyXLight50};
    }
  }

  .relay-status-on {
    color: ${colors.successLight};
    font-weight: 600;
  }

  .relay-status-off {
    color: ${colors.greyXXLight};
    font-weight: 600;
  }
`;
