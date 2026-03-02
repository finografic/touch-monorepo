import { css } from '@emotion/react';

import { colors, layout, spacing } from '@workspace/design-system/tokens';

export const styles = css`
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.white};
  color: ${colors.text};

  .sound-library-list {
    .sound-library-item {
      padding: 0.75rem;
      border: 1px solid ${colors.greyLight};
      border-radius: 8px;
      background-color: ${colors.white};
      svg.icon.icon-check {
        width: 1.5rem;
        height: 1.5rem;
        color: white;
        color: ${colors.successDark};
        background-color: ${colors.successLight};
        border: 2px solid ${colors.successLighter};
        border-radius: 50%;
      }
    }
  }

  svg.icon.icon-speaker {
    width: 1.2rem;
    height: 1.2rem;
    color: ${colors.infoDark};
  }

  /* Volume slider styling */
  .volume-control {
    /* padding: 1rem 1.5rem 0 1.5rem; */
    padding: 0 0 1rem 0;

    .volume-slider {
      width: 100%;
      max-width: 400px;

      .ds-slider__track {
        background-color: ${colors.greyLight};
        height: 6px;
        border-radius: 3px;
      }

      .ds-slider__range {
        background-color: ${colors.infoDark};
        height: 6px;
        border-radius: 3px;
      }

      .ds-slider__thumb {
        background-color: ${colors.infoDark};
        border: 2px solid ${colors.white};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        &:hover {
          background-color: ${colors.infoXDark};
          transform: scale(1.1);
        }

        &:focus {
          outline: 2px solid ${colors.infoLight};
          outline-offset: 2px;
        }
      }
    }
  }

  /* ======================== PRIME REACT STYLES ============================ */

  .p-listbox {
    background-color: ${colors.white};
    border-radius: 8px;
    .p-listbox-item {
      padding: 0.75rem;
      border: 1px solid ${colors.greyLight};
      border-radius: ${layout.borderRadius};
      margin-bottom: 0.25rem;
    }
  }


`;
