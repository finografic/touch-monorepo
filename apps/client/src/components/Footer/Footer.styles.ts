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
`;
