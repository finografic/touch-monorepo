import { css } from '@emotion/react';

export const styles = css`
  z-index: 9999999;
  position: relative;
  bottom: 3rem;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;

  .controls {
    display: flex;
    gap: 2rem;
  }

  & > div {
    width: 100%;
    justify-content: center;
    display: flex;
    flex-direction: row;

    & > div {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
  }

  div.debug,
  div.debug-data {
    width: 20vw;
    margin: 1rem;
    background-color: #f0f0f0;
    padding: 1rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    font-family: monospace;
    white-space: pre-wrap;
    word-break: break-all;
    overflow-x: auto;
    max-height: 200px;
  }

  div.debug-data pre {
    pointer-events: none;
    width: 66vw;
    height: 400px;
    /* max-height: 400px; */
  }
`;
