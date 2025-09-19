import { colors, layout, min } from 'styles';
import { css } from '@emotion/react';
import { forms } from '../forms/forms.constants';

export const stylesAdminContent = css`
  > header {
    background-color: ${colors.greyDark}!important;
    nav .admin-nav {
      a[data-active] span {
        color: ${colors.info};
      }
    }
  }

  section.admin-content-page {
    color: ${colors.textDark};

    min-width: 100%;
    width: 100% !important;

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
      color: var(--color-text-light);
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
      color: var(--color-text);
      font-weight: 500;
      line-height: 1.75;
    }
    a {
      color: var(--color-primary);
      color: var(--color-secondary-xdark);
      text-decoration: none;
      &:hover {
        color: var(--color-primary-x-dark);
      }
    }
    code {
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
      color: var(--color-text-light);
    }
    pre {
      font-size: 0.8em;
      line-height: 1.5;
      color: var(--color-text-light);
    }
    hr {
      border: none;
      border-bottom: ${layout.borderWidth} dashed var(--color-grey-light);
      margin: calc(${layout.padding} * 1.2) 0;
      opacity: 0.5;
    }

    div.rt-TextFieldRoot {
      min-height: ${forms.inputs.height};
      box-shadow: inset 0px 0px 0px 2px ${colors.greyXLight};
    }
  }

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

  ${min.lg} {
    #content,
    .header > div,
    .footer > nav {
      padding-left: calc(${layout.padding} * 1.5) !important;
      padding-right: calc(${layout.padding} * 1.5) !important;
    }
  }

  ${min.xl} {
    #content,
    .header > div,
    .footer > nav {
      padding-left: calc(${layout.padding} * 2.5) !important;
      padding-right: calc(${layout.padding} * 2.5) !important;
    }
  }

  ${min.xxl} {
    #content,
    .header > div,
    .footer > nav {
      padding-left: calc(${layout.padding} * 0.5) !important;
      padding-right: calc(${layout.padding} * 0.5) !important;
    }
  } */
`;
