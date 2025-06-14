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

  .current-language {
    color: ${colors.grey};
    font-size: 1.1rem;
    font-weight: 400;

    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;
