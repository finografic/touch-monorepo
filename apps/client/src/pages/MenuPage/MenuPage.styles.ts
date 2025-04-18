import { css } from '@emotion/react';
import { layout, colors } from 'styles';

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

  .pad:not(.is-processing) {
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
    &:hover {
      border-color: ${colors.info};
      transform: scale(1.05);
    }

    &.active {
      border-color: ${colors.info};
      background-color: rgba(0, 191, 255, 0.1);
    }

    &.first {
      border-color: ${colors.grey};
      background-color: rgba(150, 150, 150, 0.15);
    }

    &.error {
      border-color: ${colors.danger};
      color: ${colors.danger};
      width: ${props.padLG.width};
      height: ${props.padLG.height};
    }

    &.special {
      border-radius: 10px;
      border-color: ${colors.success};
      color: ${colors.success};
      width: ${props.special.width};
      height: ${props.special.height};
      grid-row: span 2;
    }

    &.active.is-processing {
      border: ${layout.borderWidth} solid ${colors.success};
      border-radius: 4px;
      /* background: transparent; */
      background-color: rgba(1, 250, 20, 0.1);
      color: ${colors.success};

      &:hover {
        border-color: ${colors.successLight};
        background-color: rgba(1, 250, 20, 0.1);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        &:hover {
          border-color: ${colors.greyDark};
          /* background-color: transparent; */
          background-color: rgba(1, 250, 20, 0.1);
        }
      }
    }
  }
`;
