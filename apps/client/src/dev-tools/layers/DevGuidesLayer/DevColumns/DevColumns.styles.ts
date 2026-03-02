import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';

const colsColor = colors.greyXLight;
const colsOpacity = 0.5;

export const styles = css`
  top: 0;
  bottom: 0;
  position: absolute;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: ${colsOpacity};
  .toolbar-col {
    box-shadow: inset 0 0 0 2px ${colsColor};
    &:first-of-type {
      box-shadow: inset 1px 0 0 2px ${colsColor};
    }
    &:last-of-type {
      box-shadow: inset -1px 0 0 2px ${colsColor};
    }
  }
`;
