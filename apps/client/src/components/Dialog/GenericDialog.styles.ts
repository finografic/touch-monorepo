import { css } from '@emotion/react';
import { colors, layout } from 'styles';
import { stylesSmallButton } from 'styles/custom/buttons.styles';

export const styles = css`
  &[role='dialog'] {
    padding-bottom: 0;
    overflow: hidden;

    /* Flexbox layout: header -> content -> footer */
    display: flex;
    flex-direction: column;

    h1 {
      font-size: 2rem;
      font-weight: 500;
      margin-bottom: 1.5rem;
    }

    .close-button {
      transform: scale(1.5) translate(-25%);
      color: ${colors.greyLight};
      &:hover {
        color: ${colors.warning};
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
    .dialogContent {
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
    .tabContent {
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
        scrollbar-color: ${colors.greyDark} transparent;

        &::-webkit-scrollbar {
          width: 8px;
        }

        &::-webkit-scrollbar-track {
          background: transparent;
        }

        &::-webkit-scrollbar-thumb {
          background-color: ${colors.greyDark};
          border-radius: 4px;

          &:hover {
            background-color: ${colors.grey};
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
    .singleContent {
      flex: 1;
      min-height: 0;
      padding: 1rem 0;
      overflow-y: auto; /* Enable vertical scrolling */
      overflow-x: hidden; /* Prevent horizontal scrolling */
      height: 100%;

      /* Custom scrollbar styling */
      scrollbar-width: thin;
      scrollbar-color: ${colors.greyDark} transparent;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: ${colors.greyDark};
        border-radius: 4px;

        &:hover {
          background-color: ${colors.grey};
        }
      }
    }

    /* Tab List Styles */
    [role='tablist'] {
      box-shadow: inset 0 -2px 0 0 ${colors.greyXXDark};
      flex-shrink: 0; /* Don't shrink the tab list */

      button[role='tab'] {
        height: 64px;
        padding-bottom: 0;
        span {
          padding: 1.1rem 1rem;
          font-size: 1.2rem;
          font-weight: 500;
          line-height: 1.2;
          color: ${colors.grey};
        }
        &[data-state='active'] {
          &:before {
            background-color: ${colors.info};
            height: 2px;
          }
          span {
            color: ${colors.info};
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
        border: ${layout.borderWidth} solid ${colors.greyXXDark};
        padding: 1.5rem 1rem;
        font-size: 1.2rem;
        font-weight: 500;
        background-color: transparent;

        border-color: ${colors.infoXDark};
        background-color: ${colors.infoDark}11;

        &:hover {
          color: ${colors.infoLight};
          border-color: ${colors.info};
          border-color: ${colors.infoLight};
          background-color: ${colors.info}22;
          /* background-color: ${colors.whiteXXDark}66; */
        }
      }
    }

    /* Data List View Styles - Moved to individual components */

    /* JSON View Styles - Moved to individual components */
  }
`;
