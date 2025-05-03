import { colors, layout } from 'styles';
import { css } from '@emotion/react';

export const stylesPad = css`
  cursor: pointer;
  color: ${colors.info};
  background: transparent;
  border: ${layout.borderWidth} solid ${colors.greyDark};
  transition: all 0.2s;

  &:hover:not(.disabled) {
    border-color: ${colors.info};
    transform: scale(1.05);
  }

  &.checked {
    border-color: ${colors.info};
    background-color: rgba(0, 191, 255, 0.1);
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
