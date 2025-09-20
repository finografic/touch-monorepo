import { css } from '@emotion/react';
import { colors, layout } from 'styles';
import { stylesSmallButton } from 'styles/project/buttons.styles';

export const styles = css`
  &[role='dialog'] {
    padding-bottom: 0;
    overflow: hidden;
    background-color: var(--color-background) !important;
    color: var(--color-text) !important;

    /* Flexbox layout: header -> content -> footer */
    display: flex;
    flex-direction: column;
    min-height: 260px !important;

    h1 {
      font-size: 2rem;
      font-weight: 500;
      margin-bottom: 1.5rem;
      color: var(--color-text) !important;
    }

    .close-button {
      transform: scale(1.5) translate(-25%);
      color: var(--color-text-secondary) !important;
      &:hover {
        color: var(--color-warning) !important;
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
        scrollbar-color: var(--color-text-secondary) transparent;

        &::-webkit-scrollbar {
          width: 8px;
        }

        &::-webkit-scrollbar-track {
          background: transparent;
        }

        &::-webkit-scrollbar-thumb {
          background-color: var(--color-text-secondary);
          border-radius: 4px;

          &:hover {
            background-color: var(--color-text);
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
      scrollbar-color: var(--color-text-secondary) transparent;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: var(--color-text-secondary);
        border-radius: 4px;

        &:hover {
          background-color: var(--color-text);
        }
      }
    }

    /* Tab List Styles */
    [role='tablist'] {
      box-shadow: inset 0 -2px 0 0 var(--color-border);
      flex-shrink: 0; /* Don't shrink the tab list */

      button[role='tab'] {
        height: 64px;
        padding-bottom: 0;
        span {
          padding: 1.1rem 1rem;
          font-size: 1.2rem;
          font-weight: 500;
          line-height: 1.2;
          color: var(--color-text-secondary);
        }
        &[data-state='active'] {
          &:before {
            background-color: var(--color-primary);
            height: 2px;
          }
          span {
            color: var(--color-primary);
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
      padding: 1.5rem 1rem; /* Add padding for spacing */
      background: transparent;

      button {
        ${stylesSmallButton}
        border: ${layout.borderWidth} solid var(--color-border);
        padding: 1.5rem 1rem;
        font-size: 1.2rem;
        font-weight: 500;
        background-color: var(--color-background);
        color: var(--color-text);

        border-color: var(--color-primary);
        background-color: var(--color-background);

        &:hover {
          color: var(--color-primary);
          border-color: var(--color-primary);
          background-color: var(--color-background-hover);
        }
      }
    }

    /* Data List View Styles - Moved to individual components */

    /* JSON View Styles - Moved to individual components */
  }
`;
