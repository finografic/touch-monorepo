/**
 * Button and interactive element constants
 * Single source of truth for all button styling
 */

import { colors } from '../colors/colors-direct';
import { border } from '../layout/base.constants';

export const button = {
  background: colors.defaultXLight25,
  border: {
    width: '2px',
    style: 'solid',
  },
  color: {
    default: colors.defaultXLight,
    hover: colors.default,
    active: colors.secondaryXLight,
    disabled: colors.defaultXLight,
  },
  hover: {
    color: colors.default,
    border: colors.default,
    background: colors.defaultXLight25,
  },
  md: {
    minWidth: '200px',
    minHeight: '60px',
  },
  radius: border.radius.sm,
  transform: {
    hoverScale: 1.025,
    padHoverScale: 1.05,
    padBasicHoverScale: 1.02,
  },
  transition: 'transform 200ms ease, border-color 200ms ease, color 200ms ease',
  disabled: {
    opacity: 0.55, // TODO: DEV VALUE (HIGH) FOR LIGHT MODE.. MAKE VALUE LIGHTER IF NEEDED
  },
  padding: {
    base: '0.8rem',
    small: '0.4rem',
    large: '1rem',
  },
  fontSize: {
    base: '1.4rem',
    small: '1.2rem',
    large: '1.8rem',
  },
  fontWeight: {
    base: '600',
    small: '600',
    large: '600',
  },
} as const;
