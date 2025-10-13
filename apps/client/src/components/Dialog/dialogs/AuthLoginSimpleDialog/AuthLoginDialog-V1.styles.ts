import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  /* Container */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.25rem;

  /* Form wrapper */
  .form-wrapper {
    width: 100%;
    max-width: 350px;
  }

  /* Email subtitle */
  .email-subtitle {
    margin-bottom: 1rem;
    padding: 0.75rem;
    background-color: ${colors.gray25};
    border-radius: 6px;
    border: 1px solid ${colors.gray};
    font-size: 0.875rem;
    color: ${colors.gray};
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
    color: ${colors.white};
    /* margin-top: 1rem; */

    &:hover:not(:disabled) {
      background-color: ${colors.infoDark75};
      border-color: ${colors.infoDark75};
      color: ${colors.white};
    }
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
