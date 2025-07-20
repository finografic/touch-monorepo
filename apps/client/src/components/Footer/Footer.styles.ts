import { css } from '@emotion/react';
import { layout } from 'styles';

export const styles = css`
  /* Footer content styling - layout handled by Layout.styles.ts */

  width: 100%;
  height: ${layout.footer.height};
  min-height: ${layout.footer.height};
  max-height: ${layout.footer.height};
  display: flex;
  align-items: center;
  justify-content: space-between; /* Ensure proper spacing between left and right toolbars */

  /* Ensure right side takes full width for proper alignment */
  > div:last-child {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    padding-right: 2rem;
  }

  /* Navigation wrapper - takes full width for now */
  .nav-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;
