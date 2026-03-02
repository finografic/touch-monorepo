import { css } from '@emotion/react';

import { colors } from '@workspace/design-system/tokens';

export const styles = css`
  width: 100%;
  display: flex;
  align-items: center;

  .ds-input-field__slot--left svg.icon {
    width: 1.25rem;
    height: 1.25rem;
    stroke-width: 3;
    color: ${colors.grey};
    opacity: 0.66;
  }

  .ds-input-field:focus-within .ds-input-field__slot--left svg.icon {
    color: ${colors.infoXDark};
    opacity: 0.66;
  }
`;
