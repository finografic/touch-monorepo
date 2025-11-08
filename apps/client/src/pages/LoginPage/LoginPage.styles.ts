import { css } from '@emotion/react';

import { colorsDirect as colors, fontSizes, fontWeights, spacing, typography } from 'styles';

export const styles = css`
  min-height: 100vh;
  display: flex;
  align-items: center;

  .login-form {
    width: 100%;
    min-width: 600px;
    max-width: 1400px;
    margin: 0 auto;
    /* padding: ${spacing[8]}; */
    display: flex;
    flex-direction: column;
    /* gap: ${spacing[6]}; */
  }

  .title {
    ${typography.h2};
    margin: 0;
  }

  .error-message {
    background-color: ${colors.dangerXLight};
    color: ${colors.dangerDark};
    padding: ${spacing[3]};
    border-radius: 4px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: ${spacing[2]};

    label {
      font-size: ${fontSizes.sm};
      font-weight: ${fontWeights.medium};
    }

    input {
      width: 100%;
      padding: ${spacing[2]};
      border: 1px solid ${colors.greyLight};
      border-radius: 4px;
      font-size: ${fontSizes.base};

      &:focus {
        outline: none;
        border-color: ${colors.primary[500]};
        box-shadow: 0 0 0 1px ${colors.primary[500]};
      }
    }
  }

  button {
    width: 100%;
    padding: ${spacing[3]};
    background-color: ${colors.primary[500]};
    color: white;
    border: none;
    border-radius: 4px;
    font-size: ${fontSizes.base};
    font-weight: ${fontWeights.medium};
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: ${colors.primary[600]};
    }

    &:focus {
      outline: none;
      box-shadow:
        0 0 0 2px white,
        0 0 0 4px ${colors.primary[500]};
    }
  }
`;
