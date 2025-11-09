import { css } from '@emotion/react';

import { colors, spacing } from 'styles';

export const styles = css`
  .ui-label-section {
    margin-bottom: ${spacing.xl};

    .labels-grid-content {
      .translation-item {
        background-color: ${colors.white};
        border: 1px solid ${colors.greyLight};
        border-radius: 8px;
        padding: ${spacing.default};
        margin-bottom: ${spacing.default};

        &:hover {
          border-color: ${colors.greyDark};
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .key-field {
          input {
            background-color: ${colors.greyXLight};
            border: 1px solid ${colors.greyLight};
            color: ${colors.greyDark};
            font-weight: 500;
            font-family: 'Fira Code', monospace;
            font-size: 0.875rem;
          }
        }

        .translation-field {
          input {
            border: 1px solid ${colors.greyLight};
            transition:
              border-color 0.2s ease,
              box-shadow 0.2s ease;

            &:focus {
              border-color: ${colors.primary};
              box-shadow: 0 0 0 2px ${colors.primaryLight};
            }

            &:hover:not(:focus) {
              border-color: ${colors.greyDark};
            }
          }
        }
      }
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .ui-label-section {
      padding: ${spacing.default};

      .labels-grid-header,
      .label-item-row {
        grid-template-columns: 1fr;
        gap: ${spacing.sm};
      }

      .labels-grid-header {
        display: none;
      }
    }
  }
`;
