import { css } from '@emotion/react';
import { stylesPad, stylesSmallButton } from 'styles/custom/buttons.styles';

export const actionButtonStyles = css`
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
