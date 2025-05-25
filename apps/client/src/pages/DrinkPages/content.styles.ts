import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  &.temperature-content {
    min-width: 800px;
    min-height: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .page-description {
    margin-top: -33%;
    margin-bottom: -8%;
  }
`;
