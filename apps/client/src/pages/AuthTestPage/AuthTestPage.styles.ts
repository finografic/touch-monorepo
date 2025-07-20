import { css } from '@emotion/react';

export const styles = {
  container: css`
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `,

  section: css`
    margin-bottom: 2rem;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: #f9fafb;

    h2 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #374151;
      font-size: 1.25rem;
      font-weight: 600;
    }

    p {
      margin: 0.5rem 0;
      color: #4b5563;
    }

    strong {
      color: #1f2937;
      font-weight: 600;
    }
  `,

  json: css`
    background-color: #1f2937;
    color: #f9fafb;
    padding: 1rem;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    overflow-x: auto;
    white-space: pre-wrap;
  `,

  actions: css`
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    button {
      min-width: 120px;
    }
  `,
};
