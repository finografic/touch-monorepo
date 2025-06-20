import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  &.data-list {
    [data-accent-color] {
      --accent-9: ${colors.info};
    }

    [data-radix-data-list-item] {
      display: flex;
      gap: 1.5rem;
      align-items: baseline;
    }

    flex: 1;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.5rem 0;
    display: flex;
    flex-direction: column;
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

    .label {
      color: ${colors.info} !important;
      font-weight: 600;
      font-size: 1rem;
    }

    .value {
      font-size: 1rem;
    }
  }
`;
