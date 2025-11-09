import { css } from '@emotion/react';

import { colors, spacing } from 'styles';

export const styles = css`
  &.section-header {
    margin-top: ${spacing.xl};
    margin-bottom: ${spacing.xl};

    /* margin-bottom: ${spacing.xl}; */
    /* padding-bottom: ${spacing.md}; */
    /* border-bottom: 1px solid ${colors.greyLight}; */

    .section-title {
      color: ${colors.text};
      margin-bottom: ${spacing.xs};
    }

    .section-description {
      color: ${colors.greyDark};
      color: ${colors.greyLight};
      line-height: 1.5;
    }

    .section-title + .section-description {
      margin-top: 0;
      padding-top: 0;
    }
  }
`;
