import { css } from '@emotion/react';

import { colors } from '@finografic/design-system/tokens';

export const styles = css`
  &.button.fullscreen-toggle {
    svg.icon {
      color: ${colors.white};
    }

    &:hover {
      border-color: transparent;
      svg.icon {
        color: ${colors.infoXLight};
      }
    }

    &.is-fullscreen {
      svg.icon {
        color: ${colors.infoLight};
      }
    }
  }
`;
