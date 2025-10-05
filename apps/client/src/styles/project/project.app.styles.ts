import { css } from '@emotion/react';
import { colors } from 'styles';

export const stylesAppContent = css`
  &.temperature-content,
  &.time-content {
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
