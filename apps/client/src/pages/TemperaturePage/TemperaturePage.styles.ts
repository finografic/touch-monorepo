import { css } from '@emotion/react';

import { colors } from 'styles';

export const styles = css`
  .page-description {
    transform: translateY(24px);
    position: relative;
    font-size: 1.5rem;
    color: ${colors.info};
    background-color: transparent;
    display: inline-flex;
    label {
      margin: 0;
      padding: 0;
    }
    p {
      max-width: 800px;
      padding: 1rem;
    }
  }
  .temperature-content {
    transform: translateY(80px);
    position: relative;
    font-size: 1.5rem;
    color: ${colors.info};
    background-color: transparent;
    display: inline-flex;
  }
`;
