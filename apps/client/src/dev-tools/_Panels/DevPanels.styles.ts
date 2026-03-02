import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';

export const styles = css`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  min-width: 17vw;
  height: 100%;
  /* height: 100vh; */
  max-height: 100vh;
  padding: 1.5rem;
  overflow-x: visible;
  overflow-y: hidden;

  h2 {
    font-family: monospace;
    font-size: 1rem;
    color: ${colors.info};
    opacity: 0.5;
  }

  pre {
    color: ${colors.textLight};
    font-size: 0.7rem;
    line-height: 1.5;
    margin: 0;
  }

  pre {
    overflow-y: hidden;
  }
`;

export const stylesLeft = css`
  ${styles}
  & *, & pre {
    font-size: 0.8rem;
    font-family: monospace;
  }
  display: flex;
  flex-direction: column;
  position: absolute;
  min-width: 18vw;
  overflow-x: visible;
  top: 0;
  left: 0;
  right: unset;
`;

export const stylesRight = css`
  ${styles}

  & * {
    font-size: 0.8rem;
    font-family: monospace;
  }
  display: flex;
  flex-direction: column;
  position: absolute;
  min-width: 24vw;
  overflow-x: visible;
  top: 0;
  left: unset;
  right: 0;

  pre {
    max-width: 24vw;
    overflow-x: hidden;
  }
`;
