import { css } from '@emotion/react';

export const styles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: white;
  text-align: center;
  padding: 2rem;

  .splashScreen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .title {
    font-size: 4rem;
    color: #00bfff;
    margin: 0;
  }

  .subtitle {
    font-size: 1.5rem;
    color: #666;
    margin: 0;
  }

  .stats {
    display: flex;
    gap: 3rem;
    margin: 2rem 0;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .value {
    font-size: 3.5rem;
    color: #00bfff;
  }

  .label {
    color: #666;
    margin-top: 0.5rem;
  }

  .systemStatus {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
  }

  .statusDot {
    width: 8px;
    height: 8px;
    background-color: #00ff00;
    border-radius: 50%;
  }

  .bottomLinks {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
  }

  .docsLink,
  .menuLink {
    color: #00bfff;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;

    &:hover {
      color: #66d9ff;
    }
  }

  .separator {
    color: #666;
  }
`;
