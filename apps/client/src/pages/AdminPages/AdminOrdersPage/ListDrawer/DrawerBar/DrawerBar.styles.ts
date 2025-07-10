import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  width: 100%;
  height: ${layout.drawer.bar.height};
  padding: 0.6rem 2.5rem 0.4rem 2.5rem;

  .col-children {
    flex: 1;
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
