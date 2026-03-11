import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';

export const styles = css`
  .tab-content-list {
    margin-top: 0 !important;
  }

  .tab-content {
    height: 66vh;
    .tab-content-new,
    .tab-content-edit {
      overflow-y: hidden;
      top: 260px;
    }
  }

  /* DIALOG TABS ========================================================== */

  [role='tablist'] {
    box-shadow: inset 0 -2px 0 0 transparent;
    box-shadow: inset 0 -0.2rem 0 0 ${colors.defaultXXXLight};

    button[role='tab'] {
      height: 4rem;
      margin: 0.2rem 0.15rem 0;
      padding: 0;
      border: 0 !important;

      span {
        padding: 0.8em 1.25em;
        font-size: 1rem;
        font-weight: 700;
        color: ${colors.textLight};
      }

      svg.icon {
        margin-left: -0.33rem;
        margin-right: 0rem;
        transform: translate(-0.25rem, 0) scale(0.8) !important;
        color: ${colors.textXLight};
      }

      &:nth-of-type(1) {
        margin-left: 0rem;
      }
      &:last-of-type {
        margin-right: 0rem;
      }
    }

    button[role='tab'][data-state='active'] {
      &:before {
        background-color: ${colors.infoLight};
        height: 0.2rem;
      }
      span {
        color: ${colors.infoLight};
        color: ${colors.info};
      }

      svg.icon {
        color: ${colors.infoLight};
      }
    }
  }

  /* ORDERS DATATABLE TWEAKS ============================================== */

  /* Slightly smaller header text and consistent padding */
  .table__th {
    font-size: 0.7rem;
    padding-block: 0.5rem;
    padding-inline: 0.75rem;
  }

  /* When a filter input is present in the header, keep same padding but remove extra top spacing */
  .table__th .input {
    margin-top: 0;
  }

  /* Body cells: tighter type with consistent padding */
  .table__td {
    font-size: 0.8rem;
    padding-block: 0.5rem;
    padding-inline: 0.75rem;
  }

  /* Actions column — larger icons with small vertical padding on the button */
  .table__td:last-child button {
    padding-block: 0.25rem;
  }

  .table__td:last-child button .icon {
    transform: scale(1.5);
  }
`;
