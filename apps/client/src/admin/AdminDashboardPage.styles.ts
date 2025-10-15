import { css } from '@emotion/react';
import { colors } from 'styles/colors/colors.styles';

export const styles = css`
  .admin-dashboard {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }

  .admin-cards {
    width: 100%;
    max-width: 1200px;
    display: grid;
    grid-template-columns: repeat(var(--cols, 2), 1fr);
    gap: 1.1rem;
    justify-items: stretch;
    margin: 0 auto;

    .admin-card {
      border: 1px solid ${colors.greyXXLight25};
      /* padding: 0 !important; */
      padding: 0.5rem 0.5rem;
      min-height: 80px;
      /* max-height: 100px; */
      transition: all 0.2s ease;

      &:hover {
        border: 1px solid ${colors.greyXLight};
        transform: translateY(-1px);
        box-shadow: var(--shadow-4);
        .card-icon-box {
          transform: scale(1.05);
          transform-origin: center;
        }
      }

      &:active {
        transform: translateY(0);
      }

      .section-title {
        font-size: 1rem;
        margin: 0;
        line-height: 1.3;
      }

      .section-description {
        font-size: 0.875rem;
        line-height: 1.2;
      }

      &:before {
        border: 0;
        outline: 0;
        box-shadow: none;
      }
    }
  }

  .card-icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    transition: all 0.2s ease;
    border-radius: 0;
  }
`;
