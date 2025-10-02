import { css } from '@emotion/react';
import { colors, layout } from 'styles';
import { generateClassColorVariants } from 'styles/utils/generateClassColorVariants';

export const styles = css`
  /* RESET */
  appearance: none;
  outline: none;
  background: none;
  background-image: none;
  background-color: transparent;
  border: none;

  position: relative;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;

  user-select: none;

  /* CENTER TEXT */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &.btn {
    border-width: ${layout.borderWidth};
    border-style: solid !important;
    margin: 0 calc(${layout.padding} / 2);
    background: transparent;

    &.size-xs {
      font-size: 1em;
    }
    &.size-sm {
      font-size: 1.1em;
    }
    &.size-md {
      font-size: 1.2em;
    }
    &.size-lg {
      font-size: 1.3em;
    }
    &.size-xl {
      font-size: 1.4em;
    }

    &.full-width {
      width: 100%;
    }

    &.icon-only {
      /* padding: 0.8em;
    width: 60px !important;
    height: 60px !important; */
      /* width: 24px;
  height: 40px; */
      padding: 0.5em 1em;
      border-radius: ${layout.borderRadius};
    }

    /* BORDER */
    & {
      &:disabled {
        border-width: ${layout.borderWidth};
        border-style: solid;
      }
      border-radius: ${layout.borderRadius};
    }

    /* SIZE: FONT + PADDING */
    font-size: 1.3em;
    font-weight: 600;
    letter-spacing: -0.02em;
    white-space: nowrap;

    padding: 0.66em;

    &.btn-padded {
      /* padding: 0.5em 2.75em; */
      padding: 0.5em 2em;
    }

    /* UX */
    transition:
      background-color 300ms ease,
      border-color 300ms ease;

    /* &.variant-solid {
      background-color: inherit;
    } */

    &.btn-outline {
      background-color: transparent;
    }

    /* DISABLED */
    &:disabled {
      opacity: 0.66;
      background-color: ${colors.grey};
      border-color: ${colors.grey};
      filter: grayscale(0.33);
      cursor: default;
      pointer-events: none;

      &.variant-outline {
        background-color: transparent;
      }
    }

    span {
      /* padding-top: 0.1em; */
    }

    /* ICON */
    svg {
      vertical-align: middle;
    }
    svg + span {
      margin-left: 0.75em;
    }
    span + svg {
      margin-left: 0.75em;
    }

    /* COLOR VARIANTS */

    &.btn-primary {
      background-color: ${colors.primary};
      border-color: ${colors.primary};
      * {
        color: ${colors.white};
      }
      &:hover {
        background-color: ${colors.primaryXDark};
        border-color: ${colors.primaryXDark};
      }
    }

    &.btn-default {
      background-color: ${colors.defaultDark};
      border-color: ${colors.defaultXLight};
      * {
        color: ${colors.defaultDark};
      }
    }

    &.btn-info {
      background-color: ${colors.infoDark};
      border-color: ${colors.infoXLight};
      * {
        color: ${colors.infoDark};
      }
    }

    &.btn-success {
      background-color: ${colors.successDark};
      border-color: ${colors.successXLight};
      * {
        color: ${colors.successDark};
      }
    }

    &.btn-warning {
      background-color: ${colors.warningDark};
      border-color: ${colors.warningXLight};
      * {
        color: ${colors.warningDark};
      }
    }

    &.btn-danger {
      background-color: ${colors.dangerDark};
      border-color: ${colors.dangerXLight};
      * {
        color: ${colors.dangerDark};
      }
    }

    ${generateClassColorVariants(
      (color, variant) => /* css */ `&.btn-solid.btn-${color} {
        background-color: ${variant.dark}!important;
        border-color: ${variant.xdark}!important;
        * {
          color: ${colors.white}!important;
          -webkit-text-fill-color: ${colors.white}!important;
        }
        &:hover{
          background-color: ${variant.xdark}!important;
          border-color: ${variant.xdark}!important;
        }
      }`,
    )}

    ${generateClassColorVariants(
      (color, variant) => /* css */ `&.btn-outline.btn-${color} {
        background-color: transparent!important;
        border-color: ${variant.xdark}!important;
        * {
          color: ${variant.xdark}!important;
          -webkit-text-fill-color: ${variant.xdark}!important;
        }
        &:hover{
          background-color: ${variant.xdark}!important;
          border-color: ${variant.xdark}!important;
        }
      }`,
    )}
  }
`;
