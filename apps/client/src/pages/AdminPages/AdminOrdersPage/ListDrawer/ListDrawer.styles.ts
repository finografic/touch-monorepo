import { css } from '@emotion/react';

export const styles = css`
  .drawer-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1300;
    pointer-events: auto;
    user-select: none;
  }

  .drawer-overlay[data-state='open'] {
    animation: overlayShow 250ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .drawer-overlay[data-state='closed'] {
    animation: overlayHide 250ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .drawer-content {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    z-index: 1400;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 66vh;
    transform-origin: bottom center;
    will-change: transform, opacity;
    backface-visibility: hidden;
    -webkit-font-smoothing: antialiased;
  }

  .drawer-content[data-state='open'] {
    animation: contentShow 600ms cubic-bezier(0.65, 0, 0.35, 1);
  }

  .drawer-content[data-state='closed'] {
    animation: contentHide 600ms cubic-bezier(0.65, 0, 0.35, 1);
  }

  .drawer-handle-container {
    display: flex;
    justify-content: center;
    padding: 0.5rem;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.7;
    }
  }

  .drawer-handle {
    width: 4rem;
    height: 0.25rem;
    background-color: #e4e4e7;
    border-radius: 9999px;
  }

  .drawer-header {
    text-align: left;
    padding: 0 1rem;

    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    p {
      color: #71717a;
      margin: 0.25rem 0 0;
    }
  }

  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 0 1rem;
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
    border-top: 1px solid #e4e4e7;
  }

  @keyframes overlayShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes overlayHide {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes contentShow {
    from {
      transform: translateY(100%);
      opacity: 0.5;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes contentHide {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(100%);
      opacity: 0;
    }
  }
`;
