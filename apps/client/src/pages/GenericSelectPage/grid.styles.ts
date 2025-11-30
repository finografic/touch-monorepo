import { css } from '@emotion/react';

import { button, colors, layout } from 'styles';

export const stylesItemsGrid = css`
  .items-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;

    /* Create a more dynamic grid layout */
    grid-auto-rows: minmax(80px, auto);
    align-items: stretch;

    /* Switch to 3 columns when there are 9+ items */
    &.three-columns {
      grid-template-columns: repeat(3, 1fr);
      max-width: 900px;
    }

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
        width: 260px;
      }
    }
  }

  .pad.radio {
    min-width: 260px;
  }
`;
