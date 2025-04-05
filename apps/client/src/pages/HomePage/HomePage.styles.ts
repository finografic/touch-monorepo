import { css } from '@emotion/react';

export const styles = css`
  /* Reset container styles */
  :global(.container) {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Reset root div styles */
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;

  .splash-screen {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #1a1a1a;
    color: #ffffff;
    margin: 0;
    padding: 0;
    position: relative; /* For absolute positioning of docs link */
  }

  .logo-container {
    text-align: center;
    margin-bottom: 4rem;
  }

  .app-title {
    font-size: 4rem;
    font-weight: 700;
    margin: 0;
    color: #00c6ff;
  }

  .app-subtitle {
    font-size: 1.5rem;
    color: #666666;
    margin: 0.5rem 0 0;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-bottom: 4rem;
  }

  .feature-item {
    text-align: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    backdrop-filter: blur(10px);
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-5px);
    }
  }

  .feature-number {
    display: block;
    font-size: 3rem;
    font-weight: 700;
    color: #00c6ff;
    margin-bottom: 0.5rem;
  }

  .feature-text {
    font-size: 1rem;
    color: #666666;
  }

  .system-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    color: #666666;
    margin-bottom: 2rem;
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &.online {
      background: #00ff00;
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
    }
  }

  .docs-link {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    color: #00c6ff;
    text-decoration: none;
    font-size: 0.9rem;
    opacity: 0.7;
    transition: all 0.2s ease;

    &:hover {
      opacity: 1;
      transform: translateX(-50%) translateY(-2px);
    }
  }
`;
