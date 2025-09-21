import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  .timer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .timer-digits {
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 1;
  }

  .timer-label {
    font-size: 0.9rem;
  }

  &.status-processing {
    color: ${colors.success};
    border: ${layout.borderWidth} solid ${colors.success};
    background-color: ${colors.success25};
    &:hover {
      color: ${colors.success};
      border-color: ${colors.successLight};
      background-color: ${colors.success25};
      transform: none;
    }
    &:disabled {
      cursor: wait;
      &:hover {
        border-color: ${colors.greyDark};
        background-color: ${colors.success25};
      }
    }
    &.selected {
      color: ${colors.info};
      border-color: ${colors.info};
      background-color: ${colors.info25};
      &:hover {
        color: ${colors.info};
        border-color: ${colors.infoLight};
        background-color: ${colors.info25};
      }
    }
  }

  &.status-completed {
    /* cursor: not-allowed; */
    pointer-events: none;
    user-select: none;
    color: ${colors.warningLight};
    border: ${layout.borderWidth} solid ${colors.warningLight};
    background-color: ${colors.warningLight25};
    &:hover {
      color: ${colors.warning};
      border-color: ${colors.warning};
      background-color: ${colors.warning25};
      transform: none;
    }
    &:disabled {
      &:hover {
        border-color: ${colors.greyDark};
        background-color: ${colors.warning25};
      }
    }
    &.selected {
      color: ${colors.info};
      border-color: ${colors.info};
      background-color: ${colors.info25};
      &:hover {
        color: ${colors.info};
        border-color: ${colors.infoLight};
        background-color: ${colors.info25};
      }
    }
  }
`;
