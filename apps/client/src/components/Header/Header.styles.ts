import { css } from '@emotion/react';
import { colors, min, spacing, typography } from 'styles';

export const styles = css`
  .header {
    background-color: ${colors.background};
    border-bottom: 1px solid ${colors.greyXLight};
    padding: ${spacing[4]} 0;

    ${min.md} {
      padding: ${spacing[2]} 0;
    }
  }

  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    ${typography.h3};
    color: ${colors.primary[600]};
  }

  nav.user-menu {
    display: flex;
    align-items: center;
    gap: ${spacing[4]};
  }
`;
