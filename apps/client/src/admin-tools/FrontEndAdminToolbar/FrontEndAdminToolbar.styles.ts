import { css } from '@emotion/react';
import { styles as stylesButton } from 'components/ButtonControl/ButtonControl.styles';
import { colors, layout } from 'styles';

export const styles = css`
  width: 100%;
  height: ${layout.footer.height};
  min-height: ${layout.footer.height};
  max-height: ${layout.footer.height};
  background-color: transparent;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  z-index: 1500;

  .button-box {
    width: auto;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    margin-left: 0.25rem;
    &:first-child {
      margin-left: 2rem;
    }
  }

  button {
    ${stylesButton}
    padding: 0.75rem 1rem;
    min-width: auto;
    width: auto;
    border-width: 0;
    svg.icon {
      color: ${colors.text};
    }
    &:hover {
      border-color: transparent;
      svg.icon {
        color: ${colors.info};
      }
    }

    &.active {
      svg.icon {
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
`;
