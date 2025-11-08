import { css } from '@emotion/react';

import { colors, layout, spacing } from 'styles';

export const styles = css`
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.white};
  color: ${colors.text};

  div[role='tab'] {
    padding: 0.5rem 1rem;
    color: ${colors.text};
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.5;
    margin-bottom: ${spacing[6]};
  }

  /* TABS ========================================================== */

  [role='tablist'] {
    /* tab-horizontal-rule */
    box-shadow: inset 0 -2px 0 0 transparent;
    box-shadow: inset 0 -0.2rem 0 0 ${colors.defaultXXLight25};

    margin: 0 -1.5rem;

    button[role='tab'] {
      height: 4rem;
      margin: 0.2rem 0.15rem 0;
      padding: 0;
      border: 0 !important;

      span {
        padding: 0.8em 1.25em;
        font-size: 1rem;
        font-weight: 600;
        color: ${colors.textLight75};
      }

      &:nth-of-type(1) {
        margin-left: 0rem;
      }
      &:last-child {
        margin-right: 0rem;
      }
    }

    button[role='tab'][data-state='active'] {
      /* active-tab */
      &:before {
        background-color: ${colors.infoLight};
        height: 0.2rem;
      }
      span {
        color: ${colors.infoLight};
        color: ${colors.info75};
      }

      svg.icon {
        color: ${colors.infoLight};
      }
    }
  }

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
        background-color: ${colors.success25};
        border: 2px solid ${colors.success25};
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
    .volume-slider {
      width: 100%;
      max-width: 320px;
      transform: scale(1.5);

      /* Custom slider track */
      [data-radix-slider-track] {
        background-color: ${colors.greyLight};
        height: 6px;
        border-radius: 3px;
      }

      /* Custom slider range */
      [data-radix-slider-range] {
        background-color: ${colors.infoDark};
        height: 6px;
        border-radius: 3px;
      }

      /* Custom slider thumb */
      [data-radix-slider-thumb] {
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
          outline: 2px solid ${colors.info25};
          outline-offset: 2px;
        }
      }
    }
  }

  /* ======================== PRIME REACT STYLES ============================ */

  .p-listbox {
    background-color: ${colors.white};
    /* border: 1px solid ${colors.greyLight}; */
    border-radius: 8px;
    /* padding: 0.75rem; */
    .p-listbox-item {
      padding: 0.75rem;
      border: 1px solid ${colors.greyLight};
      border-radius: ${layout.borderRadius};
      margin-bottom: 0.25rem;
    }
  }
`;
