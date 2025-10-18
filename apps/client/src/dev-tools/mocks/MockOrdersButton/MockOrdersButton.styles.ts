import { css } from '@emotion/react';

import { styles as buttonStyles } from 'components/ButtonControl/ButtonControl.styles';
import { colors, layout } from 'styles';

export const styles = css`
  ${buttonStyles}

  &.button-mock {
    border: ${layout.borderWidth} solid ${colors.warning};
    border-radius: 4px;
    background: transparent;
    color: ${colors.warning};

    &:hover {
      border-color: ${colors.warningLight};
      background-color: rgba(255, 165, 0, 0.1);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        border-color: ${colors.greyDark};
        background-color: transparent;
      }
    }
  }
`;
