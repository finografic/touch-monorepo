import { css } from '@emotion/react';
import { stylesPadBasic } from 'components/Pads/Pad/PadBasic.styles';

import { button, colors } from '@workspace/design-system/tokens';

export const styles = css`
  .pad-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem;
    margin: 0 auto;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;

    label {
      font-size: 1.2rem;
      font-weight: 600;
      color: ${colors.textXLight};
      margin: 0;
    }

    .description {
      font-size: 1.2rem;
      font-weight: 400;
      color: ${colors.text};
      max-width: 500px;
      margin: 0;
    }
  }

  .controls-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    min-width: 200px;
  }

  .control-button {
    min-width: ${button.md.minWidth};
    min-height: ${button.md.minHeight};
    width: 100%;
    height: 56px;
    font-size: 2.5rem;
    font-weight: 300;
    padding-bottom: 0.25rem;
    border-radius: ${button.radius};
    /* outline: none; */
    box-shadow: none;
    transition: all 0.2s ease;
    border-style: ${button.border.style};
    border-width: ${button.border.width};

    color: ${colors.infoLight75};
    border-color: ${colors.infoLight75};

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
      color: ${colors.greyLight75};
      border-color: ${colors.greyLight75};
    }

    &:not(:disabled) {
      &:hover {
        /* background-color: ${colors.infoLight25}; */
        color: ${colors.info};
        border-color: ${colors.info};
        background-color: ${colors.infoXLight25};
      }

      &:active {
        transform: scale(0.98);
      }
    }
  }

  .value-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    min-width: ${button.md.minWidth};
    padding: 1rem;
    border: ${button.border.width} solid ${colors.infoLight25};
    border-radius: ${button.radius};
    background-color: transparent;
    transition: all 0.2s ease;
    gap: 0.5rem;

    &:focus-within {
      border-color: ${colors.infoLight};
      background-color: ${colors.infoXLight25};
    }

    .prefix,
    .suffix {
      font-size: 1.2rem;
      font-weight: 600;
      color: ${colors.infoLight};
    }

    .numeric {
      font-size: 2.5rem;
      font-weight: 500;
      color: ${colors.infoLight};
      text-align: center;
    }
  }
`;
