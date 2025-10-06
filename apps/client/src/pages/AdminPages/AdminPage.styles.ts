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
    grid-template-columns: repeat(var(--cols, 3), 1fr);
    gap: 2rem;
    justify-content: center;
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

  .card-icon-box {
    transition: all 0.2s ease;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .admin-card:hover .card-icon-box {
    transform: scale(1.1);
  }

  .section-header {
    /* margin-bottom: 0 !important; */
    .section-title {
      margin-top: 2rem;
      /* margin-bottom: -2rem !important; */
    }
  }

  .admin-cards {
    margin-top: -2rem;
  }
`;
