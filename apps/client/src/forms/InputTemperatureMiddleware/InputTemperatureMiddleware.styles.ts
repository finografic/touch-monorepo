import { css } from '@emotion/react';

export const styles = css`
  position: relative;
  width: 100%;

  .temperature-input {
    text-align: right;
    padding-right: 60px;
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: inherit;
  }

  .step-buttons {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 1px;
    z-index: 1;
  }

  .step-up,
  .step-down {
    height: 18px !important;
    width: 24px !important;

    svg {
      height: 12px !important;
      width: 12px !important;
    }
  }

  /* Make sure the input container has proper positioning */
  & > div[data-accent-color] {
    position: relative;
  }
`;
