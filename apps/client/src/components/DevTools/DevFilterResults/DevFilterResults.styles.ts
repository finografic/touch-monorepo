import { css } from '@emotion/react';
import { colors } from 'styles';

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

  /* background-color: ${colors.grayXXDark}; */

  .filters {
    /* background-color: ${colors.grayXXDark}; */
    color: ${colors.textLight};
    font-size: 0.85rem;
    font-family: monospace;
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }

  .results-list {
    /* background-color: ${colors.grayXXDark}; */
    font-size: 0.85rem;
    height: 66vh !important;
    pre {
      font-size: 0.85rem;
      height: 66vh !important;
      overflow-x: visible;
      overflow-y: visible;
    }
  }

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
  & * {
    font-size: 0.8rem;
    font-family: monospace;
  }
  display: flex;
  flex-direction: column;
  position: absolute;
  min-width: 17vw;
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
  top: 0;
  left: unset;
  right: 0;
`;
