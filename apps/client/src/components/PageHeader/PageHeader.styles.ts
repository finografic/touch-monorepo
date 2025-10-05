import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  margin-top: 2em;
  padding-top: 2em;
  margin-bottom: 2rem;
  /* transform: translateY(-5%); */

  .page-title {
    margin-top: 2em;
    padding-top: 2em;
    font-size: 1.66rem;
    font-weight: 600;
    line-height: 2;
    color: ${colors.textXLight};
    margin: 0;
  }

  .page-subtitle {
    font-size: 1.1rem;
    color: ${colors.textXLight};
    margin: 0;
  }
`;
