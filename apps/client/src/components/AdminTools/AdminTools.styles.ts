import { css } from '@emotion/react';

export const styles = css`
  .admin-tools-container {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 50vw;
    z-index: 1000;
  }

  .btn-admin {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.9);
      border-color: rgba(255, 255, 255, 0.2);
    }

    &.active {
      background: rgba(0, 120, 255, 0.8);
      border-color: rgba(255, 255, 255, 0.3);
    }

    &.btn-placeholder {
      opacity: 0.3;
      cursor: not-allowed;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .timer-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 20px;
  }
`;
