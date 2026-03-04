import { css } from '@emotion/react';
import { stylesPadBasic } from 'components/Pads/Pad/PadBasic.styles';

import { colors } from '@workspace/design-system/tokens';

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
    min-width: 200px;
    min-height: 60px;
    width: 100%;
    height: 56px;
    font-size: 2.5rem;
    font-weight: 300;
    padding-bottom: 0.25rem;
    border-radius: var(--radii-sm);
    /* outline: none; */
    box-shadow: none;
    transition: all 0.2s ease;
    border-style: solid;
    border-width: var(--border-widths-default);

    color: ${colors.infoLighter};
    border-color: ${colors.infoLight};

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
      color: ${colors.greyLighter};
      border-color: ${colors.greyLight};
    }

    &:not(:disabled) {
      &:hover {
        /* background-color: ${colors.infoLighter}; */
        color: ${colors.info};
        border-color: ${colors.info};
        background-color: ${colors.infoXXLight};
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
    min-width: 200px;
    padding: 1rem;
    border: var(--border-widths-default) solid ${colors.infoLighter};
    border-radius: var(--radii-sm);
    background-color: transparent;
    transition: all 0.2s ease;
    gap: 0.5rem;

    &:focus-within {
      border-color: ${colors.infoLight};
      background-color: ${colors.infoXXLight};
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
