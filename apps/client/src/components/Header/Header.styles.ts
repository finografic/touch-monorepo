import { css } from '@emotion/react';
import { colors, min, spacing } from 'styles';

export const styles = css`
  padding: ${spacing[4]} 0;
  background-color: transparent !important;
  border-bottom: none !important;

  ${min.md} {
    padding: ${spacing[2]} 0;
  }

  h1 {
    color: ${colors.info};
  }
`;
