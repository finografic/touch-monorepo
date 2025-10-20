import { css } from '@emotion/react';

import { colors } from 'styles/colors/colors.styles';

export const styles = css`
  &.form-container {
    width: 77vw;
    max-width: 77vw !important;
    min-width: 1000px !important;

    .tab-content-new,
    .tab-content-edit {
      max-width: 66vw !important;
    }

    height: 66vh !important;
    min-height: 100vh;

    background-color: ${colors.white};
    color: ${colors.text};
    overflow: hidden;
  }
`;
