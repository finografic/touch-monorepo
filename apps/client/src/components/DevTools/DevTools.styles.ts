import { css } from '@emotion/react';
import { colors } from 'styles';
import { styles as stylesButton } from 'components/ButtonControl/ButtonControl.styles';

export const styles = css`
  &.devtools-container {
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 1500;

    & > div {
      padding-right: 2rem;
    }

    button.btn-dev,
    button.btn-query {
      ${stylesButton}
      min-width: 60px;
      border-color: transparent;
      svg {
        color: ${colors.textDark};
        width: 24px;
        height: 24px;
      }
      &:hover {
        border-color: transparent;
        svg {
          color: ${colors.info};
        }
      }
    }

    button.btn-query {
      svg {
        transform: translateY(3px);
      }
    }
  }
`;
