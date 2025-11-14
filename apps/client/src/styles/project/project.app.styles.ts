import { css } from '@emotion/react';

import { stylesAdminContent } from './project.styles';

export const stylesAppContent = css`
  ${stylesAdminContent}
  #layout {
    display: none !important;
  }

  &.temperature-content,
  &.time-content {
    min-width: 800px;
    min-height: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .page-description {
    margin-top: -33%;
    margin-bottom: -8%;
  }
`;
