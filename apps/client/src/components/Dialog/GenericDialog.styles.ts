import { css } from '@emotion/react';
import { button, colors, layout } from 'styles';
import { stylesSmallButton } from 'styles/project/buttons.styles';

export const styles = css`
  &[role='dialog'] {
    padding-bottom: 0;
    overflow: hidden;
    background-color: ${colors.background} !important;
    color: ${colors.text} !important;

    /* Flexbox layout: header -> content -> footer */
    display: flex;
    flex-direction: column;
    min-height: 260px !important;

    h1 {
      font-size: 2rem;
      font-weight: 500;
      margin-bottom: 1.5rem;
      color: ${colors.text} !important;
    }

    .close-button {
      transform: scale(1.5) translate(-25%);
      color: ${colors.textLight} !important;
      &:hover {
        color: ${colors.warning} !important;
        background-color: transparent;
        cursor: pointer;
      }
    }

    /* Dialog Header - Fixed at top */
    .dialog-header {
      flex-shrink: 0; /* Don't shrink */
      padding: 0; /* Remove default padding, let Radix handle it */
    }

    /* Dialog Content - Flexible height */
    .dialog-content {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      /* Make TabsRoot transparent to flex layout */
      .rt-TabsRoot[data-orientation='horizontal'] {
        display: contents;
      }
    }

    /* Tab Content Styles */
    .tab-content {
      flex: 1;
      min-height: 0;
      position: relative;
      overflow: hidden; /* Prevent content from overflowing */
      display: flex;
      flex-direction: column;

      /* Keep TabsList horizontal and at top */
      [role='tablist'] {
        flex-shrink: 0;
        display: flex;
        flex-direction: row;
      }

      [data-state='active'] {
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto; /* Enable vertical scrolling */
        overflow-x: hidden; /* Prevent horizontal scrolling */
        padding: 2rem 0 1rem; /* Add padding for content spacing */
        min-height: 0;

        /* Custom scrollbar styling */
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

        /* Make direct children fill the space */
        > * {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
      }
    }

    /* Single Content Styles (when no tabs) */
    .single-content {
      flex: 1;
      min-height: 0;
      /* padding: 1rem 0; */
      padding: 0 0 1rem 0;
      overflow-y: auto; /* Enable vertical scrolling */
      overflow-x: hidden; /* Prevent horizontal scrolling */
      height: 100%;

      /* Custom scrollbar styling */
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

    /* Tab List Styles */
    [role='tablist'] {
      box-shadow: inset 0 -2px 0 0 ${colors.defaultLight};
      flex-shrink: 0; /* Don't shrink the tab list */

      button[role='tab'] {
        height: 64px;
        padding-bottom: 0;
        span {
          padding: 1.1rem 1rem;
          font-size: 1.2rem;
          font-weight: 500;
          line-height: 1.2;
          color: ${colors.textLight};
        }
        &[data-state='active'] {
          &:before {
            background-color: ${colors.primary};
            height: 2px;
          }
          span {
            color: ${colors.primary};
          }
        }
      }
    }

    /* Dialog Footer - Fixed at bottom */
    .footer {
      flex-shrink: 0; /* Don't shrink */
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
