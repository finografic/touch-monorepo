import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  .admin-slot-config {
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 1rem;
    /* padding: 1rem; */
  }

  .loading,
  .error {
    text-align: center;
    padding: 2rem;
  }

  .error {
    color: var(--red-9);
  }

  .slot-list-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: 480px;
    overflow-y: auto;
    padding: 0rem 0.5rem 0rem 0rem;
  }

  .slot-list-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    row-gap: 0rem;
    column-gap: 1rem;
    color: ${colors.textLight};
    background-color: ${colors.greyXXLight10};
    border: 1px solid ${colors.greyXXLight20};
    padding: 0.5rem 1.5rem;
    border-radius: ${layout.borderRadius.md};
    width: 220px;
  }
`;
