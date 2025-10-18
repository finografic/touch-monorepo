import { css } from '@emotion/react';

import { colors } from 'styles';

export const baseDataListStyles = css`
  /* Wrapper to constrain list view height */
  &.data-list-wrapper {
    height: fit-content;
    max-height: 60vh; /* Constrain height for list view */
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1rem 1.5rem; /* Increased vertical padding */

    /* Custom theme colors for Radix DataList */
    [data-accent-color] {
      --accent-9: ${colors.info};
    }

    /* Apply styles to nested DataList */
    .data-list {
      gap: 0.75rem; /* Reduce grid gap for tighter rows */

      /* Label styling */
      [data-radix-data-list-label] {
        color: ${colors.info} !important;
        font-weight: 600 !important;
        font-size: 1rem !important;
        min-width: 120px; /* Consistent label width */
      }

      /* Value styling */
      [data-radix-data-list-value] {
        font-size: 1rem !important;
        color: ${colors.textLight} !important; /* Lighter color for values */
      }
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
  &.data-list-empty {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.2);
    height: 100%;
    min-height: 0;
    color: ${colors.greyLight};
    font-style: italic;
  }
`;
