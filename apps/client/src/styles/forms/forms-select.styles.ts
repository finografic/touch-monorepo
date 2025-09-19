import { css } from '@emotion/react';
import { colors } from '../colors/colors.styles';
import { forms } from 'styles/forms/forms.constants';

// NOTE: SELECT STYLES + RADIX OVERRIDES

export const formsSelect = css`
  .dropdown-chevron-slot {
    /* Dropdown chevron indicators */
    color: ${colors.greyDark};
    svg {
      transition: transform 0.2s ease;
    }
  }

  /* Custom select components */

  .select-basic,
  .select-custom,
  .select-searchable,
  .searchable-select {
    .select-trigger {
      min-height: ${forms.inputs.height};
      border: ${forms.inputs.border.width} solid ${forms.inputs.border.color};
      border-radius: ${forms.inputs.border.radius};
      font-size: ${forms.inputs.text.fontSize};
      font-weight: ${forms.inputs.text.fontWeight};
      transition: ${forms.inputs.transition};

      &:hover {
        border-color: ${forms.inputs.hover.border.color};
        .option {
          border-color: ${forms.inputs.hover.border.color};
          background-color: red !important;
        }
      }

      &:focus,
      &[data-state='open'] {
        border-color: ${forms.inputs.focus.border.color};
        box-shadow: 0 0 0 3px ${colors.primaryLight20};
        &.input-slot-right {
          cursor: pointer !important;
          pointer-events: auto !important;
          display: none !important;

          svg {
            cursor: pointer !important;
          }
        }
      }
      .option {
        font-weight: 600 !important;
      }
      .option.focussed {
        background-color: ${colors.primaryLight20}!important;
      }
    }

    /* Dropdown content z-index fix */
    .select-content,
    .select-viewport,
    [role='listbox'],
    [data-radix-popper-content-wrapper] {
      z-index: 9999 !important;
    }

    /* NOTE: SLOT-RIGHT (CHEVRON) - Override Radix TextFieldSlot sizing and spacing */
    /* .rt-TextFieldRoot:where(.rt-r-size-3) :where(.rt-TextFieldSlot),
    .rt-TextFieldSlot:where([data-side='right']),
    .rt-TextFieldSlot:where(.rt-TextFieldSlot:not([data-side='left'])) {
      gap: var(--space-2) !important;
      padding-left: var(--space-2) !important;
      padding-right: var(--space-2) !important;
      &:not(.open) {
        border: none !important;
        border: ${forms.inputs.border.width} solid ${forms.inputs.border.color} !important;
        border-top-right-radius: ${forms.inputs.border.radius} !important;
        border-bottom-right-radius: ${forms.inputs.border.radius} !important;
      }
      &.open {
        border-left: ${forms.inputs.border.width} solid ${forms.inputs.border.color} !important;
      }
    } */
  }

  /* Radix Select specific z-index fixes */
  .rt-SelectContent,
  .rt-PopoverContent,
  [data-radix-select-content],
  [data-radix-popover-content] {
    z-index: 9999 !important;
  }

  /* Portal dropdown global styles */
  #portal-root .dropdown-portal {
    /* Ensure portal dropdowns are properly styled */
    z-index: 999999 !important;

    /* Override any global styles that might interfere */
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;

    /* Ensure proper stacking */
    position: absolute !important;
  }
`;
