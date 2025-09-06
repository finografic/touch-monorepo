import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  .drawer-bar {
    width: 100%;
    height: ${layout.drawer.bar.height};
    padding: 0.5rem 2rem 0.5rem 2rem;
    margin-bottom: 1.5rem;

    .col-children {
      &:not(:empty) {
        &:not(.active) {
          cursor: pointer;
          .drawer-children {
            pointer-events: none;
          }
        }
      }
    }

    .col-button {
      flex: 1;
      button {
        color: ${colors.infoXDark};
        opacity: 0.66;
        &:hover {
          cursor: pointer;
          color: ${colors.infoDark};
          opacity: 1;
        }
      }
    }

    &.light {
      background-color: white;
      .col-button {
        button {
          color: ${colors.grey};
          background-color: transparent;
          &:hover {
            color: ${colors.successXDark};
            background-color: ${colors.success33};
          }
          &.active {
            opacity: 0.8;
            color: ${colors.warningDark};
            background-color: transparent;
            &:hover {
              opacity: 1;
              color: ${colors.warningDark};
              background-color: ${colors.warning33};
            }
          }
        }
      }
    }

    &.dark {
      background-color: ${colors.background95};
      .col-button {
        button {
          color: ${colors.greyXXLight};
          background-color: transparent;
          &:hover {
            color: white;
            background-color: rgba(255, 255, 255, 0.15);
          }
        }
      }
    }
  }
`;
