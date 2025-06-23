import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  margin-bottom: 1.5rem;

  .page-title {
    font-size: 2rem;
    font-weight: 500;
    line-height: 1.6;
    color: ${colors.textLight};
    margin: 0;
  }

  .page-subtitle {
    color: ${colors.text};
    margin: 0;
    opacity: 0.8;
  }
`;
