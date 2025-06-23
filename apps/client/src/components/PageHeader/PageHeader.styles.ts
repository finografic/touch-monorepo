import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  margin-bottom: 0rem;
  transform: translateY(-10%);

  .page-title {
    font-size: 2rem;
    font-weight: 500;
    line-height: 2;
    color: ${colors.textLight};
    margin: 0;
  }

  .page-subtitle {
    font-size: 1.33rem;
    color: ${colors.text};
    margin: 0;
  }
`;
