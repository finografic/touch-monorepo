import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  & {
    transform: translateY(100px);
  }

  .page-description {
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
      padding-bottom: 4rem;
    }
  }
  .temperature-content {
    position: relative;
    font-size: 1.5rem;
    color: ${colors.info};
    background-color: transparent;
    display: inline-flex;
  }
`;
