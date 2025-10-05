import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  &.btn.theme-toggle {
    svg.icon {
      color: ${colors.white75};
    }

    &:hover {
      border-color: transparent;
      svg.icon {
        color: ${colors.infoXLight};
      }
    }

    &:active {
    }
  }
`;
