import { css } from '@emotion/react';
import { colors, spacing, typography } from 'styles';

export const styles = css`
  padding: ${spacing[8]} 0;

  .title {
    ${typography.h1};
    /* color: ${colors.text.primary}; */
    margin-bottom: ${spacing[4]};
  }

  .welcome {
    ${typography.h3};
    /* color: ${colors.text.secondary}; */
    margin-bottom: ${spacing[6]};
  }

  .content {
    background: ${colors.background.secondary};
    padding: ${spacing[6]};
    border-radius: 8px;
    border: 1px solid ${colors.border.light};
  }
`;
