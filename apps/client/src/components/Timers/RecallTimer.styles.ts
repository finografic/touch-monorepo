import { colors } from '@finografic/design-system/tokens';

import { css } from '@emotion/react';

export const styles = css`
  .config-timer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-weight: 500;
    width: 100%;
    height: 100%;
    padding: 0 20px;
    font-size: 14px;
    color: ${colors.warningDark};
  }
`;
