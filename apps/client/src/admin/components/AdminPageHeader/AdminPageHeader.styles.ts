import { css } from '@emotion/react';

import { colors } from 'styles';

export const styles = css`
  width: 100%;
  padding: 0 0.5rem 1.5rem 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid ${colors.greyXXLight25};

  .admin-page-header-title {
    margin: 0;
    font-weight: 600;
    color: ${colors.text};
  }

  .admin-page-header-subtitle {
    margin: 0;
    font-weight: 400;
    opacity: 0.7;
  }

  .admin-page-header-description {
    margin-top: 0.5rem;
    line-height: 1.5;
  }

  .admin-page-header-actions {
    button {
      min-width: 120px;
    }
  }

  /* Responsive: Stack on small screens */
  @media (max-width: 768px) {
    .admin-page-header-left,
    .admin-page-header-actions {
      flex: 1 1 100% !important;
    }

    .admin-page-header-actions {
      justify-content: flex-start !important;
      margin-top: 1rem;
    }
  }
`;

