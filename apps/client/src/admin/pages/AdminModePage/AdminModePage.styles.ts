import { css } from '@emotion/react';

import { colors } from 'styles';

export const styles = css`
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.white};
  color: ${colors.text};

  /* Container styles */
  .modes-container {
    width: 100%;
    min-width: 600px;
  }

  .modes-flex-container {
    width: 800px;
  }

  .modes-column {
    flex: 1;
  }

  .modes-right-column {
    width: 100%;
    max-width: 400px;
  }

  /* Mode checkbox item */
  .mode-checkbox-item {
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid;
    cursor: pointer;
    background-color: ${colors.white};
    border-color: ${colors.greyLight};
    transition: all 150ms ease;

    &.selected {
      background-color: ${colors.infoLight};
      border-color: ${colors.info};
    }

    .mode-checkbox-item-icon {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      border: 2px solid;
      border-color: ${colors.grey};
      background-color: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &.selected .mode-checkbox-item-icon {
      border-color: ${colors.info};
      background-color: ${colors.info};
    }

    .mode-checkbox-item-checkmark {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: ${colors.white};
    }
  }
`;
