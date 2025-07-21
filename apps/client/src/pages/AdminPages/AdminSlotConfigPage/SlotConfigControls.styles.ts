import { css } from '@emotion/react';

export const styles = css`
  .slot-config-controls {
    padding: 1rem;
  }

  .slot-table-row {
    td {
      vertical-align: middle;
      padding: 0.5rem 1.5rem;
    }
    td:nth-child(2) {
      vertical-align: middle;
      padding: 0.5rem 1.5rem 0.5rem 0;
    }
  }

  .slot-select {
    button {
      width: 7rem;
    }
  }

  .slot-select-special {
    button {
      width: 7rem;
      pointer-events: none;
    }
  }
`;
