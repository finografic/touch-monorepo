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
  /* width: max-content !important; */
  color: var(--color-white);

  /* Main grid container for the three columns */
  .menu-main {
    width: 100%;
    max-width: 1150px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: auto 1.5rem auto 3rem 1fr; /* Left pads | small gap | middle | double gap | grey buttons */
    gap: 2.5rem 0; /* Only row gap, column gaps handled by template */
    align-items: start;
    /* width: max-content;
    min-width: 100%; */
    overflow: visible; /* Allow content to extend if needed */
  }

  .menu-grid-base {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 2.5rem;
    height: 100%;
  }

  .menu-grid-left {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    height: 100%;
    max-width: 500px;
  }

  .menu-grid-right {
    height: ${props.box.height};
    display: flex;
    flex-direction: column;
    align-items: space-between;
    justify-content: space-between;
    align-items: center;
    max-width: 360px;
    height: 100%;
  }

  .pad-special {
    width: ${props.pad.width};
    height: ${props.pad.height};
    border-radius: 50%;
    border: 2px solid var(--color-grey-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: var(--color-info-dark);
    transition: all 0.3s;
    background-color: transparent;
    cursor: pointer;

    &.error {
      border-color: var(--color-danger-dark);
      color: var(--color-danger-dark);
      width: ${props.padLG.width};
      height: ${props.padLG.height};
    }

    &.power {
      pointer-events: none;
      border-radius: 10px;
      grid-row: span 2;
      width: ${props.special.width};
      height: ${props.special.height};

      color: var(--color-success-dark);
      border-color: var(--color-success-dark);
      &:hover {
        color: var(--color-success-dark);
        border-color: var(--color-success-dark);
        background-color: var(--color-success-light);
      }
      &.checked {
        color: var(--color-success-dark);
        border-color: var(--color-success-dark);
        background-color: var(--color-success-light);
      }
    }
  }
`;
