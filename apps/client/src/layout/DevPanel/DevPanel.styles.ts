import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 15vw;
  height: 100%;
  padding: 1.5rem;
  overflow-x: visible;

  /* border: 1px solid white; */

  h2 {
    font-family: monospace;
    font-size: 1rem;
    color: ${colors.info};
    opacity: 0.5;
  }

  pre {
    color: ${colors.text};
    font-size: 0.7rem;
    line-height: 1.5;
    margin: 0;
    /* white-space: wrap; */
  }
`;
