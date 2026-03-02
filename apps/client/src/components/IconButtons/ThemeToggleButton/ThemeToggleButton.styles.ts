import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';

export const styles = css`
  &.button.theme-toggle {
    svg.icon {
      color: ${colors.white75};
    }
    &:hover {
      border-color: transparent;
      svg.icon {
        color: ${colors.infoXLight};
      }
    }
  }
`;
