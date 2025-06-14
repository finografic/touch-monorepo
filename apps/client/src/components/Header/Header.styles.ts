import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  /* Header content styling - layout handled by Layout.styles.ts */
  width: 100%;

  h1 {
    color: ${colors.info};
    margin: 0;
  }

  div[role='menuitem'][data-highlighted] {
    color: ${colors.white} !important;
    background-color: transparent !important;
  }
`;
