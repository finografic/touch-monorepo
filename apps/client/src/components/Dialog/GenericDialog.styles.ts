import { css } from '@emotion/react';
import { button, colors, layout } from 'styles';
import { stylesSmallButton } from 'styles/project/buttons.styles';

export const styles = css`
  &[role='dialog'] {
    padding-bottom: 0;
    overflow: hidden;
    background-color: ${colors.background} !important;
    color: ${colors.text} !important;

    display: flex;
    flex-direction: column;
    min-height: 260px !important;

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
        transform: translate(0.25rem, 0rem);
        color: ${colors.textLight};
        &:hover {
          color: ${colors.warningLight};
          background-color: ${colors.warningLight25};
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

      padding: 0 0 1.5rem 0;

      .rt-TabsRoot[data-orientation='horizontal'] {
        display: contents;
      }
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
      box-shadow: inset 0 -0.2rem 0 0 ${colors.defaultXXLight25};

      button[role='tab'] {
        height: 4rem;
        margin: 0.2rem 0.15rem 0;
        padding: 0;
        border: 0 !important;

        span {
          padding: 0.8em 1.25em;
          font-size: 1rem;
          font-weight: 600;
          color: ${colors.textLight75};
        }

        svg.icon {
          /* opacity: 0.5; */
          margin-left: -0.33rem;
          margin-right: 0rem;
          transform: translate(-0.25rem, 0) scale(0.8) !important;
          color: ${colors.textXLight75};
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
          color: ${colors.info75};
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
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0; /* Remove margin */
      padding: 1.5rem 0rem; /* Add padding for spacing */
      background: transparent;

      /* button {
        ${stylesSmallButton}
        border: ${button.border.width} solid ${button.color.default};
        padding: 1.5rem 1rem;
        font-size: 1.2rem;
        font-weight: 500;
        background-color: ${colors.background};
        color: ${colors.text};

        border-color: ${colors.primary};
        background-color: ${colors.background};

        &:hover {
          color: ${colors.primary};
          border-color: ${colors.primary};
          background-color: ${button.color.hover};
        }
      } */
    }

    /* Data List View Styles - Moved to individual components */

    /* JSON View Styles - Moved to individual components */
  }
`;
