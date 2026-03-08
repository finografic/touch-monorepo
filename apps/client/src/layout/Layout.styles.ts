import { colors, layout } from '@workspace/design-system/tokens';

import { css } from '@emotion/react';

import { stylesAppContent800x480 } from '../styles/project.app.800x480.styles';
import { stylesAppContent1024x600 } from '../styles/project.app.1024x600.styles';
import { stylesAppContent } from '../styles/project.app.styles';

export const styles = css`
  ${stylesAppContent}

  /* transform: translate(-2%, -10%) scale(0.8); */

  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: ${colors.background};
  color: ${colors.text};
  overflow: hidden;

  > header {
    width: 100%;
    height: ${layout.header.height};
    min-height: ${layout.header.height};
    max-height: ${layout.header.height};
    display: flex;
    align-items: center;
    background-color: transparent;
  }

  > main {
    width: 100%;
    flex: 1;
    position: relative;

    overflow: hidden;

    .main-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      > section {
        display: flex;
        flex-direction: column;

        width: 100%;
        height: 100%;
        min-height: 600px;
        max-height: 680px;

        justify-content: space-between;
        align-items: center;

        header.page-header {
          width: 100%;
          height: auto;
          min-height: auto;
          max-height: none;
          padding: 1rem 2rem;
          flex-shrink: 0;
        }

        .page-content {
          flex: 1;
          width: 100%;
          padding: 2rem;

          display: flex;
          align-items: center !important;
          justify-content: center !important;

          > section {
            /* justify-content: center; */
          }
        }

        nav.page-navigation {
          width: 100%;
          height: ${layout.footer.height};
          padding: 1rem 2rem;
          flex-shrink: 0;
          top: 5rem;
          bottom: 5rem;
          left: 0;
          right: 0;
          z-index: 1000;
        }
      }
    }
  }

  > footer {
    width: 100%;
    height: ${layout.footer.height};
    min-height: ${layout.header.height};
    max-height: ${layout.header.height};
    display: flex;
    align-items: center;
    background-color: transparent;
    margin-bottom: 0rem;
  }

  .title {
    font-size: var(--font-sizes-6xl);
    color: ${colors.text};
    margin-bottom: var(--spacing-4);
  }

  .subtitle {
    font-size: var(--font-sizes-lg);
    color: ${colors.textLight};
  }

  p {
    color: ${colors.text};
    font-size: 1.2rem;
    text-align: center;
    max-width: 400px;
    line-height: 1.6;
    padding-bottom: 2rem;
  }

  button.button-logout {
    padding: 0.5rem 1rem;
    background-color: transparent;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: #f3f4f6;
    }
  }

  /* ========================================================================
   * TINY DISPLAY: 800x480 and smaller (Front-End Only)
   * Import and apply compact display styles within media query
   * ======================================================================== */

  @media (max-width: 1024px) and (max-height: 600px) {
    height: 100vh;
    height: 100dvh; /* 100dvh = dynamic viewport height (avoids scrollbar from 100vh overshoot on Pi) */
    width: 100%; /* 100% avoids horizontal scroll when vertical scrollbar would appear */
    overflow: hidden;

    /* ${stylesAppContent1024x600} */
    ${stylesAppContent800x480}

    &[data-touch='true'] {
      header.app-header {
        margin-top: 0.75rem;
        box-shadow: -0.75rem 0 0 0.75rem ${colors.white};
        .container {
          max-width: none;
          .toolbar-user {
            z-index: 5000;
            transform: translateX(-0.5rem);
            button {
              transform: scale(1.2);
            }
          }
        }
      }
    }

    .page-content {
      zoom: 0.9;
      transform: translateY(-3%);
    }

    &[data-pathname='main'] .page-content {
      zoom: 0.8;
      transform: translateY(-3%);
    }
  }
`;
