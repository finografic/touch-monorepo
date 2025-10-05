import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  /* width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: -webkit-fill-available; */

  /* &.btn,
  &.btn.btn-auth.logged-in {
    svg.icon {
      color: ${colors.white75};
    }
    &:hover {
      border-color: transparent;
      svg.icon {
        color: ${colors.infoLight};
      }
    }
  } */

  &.btn.btn-auth.logged-out {
    svg.icon {
      color: ${colors.greyXXLight};
    }
  }

  &.btn.btn-auth.logged-in {
    svg.icon {
      color: ${colors.successXXLight};
    }
  }
`;
