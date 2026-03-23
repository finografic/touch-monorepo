import { colors, layout } from '@finografic/design-system/tokens';

import { css } from '@emotion/react';

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
      border: ${layout.borderWidth} solid ${colors.greyXLight};
      border-radius: ${layout.borderRadius};
      padding: 0.5rem;
      min-height: 80px;
      transition: all 200ms ease;

      &:hover {
        border: ${layout.borderWidth} solid ${colors.greyLighter};
        box-shadow: var(--shadows-base-md);
        transition: all 200ms ease;
      }

      .card-header {
        margin: 0;
        .section-header-title {
          font-size: 1.125rem;
          margin: 0.25rem 0 0.33rem 0;
          line-height: 1;
        }

        .section-header-description {
          display: table-cell;
          font-size: 0.9rem;
          line-height: 20px;
          padding: 0;
        }
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

    & + div {
      padding-top: 0;
    }

    @media (max-width: 1024px) and (max-height: 600px) {
      .admin-cards {
        margin-top: 0.25rem;
      }
    }
  }
`;
