import { css } from '@emotion/react';

import { colors } from 'styles';

export const styles = css`
  color: ${colors.white};

  .main-content {
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
    justify-content: space-between;
    row-gap: 2.5rem;
    .pad-rect {
      padding: 2.2rem 0;
    }
  }
`;
