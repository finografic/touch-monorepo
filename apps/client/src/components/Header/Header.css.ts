import { css } from '@emotion/react';
import { colors, mediaQueries, spacing, typography } from 'styles';

export const styles = css`
  .header {
    background-color: ${colors.background.primary};
    border-bottom: 1px solid ${colors.border.light};
    padding: ${spacing[4]} 0;

    ${mediaQueries.down('md')} {
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
