import { css } from '@emotion/react';
import { styles as stylesButton } from 'components/ButtonControl/ButtonControl.styles';

import { colorsDirect as colors } from 'styles';

export const styles = css`
  position: fixed;
  width: 100%;
  bottom: 0;

  button#toggle-query-devtools {
    ${stylesButton}
    position: fixed;
    bottom: 2vw;
    right: 2vh;
    z-index: 1000;
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
  }
`;
