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

  .td-order-id {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-right: 1rem;
  }

  .th-action,
  .td-action {
    width: 100px;
    display: table-cell;
    text-align: center;
  }

  .td-action button {
    opacity: 0.5;
    svg.icon {
      width: 24px;
      height: 24px;
    }

    &:hover {
      cursor: pointer;
      opacity: 1;
    }
    &.active {
      opacity: 0.8;
      &:hover {
        opacity: 1;
      }
    }
  }

  .td-action.action-edit button {
    color: ${colors.infoXDark};
    background-color: transparent;

    &:hover {
      color: ${colors.successXDark};
      background-color: ${colors.success}33;
    }
    &.active {
      color: ${colors.warningDark};
      background-color: transparent;
      &:hover {
        color: ${colors.warningDark};
        background-color: ${colors.warning}33;
      }
    }
  }

  .td-action.action-delete button {
    opacity: 0.75;
    color: ${colors.infoXDark};
    background-color: transparent;

    &:hover {
      color: ${colors.successXDark};
      background-color: ${colors.success}33;
    }
    &.active {
      color: ${colors.warningDark};
      background-color: transparent;
      &:hover {
        color: ${colors.warningDark};
        background-color: ${colors.warning}33;
      }
    }
  }
`;
