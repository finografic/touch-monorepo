import { colors, layout, min, spacing } from 'styles';
import { css } from '@emotion/react';
import { forms } from '../forms/forms.constants';

export const stylesAdminContent = css`
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

  /* ADMIN-PAGE-LAYOUT ======================================================= */

  section.admin-page-container {
    /* #content,
    .header > div,
    .footer > nav {
      padding-left: calc(${layout.padding} * 1.5) !important;
      padding-right: calc(${layout.padding} * 1.5) !important;
    } */

    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: 0em 3rem 1rem 3rem;
    box-shadow: inset 0 0 0 6px transparent;

    ${min.md} {
      /* box-shadow: inset 0 0 0 6px rgba(200, 200, 0, 0.2); */
    }

    ${min.lg} {
      /* box-shadow: inset 0 0 0 6px rgba(0, 200, 200, 0.2); */
    }

    ${min.xl} {
      /* box-shadow: inset 0 0 0 6px rgba(0, 200, 0, 0.2); */
    }
  }

  section.admin-content-page {
    color: ${colors.textDark};

    min-width: 100%;
    width: 100% !important;

    > .admin-page-title {
      padding: 2em;
      background-color: ${colors.greyDark};
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 600;
      color: ${colors.textXDark};
      margin: 1em 0 0.5em 0;
    }

    h2 {
      font-size: 1.75rem;
      color: ${colors.secondaryDark};
      color: ${colors.text};
      line-height: 1.6;
      font-weight: 600;
      margin: 1em 0 0em 0;
    }

    h3 {
      color: ${colors.textLight};
      font-weight: 500;
    }

    h4 {
      color: white;
      margin: 1.33em 0 0.33em;
      font-weight: 500;
    }

    h1,
    h2,
    h3,
    h4 {
      letter-spacing: -0.025em;
      font-weight: 700;
      span {
        opacity: 0.66;
      }
    }

    h1 + span {
      font-size: 1.2rem;
      font-weight: 600;
      color: ${colors.text};
      padding: 0em 0 1em 0;
      display: inline-block;
    }

    h2 + span {
      font-size: 1rem;
      font-weight: 500;
      color: ${colors.text};
      padding: 0.25em 0 1em 0;
      display: inline-block;
    }

    p {
      color: ${colors.text};
      font-weight: 500;
      line-height: 1.75;
    }
    a {
      color: ${colors.primary};
      color: ${colors.secondaryXDark};
      text-decoration: none;
      &:hover {
        color: ${colors.primaryXDark};
      }
    }
    code {
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
      color: ${colors.textLight};
    }
    pre {
      font-size: 0.8em;
      line-height: 1.5;
      color: ${colors.textLight};
    }
    hr {
      border: none;
      border-bottom: ${layout.borderWidth} dashed ${colors.greyLight};
      margin: calc(${layout.padding} * 1.2) 0;
      opacity: 0.5;
    }

    div.rt-TextFieldRoot {
      min-height: ${forms.inputs.height};
      box-shadow: inset 0px 0px 0px 2px ${colors.greyXLight};
    }

    /* ADMIN-SECTIONS ======================================================= */

    header.admin-page-header {
      margin: 2rem 0 2.5rem 0;

      opacity: 0.5;

      h1,
      h1 span {
        color: ${colors.textLight};
      }

      h1 {
        margin: 0.5rem 0 0.5rem 0;
      }

      div.admin-page-description {
        font-size: 1.25rem;
        font-weight: 600;
        color: ${colors.textLight};
        line-height: 1.5;
        text-align: left;
        align-items: left;
        padding: 0.5rem 0;
      }

      &.centered,
      &.centered div.admin-page-description {
        text-align: center;
      }
    }

    /* ADMIN-SECTIONS ======================================================= */

    div.admin-section {
      background-color: ${colors.white};
      border: 1px solid ${colors.greyXLight};
      border: 2px solid ${colors.greyXXLight50};
      border-radius: ${String(layout.borderRadius)};
      /* padding: ${String(layout.padding)}; */
      padding: 1.5rem 2rem 2.5rem 2rem;
      margin: 5.5rem 0;

      .section-header {
        h2 {
          color: ${colors.textLight};
          margin-top: 0.5rem;
        }
        h3 {
          color: ${colors.textLight};
          font-size: 1.66rem;
          font-weight: 700;
          /* margin-bottom: ${spacing[2]};
          padding-bottom: ${spacing[2]}; */
        }
      }
    }
  }

  /* ======================================================================== */
  /* ======================================================================== */
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
  /* ======================================================================== */

  /* header.page-header,
  section {
    padding: calc(${layout.padding} * 1) calc(${layout.padding} * 0.75) calc(${layout.padding} * 2);
    padding-top: calc(${layout.padding} * 1) !important;
    h1 {
      font-size: 2.8em !important;
      margin-top: 0.4em !important;
      margin-bottom: 0.4em !important;
      color: var(--color-primary-dark);
      span {
        color: var(--color-primary);
        opacity: 1;
      }
    }
    h1 + h2 {
      margin-bottom: 0.4em !important;
      color: var(--color-grey-dark);
      span {
        color: var(--color-grey-light);
        opacity: 1;
      }
    }
    h1 + p,
    h1 + h2 + p {
      font-size: 1.25em;
      margin-top: 0 !important;
      margin-bottom: 2.5em;
    }
  } */

  /******************** RESPONSIVE *********************/

  /* .col-left,
  .col-right {
    display: flex;
    justify-content: center;
  }

  #content {
    padding-left: calc(${layout.padding} * 1) !important;
    padding-right: calc(${layout.padding} * 1.8) !important;
  }

  .header > div,
  .footer > nav {
    padding-left: calc(${layout.padding} * 1) !important;
    padding-right: calc(${layout.padding} * 1) !important;
  }

  ${min.md} {
    .col-left {
      justify-content: start;
    }
    .col-right {
      justify-content: end;
    }

    #content {
      padding-left: calc(${layout.padding} * 1) !important;
      padding-right: calc(${layout.padding} * 1.8) !important;
    }

    .header > div,
    .footer > nav {
      padding-left: calc(${layout.padding} * 1) !important;
      padding-right: calc(${layout.padding} * 1) !important;
    }
  }
    */
`;
