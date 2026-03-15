import { css } from '@emotion/react';

import { colors } from '@finografic/design-system/tokens';

export const styles = css`
  .defrost-timer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 48px;
    /* position: fixed; */
    bottom: 0;
    /* left: 50vh; */
    /* transform: translate(33%, -15%); */

    padding: 3rem 0;
    font-size: 3rem;
    font-weight: 600;
    color: ${colors.infoLight};
    /* opacity: 0.66; */
    user-select: none;
    transform: translate(-8%, 0);

    svg.icon {
      /* transform: translate(2px, -3px) scale(0.66) !important; */
    }
  }
`;
