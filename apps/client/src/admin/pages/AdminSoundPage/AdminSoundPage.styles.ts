import { css } from '@emotion/react';
import { colors, spacing } from 'styles';

export const styles = css`
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.white};
  color: ${colors.text};
  /*
  .admin-page-container {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: ${spacing[8]};
  } */

  /* .admin-page-header {
    text-align: center;
    margin-bottom: ${spacing[8]};

    .admin-page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: ${colors.text};
      margin-bottom: ${spacing[2]};
      line-height: 1.2;
    }

    .admin-page-subtitle {
      font-size: 1.125rem;
      color: ${colors.greyDark};
      line-height: 1.5;
      margin-bottom: ${spacing[6]};
    }
  } */

  /* .admin-page-content {
    display: flex;
    flex-direction: column;
    gap: ${spacing[6]};
  } */

  /* Admin section styling */
  /* .admin-section {
    background-color: ${colors.white};
    border: 1px solid ${colors.greyLight};
    border-radius: 12px;
    padding: ${spacing[6]};

    .section-header {
      h3 {
        color: ${colors.text};
        font-size: 1.66rem;
        font-weight: 700;
        margin-bottom: ${spacing[2]};
        padding-bottom: ${spacing[2]};
      }
    }
  } */

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
`;
