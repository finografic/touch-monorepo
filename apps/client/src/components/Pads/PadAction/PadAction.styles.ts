import { css } from '@emotion/react';
import { stylesPad } from 'components/Pads/Pad/PadBasic.styles';

import { stylesSmallButton } from 'styles/project/buttons.styles';

export const stylesPadAction = css`
  /* Navigation button styles (for footer buttons) */
  &.small-button {
    ${stylesSmallButton}
    svg {
      font-size: 8.5rem;
    }
  }

  /* Pad styles (for content area buttons like pad-rect) */
  &.pad-rect {
    ${stylesPad}
    border-radius: 8px;
    width: 310px;
    min-height: 80px;
    font-size: 1.5rem;
    padding: 1rem;
    text-align: center;
  }
`;
