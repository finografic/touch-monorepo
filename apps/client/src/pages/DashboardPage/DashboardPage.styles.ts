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
  position: relative;
  overflow: hidden;

  .splash-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .logo-container {
    margin-bottom: 2rem;
  }

  .app-title {
    font-size: 4rem;
    color: #00bfff;
    margin: 0;
  }

  .app-subtitle {
    font-size: 1.5rem;
    color: #666;
    margin: 0;
  }

  .feature-grid {
    display: flex;
    gap: 3rem;
    margin: 2rem 0;
  }

  .feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    backdrop-filter: blur(10px);
    transition: transform 0.2s ease;
    min-width: 200px;

    &:hover {
      transform: translateY(-5px);
    }
  }

  .feature-number {
    font-size: 3.5rem;
    font-weight: 700;
    color: #00bfff;
  }

  .feature-text {
    color: #666;
    margin-top: 0.5rem;
  }

  .system-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &.online {
      background-color: #00ff00;
    }
  }

  .bottom-links {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
  }

  .docs-link,
  .menu-link {
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
