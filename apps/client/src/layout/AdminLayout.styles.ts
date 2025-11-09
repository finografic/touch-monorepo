import { css } from '@emotion/react';

import { colors, layout, max, min, spacing, typography } from 'styles';
import { cssForms, forms } from 'styles/forms/forms.styles';
import { stylesAdminContent } from 'styles/project/project.styles';

export const styles = css`
  ${stylesAdminContent}

  /* ADMIN-APP-LAYOUT ======================================================= */
  header.app-header.admin-app-header {
    width: 100%;
    max-width: none;
    background-color: ${colors.greyDark};
    color: ${colors.white};

    h1,
    h1 span {
      color: ${colors.white};
    }
  }

  .admin-navigation {
    padding: 0 3rem;

    a[data-active] span {
      color: ${colors.info};
    }
  }

  /* ADMIN-SECTIONS ======================================================= */

  /* ======================================================================== */

  .field-label {
    width: 100%;
    padding: 1rem 0rem 0.5rem 0rem;
    pointer-events: none;
    user-select: none;
  }

  .item-label {
    .value-key {
      opacity: 0.66;
      pointer-events: none;
      user-select: none;
      /* box-shadow: inset 0px 0px 0px 2px red; */
      outline: none;
      &:focus-visible {
        pointer-events: none;
        box-shadow: inset 0px 0px 0px 2px #dcdcdc;
      }
    }
  }

  input[type='text'],
  input[type='email'],
  input[type='password'],
  input[type='number'],
  input[type='date'],
  input[type='time'],
  input[type='datetime-local'],
  input[type='url'],
  input[type='search'] {
    &:read-only {
      /* border: 1px solid red; */
      font-weight: 700;

      /* background-color: ${colors.greyXLight}; */
      /* border: ${layout.borderWidth} solid ${colors.greyXLight}; */
      color: ${colors.primary};
      padding: 0.5em 0.5em;
      opacity: 0.66;
      ::selection {
        background-color: transparent;
        /* border: ${layout.borderWidth} solid ${colors.greyXLight}; */
        color: ${colors.text};
      }
      :focus {
        outline: none;
        /* border: ${layout.borderWidth} solid ${colors.greyXLight}; */
      }
      :before,
      :after {
        border: none;
        inset: unset;
      }

      cursor: not-allowed;
    }
  }

  select:focus,
  textarea:focus,
  input[type='date']:focus,
  input[type='datetime-local']:focus,
  input[type='email']:focus,
  input[type='month']:focus,
  input[type='number']:focus,
  input[type='password']:focus,
  input[type='search']:focus,
  input[type='tel']:focus,
  input[type='text']:focus,
  input[type='time']:focus,
  input[type='url']:focus,
  input[type='week']:focus,
  button:focus,
  input[type='reset']:focus,
  input[type='submit']:focus,
  input[type='button']:focus,
  input::file-selector-button:focus {
    outline: 0;
    border: ${layout.borderWidth} solid transparent;
  }

  ${cssForms}

  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;

  background-color: ${colors.white};
  color: ${colors.text};

  > header {
    width: 100%;
    height: ${layout.header.height};
    min-height: ${layout.header.height};
    max-height: ${layout.header.height};

    display: flex;
    align-items: center;
    background-color: var(--color-background);
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

    .main-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 0;

      section {
        display: flex;
        flex-direction: column;

        width: 100%;
        height: 100%;
        min-height: 600px;

        justify-content: flex-start;
        align-items: stretch;

        header.admin-page-title {
          width: 100%;
          height: auto;
          min-height: auto;
          max-height: none;
          padding: 0 0.5rem;
          flex-shrink: 0;
          h1 {
            font-size: 1.8rem;
            margin: 0 0 0.33rem 0;
          }
        }

        .admin-page-content {
          flex: 1;
          width: 100%;
          padding: 0rem 1rem 2rem 2rem;
          display: flex;
          /* justify-content: center; */
          /* align-items: flex-start; */
          h2 {
            font-size: 1.4rem;
            color: ${colors.textLight};
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
    background-color: var(--color-background);
    z-index: 2000;

    .footer-content {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 ${spacing.xl};
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

  p {
    color: ${colors.text};
    font-size: 1.2rem;
    text-align: center;
    max-width: 400px;
    line-height: 1.6;
    padding-bottom: 2rem;
  }
`;
