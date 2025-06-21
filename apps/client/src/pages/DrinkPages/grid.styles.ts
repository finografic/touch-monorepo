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
      .btn-item {
        width: 100%;
      }

      &.pad-rect {
        width: 300px;
      }
    }
  }

  .btn-item {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    border-radius: 8px;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s;
    padding: 1rem;
    text-align: center;
    background: transparent;
    border: ${layout.borderWidth} solid ${colors.greyDark};
    color: ${colors.info};

    &:hover {
      border-color: ${colors.info};
      transform: scale(1.02);
    }

    &.selected {
      border-color: ${colors.info};
      background-color: ${colors.info}99;
    }

    /* Only make specific items span full width when needed */
    &.full-width {
      grid-column: 1 / -1;
      min-height: 100px;
    }
  }
`;
