import { css } from '@emotion/react';

import { colors, layout, radiiTokens } from '@finografic/design-system/tokens';

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

  /* Language radio items — Ark UI renders RadioGroup.Item as <label>, not <button> */
  label.language-radio {
    width: 100%;
    cursor: pointer;
    outline: none !important;

    /***** flag *****/
    svg,
    img {
      margin-right: 0.5rem;
    }
    * {
      letter-spacing: 0.05em;
    }
    span.separator {
      margin: 0 0.75rem;
    }
    span.label-language {
      color: ${colors.grey};
      font-weight: 500;
    }
  }
`;
