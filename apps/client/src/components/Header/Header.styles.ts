import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  /* Header content styling - layout handled by Layout.styles.ts */
  width: 100%;
  padding: 0 2.5rem;

  h1 {
    display: flex;
    align-items: center;
    font-size: 1.8rem;
    font-weight: 700;
    color: ${colors.info};
    margin: 0 0 0 0.8rem;

    span.current-language {
      font-size: 1.6rem;
      font-weight: 600;
      color: ${colors.info};
      margin: 0 0 0 0.8rem;
      opacity: 0.4;
      transform: translateY(-4%);
      text-transform: none;
    }
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

  .dev-session-a,
  .dev-session-b {
    color: ${colors.greyXLight};
    font-size: 0.9rem;
    font-weight: 400;
    position: absolute;
    top: 3vw;
    text-align: center;
  }

  .dev-session-b {
    text-align: left;
    top: 5vw;
    font-size: 0.8rem;
  }
`;
