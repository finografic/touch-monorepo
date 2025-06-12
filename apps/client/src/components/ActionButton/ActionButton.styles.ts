import { css } from '@emotion/react';
import { stylesNavButton, stylesPad } from 'styles/custom/buttons.styles';

export const ActionButtonStyles = css`
  /* Navigation button styles (for footer buttons) */
  &.nav-button {
    ${stylesNavButton}
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
