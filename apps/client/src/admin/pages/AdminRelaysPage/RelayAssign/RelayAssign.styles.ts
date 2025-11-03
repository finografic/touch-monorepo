import { css } from '@emotion/react';

import { colors } from 'styles';

export const styles = css`
  hr {
    margin: 0.5rem 0;
  }

  .slot-grid-container {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    margin-bottom: 2rem;
  }

  .slot-list {
    display: grid;
    row-gap: 1rem;
    padding: 1rem 0;
    border-radius: var(--radius-3);
  }

  .slot-grid-item {
    /* max-width: 100px; */
    width: 700px;
    border: 1px solid ${colors.greyXXLight25};
    > div {
      display: flex;
      flex-direction: column;
      /* gap: 1rem; */
      /* padding: 1rem 0; */
      border-radius: var(--radius-3);
      /* min-width: 100px; */
    }
    button {
      cursor: pointer;
    }
  }

  .slot-item-special {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
    border-radius: var(--radius-3);
    min-width: 100px;
  }

  button.slot-number {
    aspect-ratio: 1;
    min-width: 50px;
    min-height: 50px;
    box-shadow: 0 0 1px 2px;
    background-color: transparent;
    cursor: pointer;
  }

  .slot-default {
    border-color: ${colors.defaultLight};
    color: ${colors.defaultLight};
  }

  .slot-info {
    border-color: ${colors.infoLight};
    color: ${colors.infoLight};
  }

  .slot-danger {
    border-color: ${colors.dangerLight};
    color: ${colors.dangerLight};
  }

  .slot-success {
    color: ${colors.success};
    border-color: ${colors.success};
    background: ${colors.successXXLight25}!important;
  }
`;
