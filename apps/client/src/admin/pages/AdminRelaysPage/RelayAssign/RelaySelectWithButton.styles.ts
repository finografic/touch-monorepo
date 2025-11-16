import { css } from '@emotion/react';
import { getVariantStyles } from 'components/Button/utils/button.utils';

import { border, colors, layout } from 'styles';

export const styles = css`
  display: flex;
  width: 100%;

  .inputgroup-button-container {
    /* padding: 2px 0 2px 2px;
    height: 40px; */
  }

  .inputgroup-select-container {
    /* flex: 1;
    min-width: 0; */
  }

  button.inputgroup-button {
    /* margin: 2px 0 2px 0; */
    width: 100%;
    max-width: 33%;
    max-width: 5.5rem;
    height: 40px;
    flex-shrink: 0;

    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: ${border.radius.sm};
    border-bottom-left-radius: ${border.radius.sm};
    border-right: none;

    padding: 0;

    /* background-color: ${colors.infoDark}; */
    ${getVariantStyles('solid', 'grey')}

    .button-text {
      font-size: 1.1rem;
      font-weight: 600;
      color: ${colors.white};
      svg {
        width: 1.5rem;
      }
    }
  }

  .inputgroup-select {
    display: flex;
    flex-direction: column;
    /* gap: 0.5rem;
    min-height: 400px;
    overflow-y: auto;
    padding: 0rem 0.5rem 0rem 0rem; */

    .rt-TextFieldRoot {
      /* border-top-left-radius: ${border.radius.none};
      border-bottom-left-radius: ${border.radius.none}; */
      padding: 0;
      min-width: 240px;
    }
    input {
      border-top-left-radius: ${border.radius.none};
      border-bottom-left-radius: ${border.radius.none};
    }

    input,
    input:focus {
      border-left: none;
    }
  }
`;

// <div style={{ flex: 1, minWidth: 0 }}>
