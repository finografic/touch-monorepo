import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  .admin-slot-config {
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 1rem;
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
    min-height: 400px;
    overflow-y: auto;
    padding: 0rem 0.5rem 0rem 0rem;
  }

  .slot-types-container {
    display: flex;
    flex-direction: column;
    padding: 0rem 1rem;
    width: 250px;
  }

  .slot-legend {
    display: block;
    padding: 3rem 1.5rem;
  }

  .slot-list-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    row-gap: 0rem;
    column-gap: 1rem;
    color: ${colors.textLight};
    background-color: ${colors.greyXXLight25};
    border: 1px solid ${colors.greyXXLight25};
    padding: 0.5rem 1.5rem;
    border-radius: ${layout.borderRadius.md};
    width: 250px;
  }

  .slot-legend {
    margin-top: 2rem;
    padding: 0 0 1rem 0;
    border-radius: var(--radius-2);
  }

  .legend-item {
    div {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 0.25rem;
      font-weight: bold;
      font-size: 14px;
      line-height: 1;
      color: white;
    }

    div + span {
      font-weight: 600;
    }
  }

  .legend-type-a {
    background: ${colors.defaultLight};
  }

  .legend-type-b {
    background: ${colors.infoLight};
  }

  .legend-type-c {
    background: ${colors.dangerLight};
  }

  .legend-relay-on {
    div {
      background: ${colors.successLight};
    }

    div + span {
      color: ${colors.successLight};
    }
  }

  .legend-relay-off {
    div {
      background: ${colors.greyXXLight75};
    }

    div + span {
      color: ${colors.greyXXLight};
    }
  }
`;
