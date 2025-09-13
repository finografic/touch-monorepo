import { css } from '@emotion/react';

export const styles = css`
  .slot-config-controls {
    padding: 1rem;
  }

  .config-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .config-grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border: 1px solid var(--gray-6);
    border-radius: var(--radius-3);
    background-color: var(--gray-2);
  }

  .slot-select {
    button {
      width: 5rem;
    }
  }

  .slot-table-row {
    td {
      vertical-align: middle;
      padding: 0.5rem 1.5rem;
    }
    td:nth-of-type(2) {
      vertical-align: middle;
      padding: 0.5rem 1.5rem 0.5rem 0;
    }
  }

  .slot-select-special {
    button {
      width: 7rem;
      pointer-events: none;
    }
  }
`;
