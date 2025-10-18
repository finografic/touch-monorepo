import { css } from '@emotion/react';

import { colors, layout, max, min, spacing, typography } from 'styles';
import { cssForms } from 'styles/forms/forms.styles';
import { stylesAdminContent } from 'styles/project/project.admin.styles';

export const styles = css`
  ${stylesAdminContent}

  form {
    ${cssForms}
  }

  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  background-color: ${colors.white};
  color: ${colors.text};

  > header {
    width: 100%;
    height: ${layout.header.height};
    min-height: ${layout.header.height};
    max-height: ${layout.header.height};

    display: flex;
    align-items: center;
    background-color: ${colors.background};
    border-bottom: 1px solid ${colors.greyDark};
    z-index: 100;

    h1 {
      color: ${colors.white} !important;
      font-size: 1.5rem !important;
      font-weight: 600 !important;
      margin: 0 !important;
    }
  }

  > main {
    width: 100%;
    flex: 1;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;

    background-color: ${colors.white};

    .main-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 0;

      section {
        display: flex;
        flex-direction: column;

        width: 100%;
        height: 100%;
        min-width: 1100px;
        max-width: 98vw;
        min-height: 600px;

        justify-content: flex-start;
        align-items: stretch;

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

          padding: 0rem 2rem 2rem 2rem;

          display: flex;
          justify-content: center;
          align-items: flex-start;

          > * {
            width: fit-content;
            max-width: 100%;
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
    height: ${layout.footer.height};
    min-height: ${layout.footer.height};
    max-height: ${layout.footer.height};
    display: flex;
    align-items: center;
    background-color: ${colors.background};
    z-index: 2000;

    .footer-content {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 ${spacing[6]};
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .nav-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
    }
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

  .logoutButton {
    padding: 0.5rem 1rem;
    background-color: transparent;
    border: 1px solid ${colors.white};
    border-radius: 4px;
    color: ${colors.white};
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;

    &:hover {
      background-color: ${colors.white};
      color: ${colors.background};
    }
  }

  ${min.xl} {
  }

  ${max.xl} {
    > header .header-content {
      padding: 0 ${spacing[4]};

      h1 {
        font-size: 1.25rem;
      }
    }

    > footer .footer-content {
      padding: 0 ${spacing[4]};
    }

    > main .main-content section {
      min-width: 100%;

      header.page-header,
      .page-content,
      nav.page-navigation {
        padding: 1rem;
      }
    }
  }
`;
