import { css } from '@emotion/react';

export const styles = {
  container: css`
    padding: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: var(--gray-12);
  `,

  section: css`
    margin-bottom: 1.5rem;
    padding: 1rem;
    border: 1px solid var(--gray-6);
    border-radius: 6px;
    background-color: var(--gray-2);

    h2 {
      margin-top: 0;
      margin-bottom: 0.75rem;
      color: var(--gray-12);
      font-size: 1.125rem;
      font-weight: 600;
    }

    p {
      margin: 0.375rem 0;
      color: var(--gray-11);
      font-size: 0.875rem;
    }

    strong {
      color: var(--gray-12);
      font-weight: 600;
    }
  `,

  json: css`
    background-color: var(--gray-1);
    color: var(--gray-12);
    padding: 0.75rem;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.75rem;
    overflow-x: auto;
    white-space: pre-wrap;
    border: 1px solid var(--gray-5);
    max-height: 200px;
    overflow-y: auto;
  `,

  actions: css`
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;

    button {
      min-width: 120px;
      font-size: 0.875rem;
    }
  `,
};
