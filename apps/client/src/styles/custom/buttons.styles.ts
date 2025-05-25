import { colors, layout } from 'styles';
import { css } from '@emotion/react';

export const padProps = {
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

export const stylesPad = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  padding: 1rem;
  text-align: center;

  cursor: pointer;
  background: transparent;
  transition: all 0.2s;
  border: ${layout.borderWidth} solid ${colors.greyDark};
  color: ${colors.info};

  &.pad-menu {
    border-radius: 50%;
  }

  &:hover:not(.disabled) {
    border-color: ${colors.info};
    transform: scale(1.05);
  }

  &.checked {
    border-color: ${colors.info};
    background-color: ${colors.info}11;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
    border-color: ${colors.grey};
    color: ${colors.grey};

    &:hover {
      transform: none;
    }
  }
`;
