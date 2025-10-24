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
    margin: 2rem auto;

    .admin-card {
      border: 1px solid ${colors.greyXXLight25};
      padding: 0.1rem 0.5rem;
      min-height: 80px;
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
        font-size: 1.125rem;
        margin: 0.5rem 0 0.3rem 0;
        line-height: 1;
      }

      .section-description {
        font-size: 0.9rem;
        line-height: 1.2;
      }

      &:before {
        border: 0;
        outline: 0;
        box-shadow: none;
      }
    }

    svg.icon.cog {
      scale: 1.2;
    }
    svg.icon.shield-user {
      scale: 1.1;
    }
    svg.icon.volume2 {
      scale: 1.2;
    }
  }

  .card-icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;
    width: 5rem;
    height: 5rem;
    /* min-width: 4rem; */
    /* min-height: 100%; */
    margin: 0;
    margin-right: 1rem;
    padding: 1.5rem 1.25rem;
    border-radius: 0.6rem;
  }
`;
