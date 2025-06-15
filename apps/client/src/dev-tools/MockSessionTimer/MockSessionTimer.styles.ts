import { css } from '@emotion/react';
import { colors, layout } from 'styles';
import { styles as buttonStyles } from 'components/ButtonControl/ButtonControl.styles';

export const styles = css`
  ${buttonStyles}

  &.btn-dev {
    border: ${layout.borderWidth} solid ${colors.warning};
    border-radius: 4px;
    background: transparent;
    color: ${colors.warning};

    &:hover {
      border-color: ${colors.warningLight};
      background-color: ${colors.warning}11;
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
