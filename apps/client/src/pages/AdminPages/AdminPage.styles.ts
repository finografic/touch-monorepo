import { css } from '@emotion/react';

export const styles = css`
  .admin-dashboard {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .admin-cards {
    max-width: 1000px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .admin-card {
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-4);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .card-icon {
    transition: all 0.2s ease;
  }

  .admin-card:hover .card-icon {
    transform: scale(1.1);
  }
`;
