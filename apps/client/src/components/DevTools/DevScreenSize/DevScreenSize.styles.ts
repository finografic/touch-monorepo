import { css } from '@emotion/react';
import { layout, min } from 'styles';

export const styles = css`
  padding: 0 10px;
  position: fixed;
  left: calc(50vw) !important;
  transform: translate(calc(-50% - (${layout.padding} * 2)), 0px) !important;
  z-index: 999999;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
  &,
  &.variant-light {
    pre {
      color: white !important;
    }
  }

  &.variant-dark {
    pre {
      color: #444 !important;
    }
  }

  top: 150px;
  ${min.sm} {
    top: 150px;
  }
  ${min.md} {
    top: 150px;
  }
  ${min.lg} {
    top: 150px;
  }
  ${min.xl} {
    top: 150px;
  }

  top: ${layout.padding} !important;
  top: 0 !important;

  pre {
    opacity: 0.66;
  }
`;
