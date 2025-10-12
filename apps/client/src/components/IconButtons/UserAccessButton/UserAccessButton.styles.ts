import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  &.button.button-auth.logged-out,
  &.button.button-auth.logged-in {
    svg.icon {
      color: ${colors.white75};
    }
    &:hover {
      border-color: transparent;
      svg.icon {
        color: ${colors.infoLight};
      }
    }
  }

  &.button.button-auth.logged-out {
    svg.icon {
      color: ${colors.greyXXLight};
    }
  }

  &.button.button-auth.logged-in {
    svg.icon {
    }
  }
`;
