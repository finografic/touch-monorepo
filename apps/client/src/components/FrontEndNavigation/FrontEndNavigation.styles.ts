import { css } from '@emotion/react';

import { colorsDirect as colors, layout } from 'styles';
import { stylesSmallButton } from 'styles/project/buttons.styles';

export const styles = css`
  width: 100%;

  .nav-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .nav-root {
    width: fit-content;
  }

  .nav-list {
    display: flex;
    gap: 0.66rem;
    list-style: none;
    margin: 0;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background: transparent;
    justify-content: center;
    align-items: center;
  }

  .nav-item {
    position: relative;
    display: flex;
    justify-content: center;
  }

  .small-button,
  .small-button {
    ${stylesSmallButton}
  }

  /* Button color variants are now handled globally in buttons.styles.ts */
`;
