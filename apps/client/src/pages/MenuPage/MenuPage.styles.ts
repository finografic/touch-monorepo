import { css } from '@emotion/react';

export const styles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: white;
  padding: 2rem;

  .menu-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .point {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid #666;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #00bfff;
    transition: all 0.3s;

    &:hover {
      border-color: #00bfff;
      transform: scale(1.1);
    }

    &.active {
      border-color: #00bfff;
      background-color: rgba(0, 191, 255, 0.1);
    }

    &.error {
      border-color: #ff4444;
      color: #ff4444;
    }

    &.special {
      border-radius: 10px;
      border-color: #00ff00;
      color: #00ff00;
    }
  }

  .controls {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
  }

  .control-btn {
    padding: 0.5rem 1.5rem;
    border: 1px solid #666;
    border-radius: 4px;
    background: transparent;
    color: #00bfff;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #00bfff;
      background-color: rgba(0, 191, 255, 0.1);
    }
  }
`;
