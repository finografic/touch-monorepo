import { css } from '@emotion/react';

import { colorsDirect as colors, layout } from 'styles';
import { stylesButtonBase } from 'styles/project/buttons.styles';

export const styles = css`
  ${stylesButtonBase}
  cursor: pointer;
  min-width: 150px;
  padding: 0.5rem 1.5rem;
  border: ${layout.borderWidth} solid ${colors.greyDark};
  border-radius: 4px;
  transition: all 200ms;

  color: ${colors.info};
  border-color: ${colors.infoXDark};
  background: transparent;

  &:hover {
    color: ${colors.info};
    border-color: ${colors.info};
    background-color: ${colors.info25};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      border-color: ${colors.greyDark};
      background-color: transparent;
    }
  }
`;
