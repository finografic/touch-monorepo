import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  /* Trigger button styling (closed state) */
  button[data-state='closed'] {
    background: transparent;
    color: ${colors.grey};
    svg {
      color: currentColor; /* Icons inherit the dimmed color */
    }
  }

  /* Trigger button styling (open state) */
  button[data-state='open'] {
    background: transparent;
    color: ${colors.grey};
    cursor: pointer;
    svg {
      color: currentColor; /* Icons inherit the dimmed color */
    }
  }

  /* Dropdown content (open state) */
  [data-radix-dropdown-menu-content] {
    background-color: ${colors.background};

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

  /* Trigger button styling (open state) */
  button {
    cursor: pointer;
    padding: 2rem 2rem;
    margin-top: 0.5rem;
    svg,
    img {
      margin-right: 0.5rem;
    }
    * {
      letter-spacing: 0.05em;
    }
  }
`;
