import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 1vw;
  min-width: 12vw;
  height: 100vh; /* Use viewport height for the wrapper */
  padding: 1.5rem;
  overflow: hidden; /* Control overflow at the container level */

  .filters {
    color: ${colors.textLight};
    font-size: 0.85rem;
    font-family: monospace;
    line-height: 1.5;
    margin: 0;
    padding: 0;
    flex: 0 0 auto; /* Don't grow or shrink, use content height */
  }

  .results-list {
    font-size: 0.85rem;
    flex: 1; /* Fill remaining space */
    min-height: 0; /* Allow flex container to shrink below content size */
    margin-top: 1rem;
    display: flex;
    flex-direction: column;

    pre {
      font-size: 0.85rem;
      flex: 1;
      overflow-y: auto; /* Enable scrolling if content overflows */
      margin: 0;
    }

    .result-row {
      line-height: 0.66;
    }
  }

  h2,
  h4 {
    font-family: monospace;
    font-size: 1rem;
    color: ${colors.info};
    opacity: 0.5;
    margin: 0 0 0.5rem 0;
  }

  pre {
    color: ${colors.textLight};
    font-size: 0.7rem;
    line-height: 1.5;
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
  min-width: 18vw;
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
