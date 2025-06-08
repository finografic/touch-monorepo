import { css } from '@emotion/react';
import { colors, layout } from 'styles';
import { styles as buttonStyles } from 'components/ButtonControl/ButtonControl.styles';

export const styles = css`
  ${buttonStyles}

  &.btn-dev {
    border: ${layout.borderWidth} solid ${colors.info};
    border-radius: 4px;
    background: transparent;
    color: ${colors.info};

    &:hover {
      border-color: ${colors.infoLight};
      background-color: ${colors.info}11;
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
