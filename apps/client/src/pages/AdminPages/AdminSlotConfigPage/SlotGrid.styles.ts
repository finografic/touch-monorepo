import { css } from '@emotion/react';

export const styles = css`
  hr {
    margin: 0.5rem 0;
  }

  .slot-grid-container {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
    margin-bottom: 2rem;
  }

  .slot-grid {
    display: grid;
    gap: 1rem;
    padding: 1rem 0;
    border-radius: var(--radius-3);
    min-width: 400px;
  }

  .special-pad-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
    border-radius: var(--radius-3);
    min-width: 120px;
  }

  button.slot-button {
    aspect-ratio: 1;
    min-height: 80px;
    pointer-events: none;
    box-shadow: 0 0 1px 2px;
  }

  .slot-gray {
    border-color: var(--gray-8);
    color: var(--gray-11);

    &:hover {
      border-color: var(--gray-9);
      background: var(--gray-3);
    }
  }

  .slot-blue {
    border-color: var(--blue-8);
    color: var(--blue-11);

    &:hover {
      border-color: var(--blue-9);
      background: var(--blue-3);
    }
  }

  .slot-green {
    border-color: var(--green-8);
    color: var(--green-11);

    &:hover {
      border-color: var(--green-9);
      background: var(--green-3);
    }
  }

  .slot-red {
    border-color: var(--red-8);
    color: var(--red-11);

    &:hover {
      border-color: var(--red-9);
      background: var(--red-3);
    }
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
    background: var(--gray-9);
  }

  .legend-type-b {
    background: var(--blue-9);
  }

  .legend-type-c {
    background: var(--green-9);
  }

  .legend-special {
    background: var(--red-9);
  }
`;
