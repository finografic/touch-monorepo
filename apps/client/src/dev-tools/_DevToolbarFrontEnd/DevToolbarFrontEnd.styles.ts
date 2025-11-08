import { css } from '@emotion/react';
import { baseToolbarStyles } from 'components/Toolbars/toolbar.styles';

import { colorsDirect as colors } from 'styles';

export const styles = css`
  ${baseToolbarStyles}

  z-index: 999999999;
  position: fixed;
  bottom: 0;
  /* right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); */
  z-index: 999999999;

  justify-content: flex-end;

  .button-box button.button {
    svg.icon {
      color: ${colors.default50};
    }
    &:hover {
      border-color: transparent;
      background-color: ${colors.grey25};
      svg.icon {
        color: ${colors.greyLight};
      }
    }

    &.active {
      svg.icon {
        color: ${colors.warningDark};
      }
    }
  }

  button.button.button-toggle-query-panel {
    svg.icon {
      transform: translate(-2px, 4px) scale(1.1);
    }
  }
  button.button.button-toggle-auth {
    svg.icon {
      transform: translate(0, -1px) scale(0.9);
    }
  }
  button.button.button-toggle-simple-login {
    svg.icon {
      transform: translate(0, -1px) scale(0.9);
    }
  }
`;
