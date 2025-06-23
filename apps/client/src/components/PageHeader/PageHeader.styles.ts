import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  padding: 1.5rem 0;
  border-bottom: 1px solid ${colors.greyLight};
  margin-bottom: 1.5rem;

  .page-title {
    color: ${colors.textDark};
    font-weight: 600;
    margin: 0;
  }

  .page-subtitle {
    color: ${colors.text};
    margin: 0;
    opacity: 0.8;
  }
`;
