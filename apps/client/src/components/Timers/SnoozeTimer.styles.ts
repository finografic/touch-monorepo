import { css } from '@emotion/react';

import { colors } from 'styles/colors/colors.styles';

export const styles = css`
  .snooze-timer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 48px;
    position: fixed;
    bottom: 0;
    left: 50vw;
    transform: translate(-50%, -15%);

    padding: 0 15px 0 0;
    font-size: 14px;
    color: ${colors.infoLight};
    opacity: 0.66;
    user-select: none;

    svg.icon {
      transform: translate(2px, -3px) scale(0.66) !important;
    }
  }
`;
