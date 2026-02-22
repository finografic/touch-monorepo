import { css } from '@emotion/react';

import { colors, layout } from 'styles';

export const styles = css`
  hr {
    margin: 0.5rem 0;
  }

  .slot-grid-container {
    display: flex;
    gap: 0rem;
    align-items: flex-start;
    margin-bottom: 2rem;
  }

  .slot-grid {
    display: grid;
    column-gap: 0rem;
    row-gap: 1.5rem;
    padding: 1rem 0;
    border-radius: ${layout.borderRadius};
  }

  .slot-grid-item {
    button {
      cursor: pointer;
    }
  }

  .slot-item-special {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
    border-radius: ${layout.borderRadius};
    row-gap: 1.5rem;
    height: 350px;
    /* min-width: 100px; */
  }

  .slot-item-power {
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
    border-radius: ${layout.borderRadius};
    pointer-events: none;
    /* Same width as slot buttons; height = 2 grid squares (90*2 + row-gap 1.5rem) */
    width: 90px;
    min-height: calc(90px * 2 + 1.5rem);

    button.slot-button {
      width: 90px;
      /* height: calc(90px * 2 + 1.5rem); */
      aspect-ratio: auto;
      cursor: default;
    }
  }

  button.slot-button {
    aspect-ratio: 1;
    width: 90px;
    height: 90px;
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

  .slot-secondary {
    border-color: ${colors.secondaryLight};
    color: ${colors.secondaryLight};
    cursor: default;
  }

  .slot-power {
    border-color: ${colors.success};
    color: ${colors.successLight};
    flex-grow: 2;
    cursor: default;
  }
`;
