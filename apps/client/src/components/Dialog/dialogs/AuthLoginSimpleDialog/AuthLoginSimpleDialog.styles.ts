import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  /* Container */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;

  /* Form wrapper */
  .form-wrapper {
    width: 100%;
    max-width: 350px;
  }

  /* Form */
  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  /*
  .form label {
    color: grey;
  } */

  /* Input group */
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* Submit button */
  .submit-button {
    width: 100%;
    margin-top: 1rem;
  }

  /* Error message */
  .error {
    color: ${colors.danger};
    font-size: 0.875rem;
    text-align: center;
    padding: 0.5rem;
    background-color: ${colors.danger25};
    border-radius: 4px;
    border: 1px solid ${colors.danger25};
  }
`;
