import { css } from '@emotion/react';
import { colors } from './colors.styles';
import { layout } from './global.constants';
import { cssLabels } from './fonts.styles';

// ======================================================================== //
// ======================================================================== //
// NOTE: FORMS RESET

export const stylesFormsReset = css`
  :read-only:not(label, button, input[type='button'], input[type='submit'], input[type='reset']) {
    cursor: default;
  }

  :disabled {
    opacity: var(--opacity-input-disabled);
    cursor: not-allowed;
  }

  /* All elemenets regardless of types */
  input,
  select,
  option,
  textarea,
  button,
  datalist,
  fieldset,
  legend,
  optgroup,
  output,
  input::file-selector-button {
    font: inherit;
    color: inherit;
    accent-color: var(--co-body-accent);
    transition: var(--transition-inputs);
    line-height: var(--leading-inputs);
  }

  /* All elements with types */
  /* Radio & Checkbox */
  /* Buttons */
  /* Select, Buttons and text-fields */
  select,
  textarea,
  input[type='date'],
  input[type='datetime-local'],
  input[type='email'],
  input[type='month'],
  input[type='number'],
  input[type='password'],
  input[type='search'],
  input[type='tel'],
  input[type='text'],
  input[type='time'],
  input[type='url'],
  input[type='week'],
  button,
  input[type='reset'],
  input[type='submit'],
  input[type='button'],
  input::file-selector-button {
    border: 1px solid var(--co-textfld-border);
    padding: var(--padding-inputs);
    border-radius: var(--radius-inputs);
    background-color: var(--co-textfld-bg);
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
  }

  /* All text-fields x select */
  select,
  textarea,
  input[type='date'],
  input[type='datetime-local'],
  input[type='email'],
  input[type='month'],
  input[type='number'],
  input[type='password'],
  input[type='search'],
  input[type='tel'],
  input[type='text'],
  input[type='time'],
  input[type='url'],
  input[type='week'] {
    max-width: var(--width-inputs);
    width: 100%;
  }

  select:hover:not([readonly], [disabled]),
  select:active:not([readonly], [disabled]),
  textarea:hover:not([readonly], [disabled]),
  textarea:active:not([readonly], [disabled]),
  input[type='date']:hover:not([readonly], [disabled]),
  input[type='date']:active:not([readonly], [disabled]),
  input[type='datetime-local']:hover:not([readonly], [disabled]),
  input[type='datetime-local']:active:not([readonly], [disabled]),
  input[type='email']:hover:not([readonly], [disabled]),
  input[type='email']:active:not([readonly], [disabled]),
  input[type='month']:hover:not([readonly], [disabled]),
  input[type='month']:active:not([readonly], [disabled]),
  input[type='number']:hover:not([readonly], [disabled]),
  input[type='number']:active:not([readonly], [disabled]),
  input[type='password']:hover:not([readonly], [disabled]),
  input[type='password']:active:not([readonly], [disabled]),
  input[type='search']:hover:not([readonly], [disabled]),
  input[type='search']:active:not([readonly], [disabled]),
  input[type='tel']:hover:not([readonly], [disabled]),
  input[type='tel']:active:not([readonly], [disabled]),
  input[type='text']:hover:not([readonly], [disabled]),
  input[type='text']:active:not([readonly], [disabled]),
  input[type='time']:hover:not([readonly], [disabled]),
  input[type='time']:active:not([readonly], [disabled]),
  input[type='url']:hover:not([readonly], [disabled]),
  input[type='url']:active:not([readonly], [disabled]),
  input[type='week']:hover:not([readonly], [disabled]),
  input[type='week']:active:not([readonly], [disabled]) {
    border-color: var(--co-textfld-active-border);
  }

  select:focus:not([readonly], [disabled]),
  textarea:focus:not([readonly], [disabled]),
  input[type='date']:focus:not([readonly], [disabled]),
  input[type='datetime-local']:focus:not([readonly], [disabled]),
  input[type='email']:focus:not([readonly], [disabled]),
  input[type='month']:focus:not([readonly], [disabled]),
  input[type='number']:focus:not([readonly], [disabled]),
  input[type='password']:focus:not([readonly], [disabled]),
  input[type='search']:focus:not([readonly], [disabled]),
  input[type='tel']:focus:not([readonly], [disabled]),
  input[type='text']:focus:not([readonly], [disabled]),
  input[type='time']:focus:not([readonly], [disabled]),
  input[type='url']:focus:not([readonly], [disabled]),
  input[type='week']:focus:not([readonly], [disabled]) {
    border-color: var(--co-textfld-focus-border);
  }

  select:required:valid:hover:not([readonly], [disabled]),
  select:required:valid:active:not([readonly], [disabled]),
  textarea:required:valid:hover:not([readonly], [disabled]),
  textarea:required:valid:active:not([readonly], [disabled]),
  input[type='date']:required:valid:hover:not([readonly], [disabled]),
  input[type='date']:required:valid:active:not([readonly], [disabled]),
  input[type='datetime-local']:required:valid:hover:not([readonly], [disabled]),
  input[type='datetime-local']:required:valid:active:not([readonly], [disabled]),
  input[type='email']:required:valid:hover:not([readonly], [disabled]),
  input[type='email']:required:valid:active:not([readonly], [disabled]),
  input[type='month']:required:valid:hover:not([readonly], [disabled]),
  input[type='month']:required:valid:active:not([readonly], [disabled]),
  input[type='number']:required:valid:hover:not([readonly], [disabled]),
  input[type='number']:required:valid:active:not([readonly], [disabled]),
  input[type='password']:required:valid:hover:not([readonly], [disabled]),
  input[type='password']:required:valid:active:not([readonly], [disabled]),
  input[type='search']:required:valid:hover:not([readonly], [disabled]),
  input[type='search']:required:valid:active:not([readonly], [disabled]),
  input[type='tel']:required:valid:hover:not([readonly], [disabled]),
  input[type='tel']:required:valid:active:not([readonly], [disabled]),
  input[type='text']:required:valid:hover:not([readonly], [disabled]),
  input[type='text']:required:valid:active:not([readonly], [disabled]),
  input[type='time']:required:valid:hover:not([readonly], [disabled]),
  input[type='time']:required:valid:active:not([readonly], [disabled]),
  input[type='url']:required:valid:hover:not([readonly], [disabled]),
  input[type='url']:required:valid:active:not([readonly], [disabled]),
  input[type='week']:required:valid:hover:not([readonly], [disabled]),
  input[type='week']:required:valid:active:not([readonly], [disabled]) {
    border-color: var(--co-textfld-valid-active-border);
  }

  select:required:valid:focus:not([readonly], [disabled]),
  textarea:required:valid:focus:not([readonly], [disabled]),
  input[type='date']:required:valid:focus:not([readonly], [disabled]),
  input[type='datetime-local']:required:valid:focus:not([readonly], [disabled]),
  input[type='email']:required:valid:focus:not([readonly], [disabled]),
  input[type='month']:required:valid:focus:not([readonly], [disabled]),
  input[type='number']:required:valid:focus:not([readonly], [disabled]),
  input[type='password']:required:valid:focus:not([readonly], [disabled]),
  input[type='search']:required:valid:focus:not([readonly], [disabled]),
  input[type='tel']:required:valid:focus:not([readonly], [disabled]),
  input[type='text']:required:valid:focus:not([readonly], [disabled]),
  input[type='time']:required:valid:focus:not([readonly], [disabled]),
  input[type='url']:required:valid:focus:not([readonly], [disabled]),
  input[type='week']:required:valid:focus:not([readonly], [disabled]) {
    border-color: var(--co-textfld-valid-focus-border);
  }

  select:required:invalid:hover,
  select:required:invalid:active,
  textarea:required:invalid:hover,
  textarea:required:invalid:active,
  input[type='date']:required:invalid:hover,
  input[type='date']:required:invalid:active,
  input[type='datetime-local']:required:invalid:hover,
  input[type='datetime-local']:required:invalid:active,
  input[type='email']:required:invalid:hover,
  input[type='email']:required:invalid:active,
  input[type='month']:required:invalid:hover,
  input[type='month']:required:invalid:active,
  input[type='number']:required:invalid:hover,
  input[type='number']:required:invalid:active,
  input[type='password']:required:invalid:hover,
  input[type='password']:required:invalid:active,
  input[type='search']:required:invalid:hover,
  input[type='search']:required:invalid:active,
  input[type='tel']:required:invalid:hover,
  input[type='tel']:required:invalid:active,
  input[type='text']:required:invalid:hover,
  input[type='text']:required:invalid:active,
  input[type='time']:required:invalid:hover,
  input[type='time']:required:invalid:active,
  input[type='url']:required:invalid:hover,
  input[type='url']:required:invalid:active,
  input[type='week']:required:invalid:hover,
  input[type='week']:required:invalid:active {
    border-color: var(--co-textfld-invalid-active-border);
  }

  select:required:invalid:focus,
  textarea:required:invalid:focus,
  input[type='date']:required:invalid:focus,
  input[type='datetime-local']:required:invalid:focus,
  input[type='email']:required:invalid:focus,
  input[type='month']:required:invalid:focus,
  input[type='number']:required:invalid:focus,
  input[type='password']:required:invalid:focus,
  input[type='search']:required:invalid:focus,
  input[type='tel']:required:invalid:focus,
  input[type='text']:required:invalid:focus,
  input[type='time']:required:invalid:focus,
  input[type='url']:required:invalid:focus,
  input[type='week']:required:invalid:focus {
    border-color: var(--co-textfld-invalid-focus-border);
  }

  select::selection,
  textarea::selection,
  input[type='date']::selection,
  input[type='datetime-local']::selection,
  input[type='email']::selection,
  input[type='month']::selection,
  input[type='number']::selection,
  input[type='password']::selection,
  input[type='search']::selection,
  input[type='tel']::selection,
  input[type='text']::selection,
  input[type='time']::selection,
  input[type='url']::selection,
  input[type='week']::selection {
    background-color: var(--co-body-accent);
    color: var(--co-body-accent-contrast);
  }

  select:not([disabled], [readonly]) option:focus,
  select:not([disabled], [readonly]) option:active,
  select:not([disabled], [readonly]) option:hover,
  select:not([disabled], [readonly]) option:checked {
    background-color: var(--co-body-accent);
    color: var(--co-body-accent-contrast);
  }

  input[type='color'] {
    cursor: pointer;
    border-style: solid;
    border-radius: var(--radius-inputs);
    border-color: var(--co-textfld-border);
    background-color: var(--co-textfld-bg);
  }

  input[type='color']:hover:not([disabled]),
  input[type='color']:active:not([disabled]) {
    border-color: var(--co-textfld-active-border);
  }

  input[type='color']:focus {
    outline: 0;
  }

  input[type='color']:focus:not([disabled]) {
    border-color: var(--co-textfld-focus-border);
  }

  button,
  input[type='reset'],
  input[type='submit'],
  input[type='button'],
  input::file-selector-button {
    border-color: var(--co-btn-bg);
    background-color: var(--co-btn-bg);
    color: var(--co-btn-text);
    cursor: pointer;
  }

  button:hover,
  button:active,
  input[type='reset']:hover,
  input[type='reset']:active,
  input[type='submit']:hover,
  input[type='submit']:active,
  input[type='button']:hover,
  input[type='button']:active,
  input::file-selector-button:hover,
  input::file-selector-button:active {
    background-color: var(--co-btn-active-bg);
    border-color: var(--co-btn-active-bg);
  }

  button:focus,
  input[type='reset']:focus,
  input[type='submit']:focus,
  input[type='button']:focus,
  input::file-selector-button:focus {
    background-color: var(--co-btn-active-bg);
  }

  /* Labels */
  label {
    cursor: pointer;
    display: block;
  }

  label + label,
  label + input,
  label + select,
  label + button,
  label + textarea {
    margin-top: var(--margin-label);
  }

  textarea {
    max-width: var(--width-textarea);
    height: var(--height-textarea);
  }

  textarea:read-only,
  textarea:disabled {
    resize: none;
  }

  input::file-selector-button {
    margin-right: var(--margin-form-gap);
  }

  label:has(input:disabled) {
    opacity: var(--opacity-input-disabled);
    cursor: not-allowed;
  }

  label:has(input:disabled) :disabled {
    opacity: 1;
  }
`;

// ======================================================================== //
// ======================================================================== //

// NOTE: GREAT 2023 FULL-GUIDE TO CSS FORMS:
// ref: https://blog.logrocket.com/style-forms-css

// FORM STYLES
export const forms = {
  inputs: {
    fontSize: '1.15em',
    fontWeight: 600,
    width: '100%',
    height: '60px',
    border: {
      width: '2px',
      color: colors.greyXXDark,
    },
    padding: '1rem 0.75rem',
    placeholder: {
      fontWeight: 600,
      color: colors.grey,
      opacity: 0.5,
    },
  },
  validation: {
    fontWeight: 600,
    warning: {
      color: colors.warningDark,
    },
    error: {
      color: colors.dangerXDark,
    },
  },
} as const;

export const cssInputText = css`
  font-size: ${forms.inputs.fontSize};
  font-weight: ${forms.inputs.fontWeight};
  font-family:
    'Helvetica Neue',
    'Helvetica',
    'Fira Sans',
    'Droid Sans',
    'Roboto',
    'Segoe UI',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-fill-color: ${colors.text};
  color: ${colors.text};
`;

export const cssInputBox = css`
  appearance: none;
  box-sizing: border-box;
  width: 100%;
  min-height: ${forms.inputs.height};
  padding: 0 1em;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid ${colors.greyLight};
  border-radius: ${layout.borderRadius};
  &,
  &:focus {
    outline: none; /* POOR ACCESSIBILITY */
  }
  &:focus {
    border-color: ${colors.primaryLight};
  }
`;

// NOTE: CAN USE: `::placeholder`

export const cssPlaceholder = css`
  font-weight: ${forms.inputs.fontWeight};
  color: ${colors.grey};
  -webkit-text-fill-color: ${colors.grey};
  opacity: 0.5;
`;

export const cssInputSpecialUI = css`
  select,
  div > .select__control {
    height: ${forms.inputs.height};
    align-content: center;
  }

  .input-select {
    width: 100%;
    input {
      min-height: ${forms.inputs.height};
      align-content: center;
    }
    .select__control {
      font-weight: 600;
      padding: 0 0.5em;
    }
    .select__control--is-focused,
    .select__control--menu-is-open {
      border-color: ${colors.primaryLight};
      box-shadow: 0 0 0 1px ${colors.primaryLight};
    }
    .select__dropdown-indicator {
      margin-left: 8px;
    }
    .select__indicator-separator {
      width: ${layout.borderWidth};
      opacity: 0.66;
    }

    .select__control {
      ${cssInputBox}
      font-weight: 600;
      padding: 0 0.5em;
    }
    .select__value-container,
    .select__single-value,
    .select__input-container {
      color: ${colors.grey};
    }

    .select__control--is-focused,
    .select__control--menu-is-open {
      box-shadow: 0 0 0 1px transparent;
    }

    .select__menu {
      transform: translateY(calc(-${layout.padding} * 0.5));
      ${cssInputText}
      -webkit-text-fill-color: ${colors.greyDark};
      color: ${colors.greyDark};
      font-weight: 500;
      text-indent: 0.5em;
      opacity: 1;
      background-color: rgba(255, 255, 255, 1);
    }

    .select__menu-list {
      .select__option.select__option--is-selected {
        background: ${colors.primaryXLight}!important;
        color: ${colors.white}!important;
        -webkit-text-fill-color: ${colors.white}!important;
      }
    }
  }

  /* TODO: NEEDED ?? */
  /* .react-datepicker {
    border-color: ${colors.greyLight}!important;
    border-width: ${layout.borderWidth}!important;
    .react-datepicker__header {
      .react-datepicker__current-month {
        color: ${colors.greyXDark};
        -webkit-text-fill-color: ${colors.greyXDark};
        text-transform: capitalize;
      }
    }
  } */
`;

export const cssInputReadOnly = css`
  background-color: ${colors.greyXLight};
  border-color: ${colors.greyLight};
  color: ${colors.greyDark};
  -webkit-text-fill-color: ${colors.greyDark};
  pointer-events: none;
`;

export const cssForms = css`
  /***** CUSTOM RESET *****/
  button,
  input,
  optgroup,
  select,
  textarea,
  input[type='button'],
  input[type='reset'],
  /* input[type='submit'], */
  button[disabled],
  input[disabled],
  button::-moz-focus-inner,
  input::file-selector-button,
  input::-moz-focus-inner,
  /* input[type='checkbox'], */
  /* input[type='radio'], */
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button,
  input[type='search'],
  input[type='search']::-webkit-search-cancel-button,
  input[type='search']::-webkit-search-decoration,
  div[role='textbox'] {
    border: none;
    background-image: none;
    /* background-color: transparent;*/
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
  }

  /***** CORE STYLES *****/

  input[type='text'],
  input[type='number'],
  input[type='password'],
  input[type='date'],
  input[type='datetime-local'],
  input[type='time'],
  input[type='email'],
  input[type='tel'],
  input[type='url'],
  input[type='image'],
  input[type='file'],
  input[type='search'],
  div[role='textbox'],
  textarea,
  select,
  div > .select__control {
    ${cssInputText}
    ${cssInputBox}
  }

  textarea {
    /* min-height: 14em; */
  }

  ${cssInputSpecialUI}

  /***** MISC FIXES *****/

  textarea,
  div[role='textbox'] {
    padding-top: ${layout.padding};
  }

  /***** LOG-ROCKET GUIDE + RECOMENDATIONS *****/

  /* Validation */
  input:valid {
  }
  input:invalid {
  }

  /* Active and inactive */
  input:enabled {
  }
  /* Active and inactive - NOT SUBMITTED */
  input:disabled {
  }

  /* Required inputs */
  input:required {
  }

  /* Read-only text inputs - SUBMITTED */
  input:read-only {
    cursor: default;
  }

  /* Inputs with their value to be autofilled by the browser */
  input:autofill {
  }

  /***** PLACEHOLDERS *****/

  input,
  textarea,
  div[role='textbox'] {
    ::-webkit-input-placeholder {
      ${cssPlaceholder}
    }
    ::-moz-placeholder {
      ${cssPlaceholder}
    }
    :-ms-input-placeholder {
      ${cssPlaceholder}
    }
    ::placeholder {
      ${cssPlaceholder}
    }
  }

  .placeholder,
  input[type='date']:empty {
    ${cssPlaceholder}
  }

  .select__placeholder {
    ${cssPlaceholder}
  }

  /***** FOCUSSED *****/

  input,
  textarea,
  select,
  div > .select__control,
  div[role='textbox'] {
    &:focus {
      ::-webkit-input-placeholder {
        color: transparent;
        -webkit-text-fill-color: transparent;
      }
      &::-moz-placeholder {
        color: transparent;
        -webkit-text-fill-color: transparent;
      }
      :-ms-input-placeholder {
        color: transparent;
        -webkit-text-fill-color: transparent;
      }
      ::placeholder {
        color: transparent;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  /***** DISABLED *****/

  input,
  textarea,
  select,
  div > .select__control,
  div[role='textbox'] {
    &:disabled,
    &:disabled:focus {
      ${cssInputText}
      ${cssInputBox}
      cursor: not-allowed;
    }
  }
  .select__control {
    .select__placeholder {
      /* display: none !important; */
    }
  }

  /***** AUTOCOMPLETE *****/

  :-webkit-autofill,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus {
    ${cssInputText}
    ${cssInputBox}
    box-shadow: 0 0 0 1000px white inset;
    transition: background-color 5000s ease-in-out 0s;
    &::first-line {
      ${cssInputText}
      font-size: 18px;
      font-weight: 600;
    }
  }

  /***** AUTOFILL *****/

  :autofill,
  :autofill:hover,
  :autofill:focus,
  input:autofill {
    ${cssInputText}
    ${cssInputBox}
    box-shadow: 0 0 0 1000px white inset;
    transition: background-color 5000s ease-in-out 0s;
    &::first-line {
      ${cssInputText}
      color: red !important;
      font-size: 18px;
      font-weight: 600;
    }
  }

  button {
    border-width: 1px;
  }

  input[type='time']::-webkit-datetime-edit {
    position: absolute;
    pointer-events: none;
  }

  input[type='time']::-webkit-calendar-picker-indicator {
    width: 100%;
    margin: 0 -${layout.padding};
    padding: ${layout.padding};
    background-position-x: right;
    background-position-y: center;
    background-size: 28px;
    opacity: 0.25;
  }

  label {
    ${cssLabels}
    & + &,
    & + input,
    & + select,
    & + button,
    & + textarea {
      /* margin-top: var(--margin-label); */
    }
  }
`;
