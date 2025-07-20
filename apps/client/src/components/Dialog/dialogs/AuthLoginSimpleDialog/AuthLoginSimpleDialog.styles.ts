import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = {
  container: css`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    padding: 1rem;
  `,

  formWrapper: css`
    width: 100%;
    max-width: 350px;
  `,

  header: css`
    text-align: center;
    margin-bottom: 2rem;
  `,

  title: css`
    font-size: 1.5rem;
    font-weight: 600;
    color: ${colors.white};
    margin: 0 0 0.5rem 0;
  `,

  subtitle: css`
    font-size: 0.875rem;
    color: ${colors.greyLight};
    margin: 0;
  `,

  form: css`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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
    background-color: ${colors.danger}11;
    border-radius: 4px;
    border: 1px solid ${colors.danger}33;
  `,
};
