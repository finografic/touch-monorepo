import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  min-width: 17vw;
  /* height: 100vh; */
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
`;
