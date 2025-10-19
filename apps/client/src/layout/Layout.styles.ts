import { css } from '@emotion/react';

import { colors, layout, spacing, typography } from 'styles';
import { stylesAppContent } from 'styles/project/project.app.styles';

export const styles = css`
  ${stylesAppContent}

  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: ${colors.background};
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
    overflow-y: auto;
    overflow-x: hidden;

    .main-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      section {
        display: flex;
        flex-direction: column;

        width: 100%;
        height: 100%;
        /* min-width: 1100px;
        max-width: 66vw; */
        min-height: 600px;
        max-height: 800px;

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
          align-items: center;
          justify-content: center;

          > section {
            /* justify-content: center; */
          }
        }

        nav.page-navigation {
          width: 100%;
          padding: 1rem 2rem;
          flex-shrink: 0;
        }
      }
    }
  }

  > footer {
    width: 100%;
    height: ${layout.header.height};
    min-height: ${layout.header.height};
    max-height: ${layout.header.height};
    display: flex;
    align-items: center;
    background-color: transparent;
  }

  .title {
    ${typography.h1};
    color: ${colors.text};
    margin-bottom: ${spacing[4]};
  }

  .subtitle {
    ${typography.body};
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
`;
