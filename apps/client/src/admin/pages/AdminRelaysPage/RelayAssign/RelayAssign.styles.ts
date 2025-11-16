import { css } from '@emotion/react';
import { getVariantStyles } from 'components/Button/utils/button.utils';

import { border, colors, layout } from 'styles';

export const styles = css`
  width: 100%;

  .slot-list {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    column-gap: 1rem;
    row-gap: 1rem;
    width: 100%;
    /* max-width: 1000px; */
    padding: 2rem 0 2rem 0;
    margin-top: 0.5rem;
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

  .slot-square {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2px;
    width: 38px;
    height: 38px;
    padding: 0.5rem 1rem;
    background-color: transparent;
    border-width: ${layout.borderWidth};
    border-style: solid;
    border-color: transparent;
    border-radius: ${border.radius.sm};
    font-weight: 600;
    font-size: 0.9rem;
  }

  .col-type {
    display: flex;
    align-items: center;
    justify-content: start;
    font-weight: 600;
    font-size: 0.95rem;
    color: ${colors.greyLight};
    width: 4rem;
  }

  .col-select {
    .relay-assign-select {
      width: 100%;
    }

    button.button-relay-test {
      width: 100%;
      max-width: 33%;
      max-width: 5.5rem;
      height: 38px;
      flex-shrink: 0;
      padding: 0rem 3.25rem;

      ${getVariantStyles('solid', 'grey')}

      .button-text {
        font-size: 1.1rem;
        font-weight: 600;
        color: ${colors.white};
        svg {
          width: 1.5rem;
        }
      }
    }
  }

  .col-status > div {
    margin-right: 4rem;
    width: 100%;
    display: flex;
    justify-content: end;
  }

  .col-json {
    display: flex;
    align-items: start;
    justify-content: center;
    max-width: 400px;
    padding: 5rem;
    font-size: 1.1rem;
  }

  .relay-status {
    width: 100%;
    min-width: 180px;
    font-weight: 600;
    color: ${colors.greyXLight};

    > div {
      &:nth-of-type(1) {
        &.status-off {
          opacity: 0.45;
          opacity: 0;
        }
      }
      &:nth-of-type(2) {
        margin-left: 0.75rem;
        width: 2.2rem;
      }
      &:nth-of-type(3) {
        width: 1.25rem;
      }
      &:nth-of-type(4) {
        justify-content: center;
        width: 2rem;
        margin-left: 0.25rem;
        font-weight: 600;
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
