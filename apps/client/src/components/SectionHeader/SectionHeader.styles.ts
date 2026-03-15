import { css } from '@emotion/react';

import { colors } from '@finografic/design-system/tokens';

export const styles = css`
  &.section-header {
    margin-top: var(--spacing-6);
    margin-bottom: var(--spacing-6);

    .section-header-title {
      color: ${colors.text};
      margin-bottom: var(--spacing-1);
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
