import { css } from '@emotion/react';
import { colors, layout } from 'styles';

/**
 * Base admin page layout styles
 * Use this for consistent admin page structure
 */
export const adminPageBaseStyles = css`
  &.admin-page {
    width: 100%;
    height: 100%;
    color: ${colors.white};
    background-color: ${colors.background};
  }

  .admin-page-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .admin-page-header {
    text-align: center;
    margin-bottom: 2rem;

    .admin-page-title {
      color: ${colors.white};
      font-size: 2.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .admin-page-subtitle {
      color: ${colors.greyLight};
      font-size: 1.125rem;
      line-height: 1.5;
    }
  }

  .admin-page-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
`;

/**
 * Admin section/card styles
 * Use for grouped content within admin pages
 */
export const adminSectionStyles = css`
  .admin-section {
    background-color: ${colors.backgroundLight};
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid ${colors.greyDark};
    margin-bottom: 2rem;

    .section-header {
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid ${colors.greyDark};

      .section-title {
        color: ${colors.white};
        font-size: 1.5rem;
        font-weight: 500;
        margin-bottom: 0.25rem;
      }

      .section-description {
        color: ${colors.greyLight};
        font-size: 0.875rem;
        line-height: 1.5;
      }
    }

    .section-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
`;

/**
 * Admin form styles
 * Use for consistent form styling across admin pages
 */
export const adminFormStyles = css`
  .admin-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .admin-form-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-field-inline {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1rem;
    align-items: center;
  }

  .form-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${colors.greyLight};
  }

  .form-input {
    background-color: ${colors.backgroundDark};
    border: 1px solid ${colors.greyDark};
    border-radius: 4px;
    padding: 0.75rem;
    color: ${colors.white};
    font-size: 0.875rem;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${colors.info};
      box-shadow: 0 0 0 2px ${colors.info}22;
    }

    &::placeholder {
      color: ${colors.grey};
    }

    &:disabled {
      background-color: ${colors.backgroundDark};
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
  }

  .form-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid ${colors.greyDark};
    margin-top: 1rem;
  }

  .error-message {
    color: ${colors.danger};
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }

  .success-message {
    color: ${colors.success};
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
`;

/**
 * Admin grid styles
 * Use for data grids and card layouts
 */
export const adminGridStyles = css`
  .admin-grid {
    display: grid;
    gap: 1.5rem;
    width: 100%;
  }

  .admin-grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .admin-grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .admin-grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  .admin-grid-responsive {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  .admin-grid-item {
    background-color: ${colors.background};
    border-radius: 6px;
    padding: 1rem;
    border: 1px solid ${colors.greyDark};
    transition: border-color 0.2s ease;

    &:hover {
      border-color: ${colors.info};
    }

    &.admin-grid-item-active {
      border-color: ${colors.info};
      background-color: rgba(0, 191, 255, 0.05);
    }
  }

  @media (max-width: 768px) {
    .admin-grid-2,
    .admin-grid-3,
    .admin-grid-4 {
      grid-template-columns: 1fr;
    }
  }
`;

/**
 * Admin table styles
 * Use for data tables in admin pages
 */
export const adminTableStyles = css`
  .admin-table {
    width: 100%;
    border-collapse: collapse;
    background-color: ${colors.background};
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid ${colors.greyDark};

    thead {
      background-color: ${colors.backgroundLight};
    }

    th,
    td {
      text-align: left;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid ${colors.greyDark};
    }

    th {
      font-weight: 600;
      color: ${colors.white};
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    td {
      color: ${colors.greyLight};
      font-size: 0.875rem;
    }

    tbody tr:hover {
      background-color: ${colors.backgroundLight};
    }

    tbody tr:last-child td {
      border-bottom: none;
    }
  }
`;

/**
 * Admin button styles
 * Use for consistent button styling
 */
export const adminButtonStyles = css`
  .admin-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    text-decoration: none;

    &.admin-btn-primary {
      background-color: ${colors.info};
      color: ${colors.background};

      &:hover {
        background-color: ${colors.infoLight};
      }
    }

    &.admin-btn-secondary {
      background-color: transparent;
      color: ${colors.info};
      border: 1px solid ${colors.info};

      &:hover {
        background-color: ${colors.info};
        color: ${colors.background};
      }
    }

    &.admin-btn-danger {
      background-color: ${colors.danger};
      color: ${colors.white};

      &:hover {
        background-color: ${colors.dangerDark};
      }
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

/**
 * Combined admin styles
 * Import this for all admin page styling
 */
export const adminStyles = css`
  ${adminPageBaseStyles}
  ${adminSectionStyles}
  ${adminFormStyles}
  ${adminGridStyles}
  ${adminTableStyles}
  ${adminButtonStyles}
`;
