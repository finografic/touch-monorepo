import { css } from '@emotion/react';

import { colors } from 'styles';

export const styles = css`
  .admin-slot-timer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 3.5rem;

    &.status-completed {
      color: ${colors.warning75};
      filter: saturate(0.8);
    }

    &.status-processing {
      color: ${colors.successDark};
    }

    span {
      font-size: 1.15rem;
      font-weight: 600;
      white-space: nowrap;
    }
  }
`;
