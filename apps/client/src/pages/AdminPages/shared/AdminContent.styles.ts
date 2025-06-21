import { css } from '@emotion/react';
import { colors, layout, spacing } from 'styles';

/**
 * Base admin page layout styles
 * Use this for consistent admin page structure
 */
export const adminPageBaseStyles = css`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: ${layout.header.height} ${spacing[8]} ${layout.footer.height} ${spacing[8]};
  background-color: ${colors.white};
  color: ${colors.text};

  @media (max-width: 768px) {
    padding: ${spacing[6]};
  }
`;

/**
 * Admin page header styles
 */
export const adminPageHeaderStyles = css`
  margin-bottom: ${spacing[8]};

  .admin-page-title {
    font-size: 2rem;
    font-weight: 700;
    color: ${colors.text};
    margin: 0 0 ${spacing[2]} 0;
    line-height: 1.2;
  }

  .admin-page-subtitle {
    font-size: 1.125rem;
    color: ${colors.greyDark};
    margin: 0 0 ${spacing[6]} 0;
    line-height: 1.4;
  }

  .admin-page-message {
    padding: ${spacing[4]} ${spacing[6]};
    border-radius: 8px;
    margin-bottom: ${spacing[6]};
    font-weight: 500;

    &.success {
      background-color: ${colors.successLight};
      color: ${colors.successDark};
      border: 1px solid ${colors.success};
    }

    &.error {
      background-color: ${colors.dangerLight};
      color: ${colors.dangerDark};
      border: 1px solid ${colors.danger};
    }

    &.warning {
      background-color: ${colors.warningLight};
      color: ${colors.warningDark};
      border: 1px solid ${colors.warning};
    }

    &.info {
      background-color: ${colors.infoLight};
      color: ${colors.infoDark};
      border: 1px solid ${colors.info};
    }
  }

  @media (max-width: 768px) {
    margin-bottom: ${spacing[6]};

    .admin-page-title {
      font-size: 1.75rem;
    }

    .admin-page-subtitle {
      font-size: 1rem;
    }
  }
`;

/**
 * Admin page loading state styles
 */
export const adminPageLoadingStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: ${colors.greyDark};

  .loading-spinner {
    margin-bottom: ${spacing[4]};
  }

  .loading-text {
    font-size: 1.125rem;
    color: ${colors.greyDark};
  }
`;

/**
 * Admin section/card styles
 * Use for grouped content within admin pages
 */
export const adminSectionStyles = css`
  background-color: ${colors.white};
  border: 1px solid ${colors.greyLight};
  border-radius: 12px;
  padding: ${spacing[8]};
  margin-bottom: ${spacing[6]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:last-child {
    margin-bottom: 0;
  }

  .admin-section-header {
    margin-bottom: ${spacing[6]};

    .admin-section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: ${colors.text};
      margin: 0 0 ${spacing[2]} 0;
    }

    .admin-section-subtitle {
      font-size: 1rem;
      color: ${colors.greyDark};
      margin: 0;
    }
  }

  @media (max-width: 768px) {
    padding: ${spacing[6]};
    border-radius: 8px;
  }
`;

/**
 * Admin form styles
 * Use for consistent form styling across admin pages
 */
export const adminFormStyles = css`
  .form-group {
    margin-bottom: ${spacing[6]};

    .form-label {
      display: block;
      font-weight: 600;
      color: ${colors.text};
      margin-bottom: ${spacing[2]};
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-input {
      width: 100%;
      padding: ${spacing[3]} ${spacing[4]};
      border: 1px solid ${colors.greyLight};
      border-radius: 6px;
      background-color: ${colors.white};
      color: ${colors.text};
      font-size: 1rem;
      transition: border-color 0.2s ease;

      &:focus {
        outline: none;
        border-color: ${colors.info};
        box-shadow: 0 0 0 3px ${colors.infoLight};
      }

      &::placeholder {
        color: ${colors.grey};
      }
    }

    .form-error {
      color: ${colors.danger};
      font-size: 0.875rem;
      margin-top: ${spacing[1]};
    }
  }

  .form-actions {
    display: flex;
    gap: ${spacing[4]};
    justify-content: flex-start;
    margin-top: ${spacing[8]};

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
`;

/**
 * Admin grid styles
 * Use for data grids and card layouts
 */
export const adminGridStyles = css`
  /* 2-column grid */
  &.admin-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${spacing[6]};

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: ${spacing[4]};
    }
  }

  /* 3-column grid */
  &.admin-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${spacing[6]};

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: ${spacing[4]};
    }
  }

  /* 4-column grid */
  &.admin-grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: ${spacing[6]};

    @media (max-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: ${spacing[4]};
    }

    @media (max-width: 480px) {
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
    background-color: ${colors.white};
    border-radius: 8px;
    /* overflow: hidden; */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    thead {
      background-color: ${colors.greyXLight};

      th {
        padding: ${spacing[4]} ${spacing[6]};
        text-align: left;
        font-weight: 600;
        color: ${colors.text};
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px solid ${colors.greyLight};
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid ${colors.greyXLight};

        &:hover {
          background-color: ${colors.greyXXLight};
        }

        &:last-child {
          border-bottom: none;
        }
      }

      td {
        padding: ${spacing[4]} ${spacing[6]};
        color: ${colors.text};
        font-size: 0.875rem;
        vertical-align: middle;
      }
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
    padding: ${spacing[3]} ${spacing[6]};
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.875rem;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    gap: ${spacing[2]};

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Primary button */
    &.admin-btn-primary {
      background-color: ${colors.info};
      color: ${colors.white};

      &:hover:not(:disabled) {
        background-color: ${colors.infoDark};
      }
    }

    /* Secondary button */
    &.admin-btn-secondary {
      background-color: ${colors.greyLight};
      color: ${colors.text};

      &:hover:not(:disabled) {
        background-color: ${colors.grey};
      }
    }

    /* Danger button */
    &.admin-btn-danger {
      background-color: ${colors.danger};
      color: ${colors.white};

      &:hover:not(:disabled) {
        background-color: ${colors.dangerDark};
      }
    }

    /* Success button */
    &.admin-btn-success {
      background-color: ${colors.success};
      color: ${colors.white};

      &:hover:not(:disabled) {
        background-color: ${colors.successDark};
      }
    }

    /* Outline variants */
    &.admin-btn-outline {
      background-color: transparent;
      border: 1px solid ${colors.greyLight};
      color: ${colors.text};

      &:hover:not(:disabled) {
        background-color: ${colors.greyXLight};
      }
    }
  }
`;

/**
 * Combined admin styles
 * Import this for all admin page styling
 */
export const styles = css`
  ${adminPageBaseStyles}
  ${adminPageHeaderStyles}
  ${adminPageLoadingStyles}
  ${adminSectionStyles}
  ${adminFormStyles}
  ${adminGridStyles}
  ${adminTableStyles}
  ${adminButtonStyles}
`;
