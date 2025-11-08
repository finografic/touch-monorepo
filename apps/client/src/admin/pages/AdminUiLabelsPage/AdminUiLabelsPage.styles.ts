import { css } from '@emotion/react';

import { colors, min, spacing } from 'styles';

export const styles = css`
  width: 100%;
  background-color: ${colors.white};
  color: ${colors.text};

  .admin-page-container {
    max-width: 1600px; /* Wider to accommodate the translation fields */
    margin: 0 auto;
  }

  /* Form styling */
  form {
    width: 100%;
  }

  ${min.md} {
    /* max-width: 96vw !important; */
  }
  ${min.lg} {
    /* max-width: 96vw !important; */
  }
  ${min.xl} {
    /* max-width: 1240px !important; */
  }
`;
