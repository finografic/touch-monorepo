import { css } from '@emotion/react';
import { colors, spacing } from 'styles';

export const styles = css`
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.white};
  color: ${colors.text};

  .mode-checkbox-item {
    &:hover {
      background-color: var(--gray-2) !important;
      border-color: var(--gray-8) !important;
    }
  }
`;
