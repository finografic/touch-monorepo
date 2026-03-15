import { colors, layout } from '@finografic/design-system/tokens';

import { css } from '@emotion/react';

export const stylesAdminContent = css`
  /* ADMIN-PAGE-LAYOUT ======================================================= */

  /* TABS ========================================================== */

  [role='tablist'] {
    margin-top: 0.66rem;
    /* border-bottom: 3px solid ${colors.infoLight}; */
    box-shadow: inset 0 -0.2rem 0 0 ${colors.infoLight};
    border-bottom: none !important;
    padding: 0 2px;

    button[role='tab'] {
      height: 3rem;
      margin: 0.2rem 0.15rem 0.2rem;
      padding: 0;
      border: 0 !important;

      position: relative;
      box-sizing: border-box;

      span {
        font-size: 1rem;
        font-weight: 700;
        color: ${colors.textXLight};
        padding: 0.8em 1.25em;
        border-top-left-radius: ${layout.borderRadius};
        border-top-right-radius: ${layout.borderRadius};
        border: 2px solid ${colors.greyXXLight};
        border-bottom: none;
      }

      &:hover {
        cursor: pointer;
        span {
          color: ${colors.info};
          color: ${colors.textLight};
          border: 2px solid ${colors.greyXLight};
          border-bottom: none;
        }
      }

      &[data-state='active'] {
        margin: 0rem 0.05rem 0rem;
        height: 3.4rem;
        background-color: ${colors.white};
        span {
          color: ${colors.info};
          border: 3px solid ${colors.infoLight};
          border-bottom: none;
        }
        &:before {
          background-color: ${colors.white};
        }
        &:hover {
          cursor: default;
          span {
            background-color: ${colors.white};
          }
        }
        box-shadow: 3px 4px 3px -3px ${colors.greyXXXLight};
        position: relative;
        z-index: 10;
      }

      &:nth-of-type(1) {
        margin-left: 0rem;
      }
      &:last-child {
        margin-right: 0rem;
      }
    }

    button[role='tab'][data-state='active'],
    button[role='tab'][data-state='active'] + button[role='tab'] {
      span {
        /* margin-left: -1px; */
      }
    }
  }
`;
