import { css } from '@emotion/react';

import { colors } from 'styles';

const props = {
  pad: {
    width: '110px',
    height: '110px',
  },
  padLG: {
    width: '150px',
    height: '150px',
  },
  special: {
    width: '150px',
    height: '239px',
  },
};

export const styles = css`
  .main-page-slot-grid {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .grid-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    gap: 2rem;
  }

  /* Left group: Grid + Special slot */
  .grid-left-group {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
    flex-shrink: 0;
  }

  /* Main slot grid */
  .slot-grid {
    display: grid;
    gap: 2.5rem;
    justify-items: center;
    align-items: center;
    place-items: center;
    flex-shrink: 0;
  }

  /* Special slot container (last slot + power button) */
  .special-slot-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    column-gap: 1rem;
    row-gap: 1rem;
    max-width: 360px;
    height: 100%;
  }

  /* Content buttons (RED and GREEN buttons) */
  .content-buttons {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 2.5rem;
    height: 100%;
    flex-shrink: 0;
  }

  /* Power button styling */
  .pad-special {
    width: ${props.pad.width};
    height: ${props.pad.height};
    border-radius: 50%;
    border: 2px solid ${colors.greyDark};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: ${colors.infoDark};
    transition: all 0.3s;
    background-color: transparent;
    cursor: pointer;

    &.error {
      border-color: ${colors.dangerDark};
      color: ${colors.dangerDark};
      width: ${props.padLG.width};
      height: ${props.padLG.height};
    }

    &.power {
      pointer-events: none;
      border-radius: 10px;
      grid-row: span 2;
      width: ${props.special.width};
      height: ${props.special.height};
      color: ${colors.successXLight};
      border-color: ${colors.successXLight};

      &:hover {
        color: ${colors.successDark};
        border-color: ${colors.successDark};
        background-color: ${colors.successLight};
      }
      &.checked {
        color: ${colors.successDark};
        border-color: ${colors.successDark};
        background-color: ${colors.successLight};
      }
    }
  }
`;
