import { css } from '@emotion/react';

import { border, button, colors, layout } from '@workspace/design-system/tokens';

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
  button[role='radio'].language-radio {
    border: ${button.border.width} solid transparent !important;
    cursor: pointer;
    padding: 2.1rem 2rem 1.9rem 2rem;
    margin-top: 0.5rem;
    /* border: ${button.border.width} solid ${colors.defaultXXXLight}; */
    outline: none !important;

    border-radius: ${border.radius.sm}!important;

    box-shadow: inset 0 0 0 0 transparent !important; /* TEST: Add a green box-shadow to the button */

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

    /* State-based only (no :hover — touch screens get stuck) */
    &.checked,
    &[data-state='checked'],
    &[aria-checked='true'] {
      border: ${button.border.width} solid ${colors.default};
    }
    /* background-color: ${colors.default};
    color: ${colors.white};
    border: ${button.border.width} solid ${colors.default}; */
  }
`;
