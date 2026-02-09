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
  &.main-page-slot-grid {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1.5rem;

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
    .slot-col-lg {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      column-gap: 1rem;
      row-gap: 1.3rem;
      max-width: 360px;
      height: 100%;
      margin-left: 1.5rem;
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

      &.power {
        border-radius: 10px;
        grid-row: span 2;
        width: ${props.special.width};
        height: ${props.special.height};
        color: ${colors.successXLight};
        border-color: ${colors.successLight};

        /* State-based only (no :hover — touch screens get stuck) */
        &.checked,
        &.selected,
        &[data-state='checked'],
        &[aria-checked='true'] {
          color: ${colors.successDark};
          border-color: ${colors.successDark};
          background-color: ${colors.successXXLight50};
        }
      }
    }
  }
`;
