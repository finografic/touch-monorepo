import { css } from '@emotion/react';

import { colors, layout } from '@workspace/design-system/tokens';

export const styles = css`
  .screen-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: ${layout.borderRadius};
    opacity: 0.33;
    background-color: #00cc9944;
    box-shadow: inset 0 0 0 3px ${colors.greyDark};
    z-index: 999999;

    @media (max-width: 1024px) and (max-height: 600px) {
      opacity: 0.55;
    }
  }

  .screen-800x480 {
    width: 800px;
    height: 480px;
  }

  .screen-1024x600 {
    width: 1024px;
    height: 600px;
  }
`;
