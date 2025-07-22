import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  hr {
    margin: 0.5rem 0;
  }

  .slot-grid-container {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    margin-bottom: 2rem;
  }

  .slot-grid {
    display: grid;
    row-gap: 1rem;
    padding: 1rem 0;
    border-radius: var(--radius-3);
  }

  .slot-grid-item {
    max-width: 100px;
    button {
      cursor: pointer;
    }
  }

  .slot-item-special {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
    border-radius: var(--radius-3);
    min-width: 100px;
  }

  button.slot-button {
    aspect-ratio: 1;
    min-width: 90px;
    min-height: 90px;
    box-shadow: 0 0 1px 2px;
    background-color: transparent;
    cursor: pointer;
  }

  .slot-default {
    border-color: ${colors.default};
    color: ${colors.default};
  }

  .slot-info {
    border-color: ${colors.info};
    color: ${colors.info};
  }

  .slot-danger {
    border-color: ${colors.danger};
    color: ${colors.danger};
  }

  .slot-legend {
    margin-top: 1rem;
    padding: 0 0 1rem 0;
    border-radius: var(--radius-2);
  }

  .legend-item {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 12px;
    color: white;
  }

  .legend-type-a {
    background: ${colors.defaultLight};
  }

  .legend-type-b {
    background: ${colors.info};
  }

  .legend-type-c {
    background: ${colors.danger};
  }
`;
