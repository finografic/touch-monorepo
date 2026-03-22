import { colors, layout } from '@finografic/design-system/tokens';

import { css } from '@emotion/react';

export const styles = css`
  &[role='dialog'] {
    padding-bottom: 0;
    overflow: hidden;
    background-color: ${colors.background} !important;
    color: ${colors.text} !important;

    display: flex;
    flex-direction: column;
    min-height: 240px !important;

    /* Dialog open/close animations */
    &[data-state='open'] {
      animation: dialogOpen 200ms ease-out;
    }

    &[data-state='closed'] {
      animation: dialogClose 200ms ease-in;
    }

    @keyframes dialogOpen {
      from {
        opacity: 0;
        transform: scale(1.5);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes dialogClose {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.5);
      }
    }

    .has-title {
      .close-button {
        transform: translate(0.25rem, -1rem);
      }
    }

    /* DIALOG HEADER ======================================================== */

    .dialog-header {
      > div {
        width: 100%;
        display: flex;
        flex-shrink: 0;
        padding: 0;

        h1 {
          font-size: 2rem;
          font-weight: 500;
          font-weight: 700;
          font-size: 1.75rem;
          margin: 0;
          color: ${colors.textLight};
        }
      }

      .close-button {
        transform: translate(0.5rem, 0rem) scale(0.9);
        outline: none;
        color: ${colors.textLight};
        &:hover {
          color: ${colors.warningLight};
          background-color: ${colors.warningLighter};
          cursor: pointer;
        }
      }

      &:not(.has-title) {
        position: absolute;
        right: 1.5rem;
      }
    }

    /* DIALOG MAIN ========================================================== */

    .dialog-main {
      display: flex;
      flex-direction: column;
      flex: 1;

      height: 100%;
      min-height: 0;

      overflow: hidden;

      padding: 0 1.5rem 1.15rem 1.5rem;
    }

    /* DIALOG CONTENT ======================================================= */

    .dialog-content {
      display: flex;
      flex-direction: column;
      flex: 1;

      height: 100%;
      min-height: 0;

      position: relative;
      overflow: hidden;

      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: thin;
      scrollbar-color: ${colors.textLight} transparent;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: ${colors.textLight};
        border-radius: 4px;

        &:hover {
          background-color: ${colors.text};
        }
      }
    }

    /* DIALOG TABS ========================================================== */

    [role='tablist'] {
      /* tab-horizontal-rule */
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
          font-weight: 600;
          color: ${colors.textLight};
        }

        svg.icon {
          /* opacity: 0.5; */
          margin-left: -0.33rem;
          margin-right: 0rem;
          transform: translate(-0.25rem, 0) scale(0.8) !important;
          color: ${colors.textXLight};
        }

        &:nth-of-type(1) {
          margin-left: 0rem;
        }
        &:last-child {
          margin-right: 0rem;
        }
      }

      button[role='tab'][data-state='active'] {
        /* active-tab */
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

    /* DIALOG FORMS ========================================================= */

    .form-wrapper {
      width: 100%;
      max-width: 350px;

      .form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
    }

    /* DIALOG FOOTER ======================================================== */

    .footer {
      flex-shrink: 0;
      margin: 0;
      padding: 1.5rem 1.5rem 1.5rem;
      background: transparent;
    }

    .footer-buttons-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      gap: 0.75rem;
    }

    .footer-buttons-wrapper.footer-buttons-rtl {
      flex-direction: row-reverse;
    }

    .footer-buttons-wrapper.footer-buttons-filled {
      width: 100%;
    }

    .footer-buttons-wrapper button {
      font-size: 1.5rem;
    }

    /* Data List View Styles - Moved to individual components */

    /* JSON View Styles - Moved to individual components */
  }
`;
