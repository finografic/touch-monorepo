import { css } from '@emotion/react';

import { colors } from 'styles';
import { cssInputText } from 'styles/forms/forms.FULL.styles';

export const styles = css`
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.white};
  color: ${colors.text};

  .rt-TableHeader {
    /* position: fixed;
        width: 86vw; */
  }

  .rt-TableBody.table-body {
    /* position: fixed;
        width: 86vw !important;
        display: block; */

    .rt-TableRow {
      /* display: flex;
          align-items: center;
          width: 100%; */
    }
    .td {
      /* align-items: center;
          display: flex;
          display: flex;
          align-items: center;
          width: 100%; */
      vertical-align: middle;

      /* opacity: 0.3 !important; */
    }

    .button-edit {
      svg.icon-edit {
        /* color: ${colors.infoXLight}; */
      }
    }
    .button-delete {
      svg.icon-delete {
        color: ${colors.greyXXLight};
        &:hover {
          color: #aa0000;
        }
      }
    }

    .button-edit,
    .button-delete {
      transform: scale(0.8);
      padding: 0.5rem 0.5rem !important;
    }
  }

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
    /* width: 100px; */
    display: table-cell;
    text-align: center;
  }

  /* TH-ACTIONS ============================ */

  .th-index,
  .th-mode,
  .th-drinkType,
  .th-subtype,
  .th-volume,
  .th-container,
  .th-temperature {
    /* width: 60px !important; */
    /* border: 1px solid red !important; */
    /* width: 100px; */
    /* display: table-cell;
    text-align: center; */
  }

  /* ACTIONS =============================== */

  .action-edit,
  .action-delete {
    /* width: 60px; */
  }

  .td-action button {
    opacity: 0.5 !important;
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
      background-color: ${colors.success25};
    }
    &.active {
      color: ${colors.warningDark};
      background-color: transparent;
      &:hover {
        color: ${colors.warningDark};
        background-color: ${colors.warning25};
      }
    }
  }

  .td-action.action-delete button {
    opacity: 0.75;
    color: ${colors.infoXDark};
    background-color: transparent;

    &:hover {
      color: ${colors.successXDark};
      background-color: ${colors.success25};
    }
    &.active {
      color: ${colors.warningDark};
      background-color: transparent;
      &:hover {
        color: ${colors.warningDark};
        background-color: ${colors.warning25};
      }
    }
  }

  .column-search-input {
    ${cssInputText}
    background-color: transparent;
    svg.icon {
      stroke: ${colors.greyXXLight50};
      transform: scale(0.75) !important;
    }
  }
`;
