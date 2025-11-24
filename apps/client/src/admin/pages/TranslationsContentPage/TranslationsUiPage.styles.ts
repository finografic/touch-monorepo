import { css } from '@emotion/react';

import { border, colors, layout, min, spacing } from 'styles';

export const styles = css`
  /* Spacing between independent form sections */
  form {
    /* margin-bottom: 2rem; */
    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .admin-section {
    margin-bottom: 0.5rem;
    &:last-of-type {
      margin-bottom: 2rem;
    }
  }

  input:read-only,
  input:read-only:focus {
    pointer-events: none !important;
    user-select: none !important;
    outline: none !important;
    box-shadow: none !important;
  }

  ${min.md} {
    /* max-width: 96vw !important; */
  }
  ${min.lg} {
    /* max-width: 96vw !important; */
  }
  ${min.xl} {
    /* max-width: 1240px !important; */
  }
`;

export const stylesTabs = css`
  margin: 0 -${spacing.md};
  padding-top: 1rem;
  .p-tabmenu-nav {
    border-bottom: 2px solid ${colors.greyXXLight50};
    display: flex;
    gap: 0.5rem;
    overflow: visible;
    position: relative;

    li.p-tabmenuitem {
      background-color: transparent;
      font-size: 1rem;
      font-weight: 600;
      border: 2px solid ${colors.info};
      border-top-left-radius: ${layout.borderRadius};
      border-top-right-radius: ${layout.borderRadius};
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-color: ${colors.greyXXLight};
      cursor: pointer;

      border-bottom: 2px solid ${colors.greyXXLight};
      display: block;
      a {
        padding: 0.5rem 2.5rem;
        margin-bottom: 5px;
        color: ${colors.text50};
      }
      &[data-p-highlight='true'] {
        border-color: ${colors.info};
        a {
          color: ${colors.infoDark};
        }
      }
    }
  }

  /* border: inset 0 0 1px 0 ${colors.danger}; */

  margin-bottom: 0;
`;
