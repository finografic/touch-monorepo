import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = {
  container: css`
    display: flex;
    justify-content: center;
    align-items: center;
    /* min-height: 200px; */
    margin-top: 0.5rem;
  `,

  formWrapper: css`
    width: 100%;
    max-width: 350px;
  `,

  form: css`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    label {
      color: grey;
    }
  `,

  inputGroup: css`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  `,

  label: css`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${colors.white};
  `,

  submitButton: css`
    width: 100%;
    margin-top: 1rem;
  `,

  error: css`
    color: ${colors.danger};
    font-size: 0.875rem;
    text-align: center;
    padding: 0.5rem;
    background-color: ${colors.danger25};
    border-radius: 4px;
    border: 1px solid ${colors.danger25};
  `,
};
