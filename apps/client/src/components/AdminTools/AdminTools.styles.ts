import { css } from '@emotion/react';
import { styles as stylesButton } from 'components/ButtonControl/ButtonControl.styles';
import { colors } from 'styles';

export const styles = css`
  &.admin-tools-container {
    position: fixed;
    width: 50vw;
    height: 64px;
    bottom: 0;
    left: 0;
    z-index: 1500;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    & > div {
      padding-left: 2rem;
    }

    button.btn-admin,
    button.btn-dialog,
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

      &.active {
        svg {
          color: ${colors.warningDark};
        }
      }
    }

    .timer-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-right: 20px;
      padding-bottom: 12px;
      width: fit-content;
      height: 64px;
      color: ${colors.warningDark};
    }
  }
`;
