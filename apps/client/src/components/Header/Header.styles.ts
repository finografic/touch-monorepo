import { css } from '@emotion/react';
import { colors, min, spacing } from 'styles';

export const styles = css`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: ${spacing[4]} 0;
  background-color: transparent;

  ${min.md} {
    padding: ${spacing[2]} 0;
  }

  h1 {
    color: ${colors.info};
  }

  .language-selector {
    /* Trigger button styling (closed state) */
    button[data-state='closed'] {
      background: transparent;
      color: ${colors.grey}; /* or colors.slate[8] for dimmed grey */

      svg {
        color: currentColor; /* Icons inherit the dimmed color */
      }
    }

    /* Trigger button styling (closed state) */
    button[data-state='open'] {
      background: transparent;
      color: ${colors.grey}; /* or colors.slate[8] for dimmed grey */

      svg {
        color: currentColor; /* Icons inherit the dimmed color */
      }
    }

    /* Dropdown content (open state) */
    [data-radix-dropdown-menu-content] {
      background-color: ${colors.background}; /* Same as app background */

      [data-radix-dropdown-menu-item] {
        color: ${colors.white};

        &[data-highlighted] {
          background-color: rgba(255, 255, 255, 0.1); /* Subtle hover effect */
          color: ${colors.info};
        }

        /* Current selected item */
        &[data-state='checked'] {
          color: ${colors.info};
        }
      }
    }
  }
`;
