import { css, keyframes } from '@emotion/react';

/** Black ↔ ~20% grey (ping-pong one full cycle per animation iteration). */
const screensaverPulse = keyframes`
  0% {
    background-color: #000000;
  }
  50% {
    background-color: hsl(0 0% 10%);
  }
  100% {
    background-color: #000000;
  }
`;

export const overlayStyles = css`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  z-index: 10000;
  touch-action: none;
  animation: ${screensaverPulse} 10s ease-in-out infinite;
  will-change: opacity;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background-color: #000000;
  }
`;
