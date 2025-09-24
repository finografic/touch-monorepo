import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  &.btn.logged-out,
  &.btn.logged-in {
    cursor: pointer;
    svg.icon {
      color: ${colors.greyXLight};
    }
    &:hover {
      border-color: transparent;
      svg.icon {
        color: ${colors.infoLight};
      }
    }
  }

  &.btn.logged-out {
    svg.icon {
      color: ${colors.greyXXLight};
    }
  }

  &.btn.logged-in {
    svg.icon {
    }
  }
`;
