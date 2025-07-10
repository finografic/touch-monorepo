import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  .list-drawer {
    pointer-events: none; /* Allow clicks to pass through to overlay */
  }

  .drawer-overlay {
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    inset: 0;
    z-index: 1300;
    opacity: 0;
    pointer-events: none;
    transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .drawer-content {
    position: fixed;
    left: 0;
    right: 0;
    height: 66vh;
    z-index: 1400;
    background-color: white;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    box-shadow:
      0 -4px 6px -1px rgb(0 0 0 / 0.1),
      0 -2px 4px -2px rgb(0 0 0 / 0.1);
    display: flex;
    flex-direction: column;
    pointer-events: auto; /* Re-enable clicks for drawer content */
    transition: top 300ms cubic-bezier(0.16, 1, 0.3, 1);
    will-change: top;
    .drawer-body {
      flex: 1;
      /* TODO: PUT BACK FOR CONTENT */
      /* overflow-x: auto; */
      overflow-y: auto;
      min-height: 0;
    }
  }

  .drawer-bar {
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    h2 {
      color: white;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }
  }

  /* Panel States */
  &.closed .drawer-content {
    top: calc(100vh - ${layout.footer.height} - ${layout.drawer.bar.height});
  }

  &.closed .drawer-overlay {
    opacity: 0;
    pointer-events: none;
  }

  &.open .drawer-content {
    top: 33vh;
  }

  &.open .drawer-overlay {
    opacity: 1;
    pointer-events: auto;
  }
`;
