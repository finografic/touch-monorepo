import { css } from '@emotion/react';
import { padProps, stylesPad } from 'components/Pads/Pad/PadBasic.styles';

import { colors, layout } from 'styles';

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
        background-color: ${colors.defaultXLight50};
      }
      &:active {
        background-color: ${colors.defaultXLight75};
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
        background-color: ${colors.infoLight50};
      }
      &:active {
        background-color: ${colors.infoLight75};
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
        background-color: ${colors.dangerLight50};
      }
      &:active {
        background-color: ${colors.dangerLight75};
      }
    }

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
      color: ${colors.warningDark75};
      border-color: ${colors.warningDark75};
      background-color: ${colors.warningLight25};
    }

    &.status-error {
      cursor: default;
      pointer-events: none;
      color: ${colors.danger};
      border: ${layout.borderWidth} solid ${colors.danger};
      background-color: ${colors.danger25};
    }
  }
`;
