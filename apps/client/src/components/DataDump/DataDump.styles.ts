import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';

export const styles = css`
  &.json-view {
    flex: 1 1 auto;
    display: block;
    margin: 0;
    padding: 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    line-height: 1.66;
    letter-spacing: 0.033em !important;
    white-space: pre-wrap;
    word-break: break-word;
    background-color: rgba(0, 0, 0, 0.2);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.02em;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    min-height: 0;
    box-sizing: border-box;
    width: 100%;

    /* Color variants */
    &[data-color='blue'] {
      color: #60a5fa;
      color: ${colors.info};
    }
    &[data-color='amber'] {
      color: #fbbf24;
      color: ${colors.warning};
    }
    &[data-color='gray'] {
      color: #9ca3af;
      color: ${colors.grey};
    }
    &[data-color='orange'] {
      color: #fb923c;
      color: ${colors.warningDark};
    }

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

  /* Empty state styling */
  &.json-view-empty {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.2);
    height: 100%;
    min-height: 0;
    color: ${colors.greyLight};
    font-style: italic;
    margin: 0;
    box-sizing: border-box;
    width: 100%;
  }
`;
