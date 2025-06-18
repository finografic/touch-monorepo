import { css } from '@emotion/react';
import { styles as stylesButton } from 'components/ButtonControl/ButtonControl.styles';
import { colors, layout } from 'styles';

export const styles = css`
  &.admin-tools-container {
    position: fixed;
    bottom: 0;
    left: 0;

    width: 50vw;
    height: ${layout.footer.height};
    min-height: ${layout.footer.height};
    max-height: ${layout.footer.height};

    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    z-index: 1500;

    > div {
      padding-left: 2rem;
      height: 100%;
      display: flex;
      align-items: center;
    }

    button.btn-admin,
    button.btn-dialog,
    button.btn-query {
      ${stylesButton}
      min-width: 60px;
      border-color: transparent;
      svg {
        color: ${colors.textDark};
        /* width and height now handled by .icon class */
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
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-right: 20px;
      width: fit-content;
      height: auto;
      color: ${colors.warningDark};
    }
  }
`;
