import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  margin-bottom: 0rem;
  transform: translateY(-5%);

  .page-title {
    font-size: 1.66rem;
    font-weight: 600;
    line-height: 2;
    color: ${colors.textXLight};
    margin: 0;
  }

  .page-subtitle {
    font-size: 1.2rem;
    color: ${colors.text};
    margin: 0;
  }
`;
