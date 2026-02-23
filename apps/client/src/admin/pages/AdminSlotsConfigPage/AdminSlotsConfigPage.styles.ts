import { css } from '@emotion/react';

import { colors, layout } from 'styles';

export const styles = css`
  .admin-slot-config {
    /* max-width: 1200px; */
    /* margin: 0 auto; */
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

  .dimesions-badge {
    padding: 0.5rem 1rem;
    font-weight: 600;
    margin: 0 -0.25rem 1rem -0.25rem;
  }

  /***************************************************************
   * SLOTS
   ***************************************************************/

  .slot-list-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: 480px;
    overflow-y: auto;
    padding: 0rem 0.5rem 0rem 0rem;
  }

  .slot-types-container {
    display: flex;
    flex-direction: column;
    padding: 0rem 1rem 1.5rem 1rem;
    width: 180px;
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
    border-radius: ${layout.borderRadius};
    width: 180px;
    font-weight: 600;
  }

  .slot-legend {
    margin-top: 1rem;
    padding: 0 0 1rem 0;
    border-radius: ${layout.borderRadius};
  }

  /***************************************************************
   * LAYOUT MODE + LEGEND
   ***************************************************************/

  .layout-mode-container {
    /* display: flex;
    flex-direction: column;
    padding: 0rem 1rem 1.5rem 1rem;
    width: 180px; */
    justify-content: space-between;

    .rt-Text.rt-r-size-3 {
      font-weight: 700;
      color: ${colors.textLight};
    }

    button[role='switch'] {
      & + span {
        font-weight: 600;
        color: ${colors.textXLight};
      }
    }
  }

  .legend-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    color: white;
    & + span {
      margin-left: 0.33rem;
      font-weight: 600;
      color: ${colors.textLight};
      padding-bottom: 0.15rem;
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

  .legend-type-alt {
    background: ${colors.secondaryXLight};
  }

  .legend-type-power {
    background: ${colors.success};
  }
`;
