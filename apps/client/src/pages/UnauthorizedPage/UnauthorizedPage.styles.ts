import { css } from '@emotion/react';

export const styles = {
  container: css`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background-color: #f9fafb;
  `,

  content: css`
    text-align: center;
    max-width: 500px;
    padding: 3rem;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  `,

  title: css`
    font-size: 2.5rem;
    font-weight: 700;
    color: #dc2626;
    margin: 0 0 1rem 0;
  `,

  message: css`
    font-size: 1.125rem;
    color: #6b7280;
    margin: 0 0 2rem 0;
    line-height: 1.6;
  `,

  actions: css`
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  `,

  button: css`
    padding: 12px 24px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #1d4ed8;
    }
  `,
};
