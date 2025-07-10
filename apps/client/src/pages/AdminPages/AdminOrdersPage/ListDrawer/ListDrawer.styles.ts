import { css } from '@emotion/react';

export const styles = css`
  .list-drawer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1400;
    transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: bottom center;
    will-change: transform;
    backface-visibility: hidden;
    -webkit-font-smoothing: antialiased;
  }

  .drawer-content {
    background-color: white;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    box-shadow:
      0 -4px 6px -1px rgb(0 0 0 / 0.1),
      0 -2px 4px -2px rgb(0 0 0 / 0.1);
  }

  .header-bar {
    height: 80px;
    background-color: var(--gray-12);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;

    h2 {
      color: white;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }
  }

  .toggle-button {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
    margin-left: 16px;

    &:hover {
      color: var(--gray-8);
    }
  }

  .drawer-body {
    height: calc(66vh - 80px);
    overflow-y: auto;
  }

  /* Panel States */
  &.closed {
    transform: translateY(calc(66vh - 80px));
  }

  &.open {
    transform: translateY(0);
  }
`;
