import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  width: 100%;
  height: ${layout.drawer.bar.height};
  padding: 0.6rem 2rem 0.4rem 2rem;

  .col-children {
    &:not(:empty) {
      &:not(.active) {
        cursor: pointer;
        .drawer-children {
          pointer-events: none;
        }
      }
    }
  }

  .col-button {
    flex: 1;
    button {
      color: ${colors.infoXDark};
      opacity: 0.66;
      &:hover {
        cursor: pointer;
        color: ${colors.infoDark};
        opacity: 1;
      }
    }
  }
`;
