import { css } from '@emotion/react';

import { colors, layout } from 'styles';

const props = {
  box: {
    width: 'auto',
    height: '412px',
  },
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
  width: max-content !important;
  color: ${colors.white};

  .menu-grid-left {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
  }

  .menu-grid-right {
    height: ${props.box.height};
    display: flex;
    flex-direction: column;
    align-items: space-between;
    justify-content: space-between;
    /* gap: 1.5rem; */
    padding-left: 1rem;
  }

  .pad-special {
    width: ${props.pad.width};
    height: ${props.pad.height};
    border-radius: 50%;
    border: ${layout.borderWidth} solid ${colors.greyDark};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: ${colors.info};
    transition: all 0.3s;
    background-color: transparent;
    cursor: pointer;

    &.error {
      border-color: ${colors.danger};
      color: ${colors.danger};
      width: ${props.padLG.width};
      height: ${props.padLG.height};
    }

    &.power {
      border-radius: 10px;
      border-color: ${colors.success};
      color: ${colors.success};
      width: ${props.special.width};
      height: ${props.special.height};
      grid-row: span 2;
    }
  }
`;
