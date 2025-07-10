import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.white};
  color: ${colors.text};

  .td {
    height: 60px;
    display: table-cell;
    vertical-align: middle;
  }

  .th-action,
  .td-action {
    width: 100px;
    display: table-cell;
    text-align: center;
  }

  .td-action button {
    opacity: 0.5;
    color: ${colors.infoXDark};
    background-color: transparent;
    svg.icon {
      width: 24px;
      height: 24px;
    }

    &:hover {
      cursor: pointer;
      opacity: 1;
      color: ${colors.successXDark};
      background-color: ${colors.success}33;
    }
    &.active {
      opacity: 0.8;
      color: ${colors.warningDark};
      background-color: transparent;
      &:hover {
        opacity: 1;
        color: ${colors.warningDark};
        background-color: ${colors.warning}33;
      }
    }
  }
`;
