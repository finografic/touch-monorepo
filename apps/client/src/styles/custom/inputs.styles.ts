import { css } from '@emotion/react';
import { colors, layout } from 'styles';
import { stylesFormsReset } from 'styles/forms.styles';

/**
 * Shared input component styles for temperature, time, and other numeric inputs
 * Provides consistent styling patterns across input components
 */

const inputBox = {
  border: {
    width: '2px',
    color: colors.greyXXDark,
  },
  padding: '1rem 0.75rem',
};

export const baseInputStyles = css`
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
    &:focus,
    &:active {
      border: ${inputBox.border.width} solid transparent;
    }
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
    border: ${inputBox.border.width} solid transparent;
    padding: ${inputBox.padding};
    border-radius: var(--radius-inputs);
    background-color: var(--co-textfld-bg);
    &:focus,
    &:active {
      border: ${inputBox.border.width} solid transparent;
    }
  }

  /* select:focus,
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
  } */

  /* All text-fields x select */
  /* select,
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
  } */

  /* select:hover:not([readonly], [disabled]),
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
  } */

  /* select:focus:not([readonly], [disabled]),
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
  } */

  /* select:required:valid:hover:not([readonly], [disabled]),
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
  } */

  /* select:required:valid:focus:not([readonly], [disabled]),
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
  } */

  /* select:required:invalid:hover,
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
  } */

  /* select:required:invalid:focus,
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
  } */

  /* select::selection,
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
  } */

  /* select:not([disabled], [readonly]) option:focus,
  select:not([disabled], [readonly]) option:active,
  select:not([disabled], [readonly]) option:hover,
  select:not([disabled], [readonly]) option:checked {
    background-color: var(--co-body-accent);
    color: var(--co-body-accent-contrast);
  } */

  /* input[type='color'] {
    cursor: pointer;
    border-style: solid;
    border-radius: var(--radius-inputs);
    border-color: var(--co-textfld-border);
    background-color: var(--co-textfld-bg);
  } */

  /* input[type='color']:hover:not([disabled]),
  input[type='color']:active:not([disabled]) {
    border-color: var(--co-textfld-active-border);
  } */

  /* input[type='color']:focus {
    outline: 0;
  } */

  /* input[type='color']:focus:not([disabled]) {
    border-color: var(--co-textfld-focus-border);
  } */

  /* button,
  input[type='reset'],
  input[type='submit'],
  input[type='button'],
  input::file-selector-button {
    border-color: var(--co-btn-bg);
    background-color: var(--co-btn-bg);
    color: var(--co-btn-text);
    cursor: pointer;
  } */

  /* button:hover,
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
  } */

  /* button:focus,
  input[type='reset']:focus,
  input[type='submit']:focus,
  input[type='button']:focus,
  input::file-selector-button:focus {
    background-color: var(--co-btn-active-bg);
  } */
`;
