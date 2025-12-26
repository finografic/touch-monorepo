import { css } from '@emotion/react';
import { min } from 'styles';
import { BREAKPOINTS } from 'styles/viewport/viewport.breakpoints';

export const styles = css`
  width: 100%;

  /* ${min.sm} {
    max-width: 94vw;
  }
  ${min.md} {
    max-width: 96vw;
  }
  ${min.lg} {
    max-width: 96vw;
  }
  ${min.xl} {
    max-width: ${BREAKPOINTS.xl}px;
  } */

  body {
    margin: 0;
    font-family: system-ui, sans-serif;
  }

  .navbar {
    border-bottom: 1px solid #ddd;
    padding: 0 12px;
    overflow: hidden;
  }

  .nav-items {
    display: flex;
    align-items: center;
    position: relative;
    height: 48px;
  }

  .nav-item {
    background: none;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    white-space: nowrap;
  }

  .nav-item:hover {
    background: #f2f2f2;
  }

  .more-wrapper {
    position: relative;
  }

  .popover {
    position: absolute;
    right: 0;
    top: 100%;
    background: white;
    border: 1px solid #ddd;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    min-width: 160px;
    z-index: 10;
  }

  .popover-item {
    width: 100%;
    padding: 8px 12px;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
  }

  .popover-item:hover {
    background: #f2f2f2;
  }

  /* Invisible measurement container */
  .measure {
    position: absolute;
    visibility: hidden;
    height: 0;
    overflow: hidden;
    white-space: nowrap;
  }
`;
