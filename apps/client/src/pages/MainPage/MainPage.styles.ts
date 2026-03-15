import { css } from '@emotion/react';

import { colors } from '@finografic/design-system/tokens';

export const styles = css`
  color: ${colors.white};

  .main-page-buttons-container {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: stretch;
    align-items: stretch;
    column-gap: 3rem;
  }

  .content-buttons {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    height: 100%; /* Fill available vertical space */
    row-gap: 2.5rem; /* Static gap between buttons */
    .pad-rect {
      flex: 1; /* Buttons stretch to fill available space equally */
      padding: 2.2rem 0;
    }
  }
`;
