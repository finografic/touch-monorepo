import { colors, layout } from '@finografic/design-system/tokens';

import { css } from '@emotion/react';

export const styles = css`
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.white};
  color: ${colors.text};

  .sound-library-list {
    .sound-library-item {
      padding: 0.75rem;
      border: 1px solid ${colors.greyLight};
      border-radius: 8px;
      background-color: ${colors.white};
      svg.icon.icon-check {
        width: 1.5rem;
        height: 1.5rem;
        color: white;
        color: ${colors.successDark};
        background-color: ${colors.successLight};
        border: 2px solid ${colors.successLighter};
        border-radius: 50%;
      }
    }
  }
`;
