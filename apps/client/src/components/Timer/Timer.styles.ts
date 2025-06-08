import { css } from '@emotion/react';

export const styles = css`
  .timer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .timer-digits {
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 1;
  }

  .timer-label {
    font-size: 0.9rem;
  }
`;
