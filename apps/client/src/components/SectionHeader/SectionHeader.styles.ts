import { css } from '@emotion/react';

import { colors, spacing } from 'styles';

export const styles = css`
  &.section-header {
    margin-bottom: ${spacing[4]};

    /* margin-bottom: ${spacing[6]}; */
    /* padding-bottom: ${spacing[3]}; */
    /* border-bottom: 1px solid ${colors.greyLight}; */

    .section-title {
      color: ${colors.text};
      margin-bottom: ${spacing[2]};
    }

    .section-description {
      color: ${colors.greyDark};
      line-height: 1.5;
    }

    /* .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: ${colors.text};
      margin-bottom: ${spacing[2]};
    }

    .section-description {
      font-size: 0.875rem;
      color: ${colors.greyDark};
      line-height: 1.5;
    } */
  }
`;
