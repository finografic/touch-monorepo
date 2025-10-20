import { css } from '@emotion/react';

import { colors } from 'styles/colors/colors.styles';

export const styles = css`
  .snooze-timer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
    padding: 0 20px;
    font-size: 14px;
    color: inherit;
    color: ${colors.infoLight};
    opacity: 0.66;
    user-select: none;

    svg.icon {
      transform: translate(2px, -3px) scale(0.66) !important;
    }
  }
`;
