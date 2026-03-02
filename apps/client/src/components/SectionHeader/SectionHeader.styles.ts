import { css } from '@emotion/react';

import { colors, spacing } from '@workspace/design-system/tokens';

export const styles = css`
  &.section-header {
    margin-top: ${spacing.xl};
    margin-bottom: ${spacing.xl};

    .section-header-title {
      color: ${colors.text};
      margin-bottom: ${spacing.xs};
    }

    .section-header-description {
      color: ${colors.greyDark};
      color: ${colors.greyLight};
      line-height: 1.5;
      font-size: 1rem;
      font-weight: 700 !important;
    }

    .section-header-title + .section-header-description {
      margin-top: 0;
      padding-top: 0;
    }
  }
`;
