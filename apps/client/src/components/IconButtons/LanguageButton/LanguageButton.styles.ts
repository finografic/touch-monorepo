import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  &.button.logged-out,
  &.button.logged-in {
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

  &.button.logged-out {
    svg.icon {
      color: ${colors.greyXXLight};
    }
  }

  &.button.logged-in {
    svg.icon {
    }
  }
`;
