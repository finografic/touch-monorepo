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
  }

  .item-button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
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
  }

  .item-button:last-of-type {
    grid-column: 1 / -1;
  }
`;
