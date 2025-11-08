import { css } from '@emotion/react';

import { colorsDirect as colors } from 'styles';

export const styles = css`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  min-width: 24vw;
  height: 100vh; /* Use viewport height for the wrapper */
  padding: 1.5rem;
  overflow: visible; /* Allow content to overflow for visibility */
  pointer-events: none;

  /* Force Row components to respect overflow */
  .row {
    margin: 0;
    width: 100%;
    min-width: fit-content;
  }

  .filters {
    color: ${colors.textXLight};
    font-size: 0.85rem !important;
    font-family: monospace;
    line-height: 1.5;
    margin: 0;
    padding: 0;
    flex: 0 0 auto; /* Don't grow or shrink, use content height */
    width: 100%;
    min-width: fit-content;
  }

  .results-list {
    font-size: 0.85rem !important;
    flex: 1; /* Fill remaining space */
    min-height: 0; /* Allow flex container to shrink below content size */
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: fit-content;

    .result-header,
    .result-row {
      display: flex;
      align-items: center;
      line-height: 1.2;
      width: 100%;
      min-width: fit-content;
      white-space: nowrap;
      max-height: 20px;
      margin: 0 0 8px 0;
      padding: 0;
      background: none;
      box-shadow: none;
      border: none;
    }
    .result-header {
      .result-col {
        font-weight: bold;
        opacity: 0.5;
      }
    }

    .result-col {
      flex: 2;
      min-width: 80px;
      max-width: 180px;
      text-align: left;
      margin-right: 8px;
      padding: 0;
      font-family: monospace;
      font-size: 0.85rem !important;
      display: flex;
      align-items: center;
      overflow: visible;
      white-space: nowrap;
      color: ${colors.textXLight};

      /* Ensure p elements inside result-col also have correct font size */
      p {
        font-size: 0.85rem !important;
        font-family: monospace;
        margin: 0;
        color: ${colors.textXLight};
      }

      /* Ensure strong elements inside result-col also have correct font size */
      strong {
        font-size: 0.85rem !important;
        font-family: monospace;
        color: ${colors.textXLight};
      }
    }
    .result-col:last-child {
      margin-right: 0;
    }
  }

  h2,
  h4 {
    font-family: monospace;
    font-size: 1rem !important;
    color: ${colors.info};
    opacity: 0.8;
    margin: 0 0 0.5rem 0;
    white-space: nowrap; /* Prevent text wrapping in headers */
  }

  pre {
    color: ${colors.textXLight};
    font-size: 0.7rem !important;
    line-height: 1.5;
    width: 100%;
    min-width: fit-content;
  }
`;

export const stylesLeft = css`
  ${styles}
  & * {
    font-size: 0.8rem !important;
    font-family: monospace;
  }
  display: flex;
  flex-direction: column;
  position: absolute;
  min-width: 18vw;
  width: fit-content; /* Allow container to grow with content */
  top: 0;
  left: 0;
  right: unset;
`;

export const stylesRight = css`
  ${styles}
  & * {
    font-size: 0.8rem !important;
    font-family: monospace;
  }
  display: flex;
  flex-direction: column;
  position: absolute;
  min-width: 24vw;
  width: fit-content; /* Allow container to grow with content */
  top: 0;
  left: unset;
  right: 0;
`;
