import { css } from '@emotion/react';
import { colors, spacing } from 'styles';

export const styles = css`
  width: 100%;
  min-height: 100%;

  .add-language-form {
    margin-bottom: ${spacing[6]};
    padding: ${spacing[6]};
    background-color: ${colors.white};
    border: 1px solid ${colors.greyLight};
  }

  .languages-list {
    .language-item {
      background-color: ${colors.white};
      border: 1px solid ${colors.greyLight};
      transition: all 0.2s ease;

      &:hover {
        border-color: ${colors.grey};
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
`;
