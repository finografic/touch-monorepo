import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  /* Header content styling - layout handled by Layout.styles.ts */
  width: 100%;
  padding: 0 2.5rem;

  h1 {
    font-size: 1.8rem;
    font-weight: 700;
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
