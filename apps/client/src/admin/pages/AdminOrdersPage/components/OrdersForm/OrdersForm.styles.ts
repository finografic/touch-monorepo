import { css } from '@emotion/react';

import { spacing } from 'styles';
import { colors } from 'styles/colors/colors.styles';

export const styles = css`
  &.form-container {
    /* max-width: 66vw !important; */
    /* opacity: 0.5 !important; */
    /* border: 1px solid red !important; */

    width: 100%;
    width: 77vw;
    max-width: 77vw !important;
    min-width: 1000px !important;

    min-height: 100vh;
    height: 66vh !important;
    background-color: ${colors.white};
    color: ${colors.text};
    overflow: hidden;

    .tab-content-new,
    .tab-content-edit {
      max-width: 66vw !important;
    }

    .admin-page-content {
      display: flex;
      flex-direction: column;
      gap: 0;

      border: 1px solid blue !important;
      display: none !important;

      /* ⭐ admin-section > tab-content > rote=tabpanel ======================= */

      /* NOTE: SCROLL-WINDOW */

      .admin-section {
        display: none !important;
        margin: 2rem 0 0 0 !important;
        padding: 0 !important;
        border: 0 !important;
        /* border: 1px solid green !important; */

        overflow-y: scroll;
        position: fixed;
        width: 86vw;

        width: 60vw;
        max-width: 60vw !important;
        min-width: 1000px !important;

        top: 360px;
        left: auto;
        right: auto;

        bottom: 3rem;
        z-index: 5000;

        position: fixed;

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

            opacity: 0.3 !important;
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
      }
    }
  }
`;
