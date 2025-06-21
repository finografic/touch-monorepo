import { css } from '@emotion/react';
import { colors, spacing } from 'styles';

export const styles = css`
  width: 100%;
  min-height: 100%;

  .languages-list,
  .selected-languages-list {
    .language-item {
      margin-top: 0.5rem;
      background-color: ${colors.white};
      border: 1px solid ${colors.greyLight};
      transition: all 0.2s ease;

      &:hover {
        border-color: ${colors.grey};
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .delete-button {
        padding: 1.25rem;
        svg {
          width: 1.5rem;
          height: 1.5rem;
        }
        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .languages-section,
  .search-section,
  .selected-section,
  .stats-section {
    margin-bottom: ${spacing[8]};
  }

  .stats-section {
    margin-top: 2rem !important;
  }

  .language-flag {
    margin: 0 1rem 0 1rem;
  }

  .alert.no-selection {
    p.rt-CalloutText {
      padding: 0 1rem;
      max-width: unset;
    }
  }
`;
