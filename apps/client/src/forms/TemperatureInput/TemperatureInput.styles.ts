import { css } from '@emotion/react';
import { baseInputStyles } from 'styles/custom/inputs.styles';

export const styles = css`
  ${baseInputStyles}

  max-width: 160px;
  /* overflow: visible;
  overflow-x: visible;
  overflow-y: visible; */

  .temperature-input-root {
    text-align: right;
  }
`;
