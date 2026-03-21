import { colors, layout } from '@finografic/design-system/tokens';

import { css } from '@emotion/react';
import { padProps, stylesPad } from 'components/Pads/Pad/PadBasic.styles';

export const styles = css`
  &.pad-slot,
  &.pad {
    ${stylesPad}

    width: ${padProps.pad.width};
    height: ${padProps.pad.height};
    border-radius: 50%;
    user-select: none;

    transition:
      color 150ms ease,
      border-color 150ms ease,
      background-color 150ms ease,
      transform 150ms ease;

    &.pad-large {
      width: ${padProps.padLG.width} !important;
      height: ${padProps.padLG.height} !important;
    }

    /* ====================================================================== */

    /* item-type-A/B/C: state-based styling only (no :hover — touch screens get stuck) */
    &.item-type-A {
      color: ${colors.defaultXLight};
      border-color: ${colors.defaultXLight};
      background-color: transparent;
      &.checked,
      &.selected,
      &.active,
      &.selected.checking-blocked,
      &[data-state='checked'],
      &[aria-checked='true'] {
        color: ${colors.defaultDark};
        border-color: ${colors.defaultDark};
        background-color: ${colors.defaultXXLight};
      }
      &:active {
        background-color: ${colors.defaultXLight};
      }
    }

    &.item-type-B {
      color: ${colors.infoLight};
      border-color: ${colors.infoLight};
      background-color: transparent;
      &.checked,
      &.selected,
      &.active,
      &.selected.checking-blocked,
      &[data-state='checked'],
      &[aria-checked='true'] {
        color: ${colors.infoXDark};
        border-color: ${colors.infoXDark};
        background-color: ${colors.infoLighter};
      }
      &:active {
        background-color: ${colors.infoLight};
      }
    }

    &.item-type-C {
      color: ${colors.dangerLight};
      border-color: ${colors.dangerLight};
      background-color: transparent;
      &.checked,
      &.selected,
      &.active,
      &.selected.checking-blocked,
      &[data-state='checked'],
      &[aria-checked='true'] {
        color: ${colors.dangerXDark};
        border-color: ${colors.dangerXDark};
        background-color: ${colors.dangerLighter};
      }
      &:active {
        background-color: ${colors.dangerLight};
      }
    }

    /* ALT relay slot (SlotSpecial.ALT) — class item-type-Alt from enum value Alt */
    &.item-type-Alt {
      color: ${colors.secondaryLight};
      border-color: ${colors.secondaryLight};
      background-color: transparent;
      cursor: default;
      &.checked,
      &.selected,
      &.active,
      &.selected.checking-blocked,
      &[data-state='checked'],
      &[aria-checked='true'] {
        color: ${colors.secondaryXDark};
        border-color: ${colors.secondaryXDark};
        background-color: ${colors.secondaryLighter};
      }
      &:active {
        background-color: ${colors.secondaryLight};
      }
    }

    /* Special large slots (sidebar): grid = danger/red, alt = secondary */
    &.pad-special-grid {
      color: ${colors.dangerLight};
      border-color: ${colors.dangerLight};
      background-color: transparent;
      &.checked,
      &.selected,
      &[data-state='checked'],
      &[aria-checked='true'] {
        color: ${colors.dangerXDark};
        border-color: ${colors.dangerXDark};
        background-color: ${colors.dangerLighter};
      }
    }
    /* pad-special-alt className = layout hook in MainSlotGrid; ALT colors use item-type-Alt. */

    /* ====================================================================== */

    /* ACTIVE TIMERS */

    &.status-processing {
      color: ${colors.success};
      border-color: ${colors.success};
      background-color: transparent;
      &:disabled {
        cursor: wait;
        &:hover {
        }
      }
      &.checking-blocked {
        cursor: not-allowed;
        pointer-events: none;
        color: ${colors.success};
        border-color: ${colors.success};
        background-color: transparent;
        transform: none;
      }
    }

    /* COMPLETED TIMERS */

    &.status-completed {
      pointer-events: none;
      user-select: none;
      color: ${colors.warningDark};
      border-color: ${colors.warningDark};
      background-color: ${colors.warningLighter};
    }

    &.status-error {
      cursor: default;
      pointer-events: none;
      color: ${colors.danger};
      border: ${layout.borderWidth} solid ${colors.danger};
      background-color: ${colors.dangerLight};
    }
  }
`;
