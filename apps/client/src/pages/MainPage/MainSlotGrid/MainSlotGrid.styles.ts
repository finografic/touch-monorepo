import { colors } from '@finografic/design-system/tokens';

import { css } from '@emotion/react';
import { padProps } from 'components/Pads/Pad/PadBasic.styles';

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

    /* Special slot container (1 or 2 special columns + power button) */
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

    .slot-special-row {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 1.5rem;
    }

    .slot-col-lg .slot-item-special {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Power button styling */
    .pad-special {
      width: ${padProps.pad.width};
      height: ${padProps.pad.height};
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
        flex-grow: 2;
        width: ${padProps.special.width};
        height: ${padProps.special.height};
        color: ${colors.successXLight};
        border-color: ${colors.successLight};

        /* State-based only (no :hover — touch screens get stuck) */
        /* &.checked,
        &.selected,
        &[data-state='checked'],
        &[aria-checked='true'] {
          color: ${colors.successDark};
          border-color: ${colors.successDark};
          background-color: ${colors.successXXXLight};
        } */
      }
    }

    @media (max-width: 1024px) and (max-height: 600px) {
    }
  }
`;
