import { css } from '@emotion/react';
import { colors } from 'styles';

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
    background-color: transparent;
  }

  .slot-gray {
    border-color: ${colors.defaultLight};
    color: ${colors.defaultLight};

    &:hover {
      border-color: ${colors.default};
      background: ${colors.defaultLight};
    }
  }

  .slot-blue {
    border-color: ${colors.info};
    color: ${colors.info};

    &:hover {
      border-color: ${colors.infoDark};
      background: ${colors.infoLight};
    }
  }

  .slot-green {
    border-color: ${colors.danger};
    color: ${colors.danger};

    &:hover {
      border-color: ${colors.dangerDark};
      background: ${colors.dangerLight};
    }
  }

  .slot-red {
    border-color: ${colors.danger};
    color: ${colors.danger};

    &:hover {
      border-color: ${colors.dangerDark};
      background: ${colors.dangerLight};
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
