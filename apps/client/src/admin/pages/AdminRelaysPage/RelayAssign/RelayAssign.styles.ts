import { css } from '@emotion/react';

import { colors } from 'styles';

export const styles = css`
  .slot-list {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    column-gap: 1rem;
    row-gap: 1rem;
    max-width: 800px;
    padding: 1rem;
    margin-bottom: 2rem;
  }

  .slot-grid-item {
    > div {
      display: flex;
      align-items: center;
      width: 100%;
    }
    button {
      cursor: pointer;
    }
  }

  .col {
    display: flex;
    align-items: center;
    width: 100%;
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
    justify-content: center;
  }

  .col-select {
    .relay-assign-select {
      width: 100%;
    }
  }

  .col-status {
    width: 100%;
    > div {
      margin-left: 7rem;
    }
  }

  .relay-status {
    width: 100%;
    min-width: 180px;
    font-weight: 600;
    color: ${colors.greyXLight};

    > div {
      &:nth-of-type(1) {
      }
      &:nth-of-type(2) {
        margin-left: 0.75rem;
      }
      &:nth-of-type(3) {
        width: 1.25rem;
      }
      &:nth-of-type(4) {
        justify-content: center;
        width: 2rem;
        margin-left: 0.25rem;
        font-weight: 900;
      }
    }

    .relay-status-indicator {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 14px;
      line-height: 1;
      color: white;
    }

    &.status-on {
      .relay-status-indicator {
        background: ${colors.successLight};
      }
    }

    &.status-off {
      .relay-status-indicator {
        background: ${colors.greyXLight50};
      }
    }
  }
`;
