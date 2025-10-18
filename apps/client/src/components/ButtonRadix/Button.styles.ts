import { css } from '@emotion/react';

import { colors } from 'styles/colors/colors.styles';

// Helper to create rgba from hex with opacity
export const withOpacity = (hex: string, opacity: number) => {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Opacity values for different states/variants
export const opacities = {
  soft: {
    default: 0.15,
    hover: 0.25,
  },
  outline: {
    hover: 0.1,
  },
  ghost: {
    hover: 0.1,
  },
  disabled: 0.75,
} as const;

// Types for button variants and states
type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost';
type ButtonState = 'default' | 'hover' | 'disabled';
type ButtonStatusColor = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface ButtonStateStyles {
  background: string;
  border: string;
  label: string;
}

type ButtonVariantStyles = {
  [State in ButtonState]: ButtonStateStyles;
};

type ButtonColorVariant = {
  [Variant in ButtonVariant]: ButtonVariantStyles;
};

// Individual color variants
const success: ButtonColorVariant = {
  solid: {
    default: {
      background: colors.successDark,
      border: colors.transparent,
      label: colors.white,
    },
    hover: {
      background: colors.successXDark,
      border: colors.transparent,
      label: colors.white,
    },
    disabled: {
      background: colors.successDark,
      border: colors.transparent,
      label: colors.white,
    },
  },
  soft: {
    default: {
      background: withOpacity(colors.successDark, opacities.soft.default),
      border: colors.transparent,
      label: colors.successXDark,
    },
    hover: {
      background: withOpacity(colors.successDark, opacities.soft.hover),
      border: colors.transparent,
      label: colors.successXDark,
    },
    disabled: {
      background: withOpacity(colors.successXDark, opacities.soft.default),
      border: colors.transparent,
      label: colors.successXDark,
    },
  },
  outline: {
    default: {
      background: colors.transparent,
      border: colors.successDark,
      label: colors.successDark,
    },
    hover: {
      background: withOpacity(colors.successDark, opacities.outline.hover),
      border: colors.successXDark,
      label: colors.successXDark,
    },
    disabled: {
      background: colors.transparent,
      border: colors.successDark,
      label: colors.successDark,
    },
  },
  ghost: {
    default: {
      background: colors.transparent,
      border: colors.transparent,
      label: colors.successDark,
    },
    hover: {
      background: withOpacity(colors.successDark, opacities.ghost.hover),
      border: colors.transparent,
      label: colors.successXDark,
    },
    disabled: {
      background: colors.transparent,
      border: colors.transparent,
      label: colors.successDark,
    },
  },
};

const warning: ButtonColorVariant = {
  solid: {
    default: {
      background: colors.warningDark,
      border: colors.transparent,
      label: colors.white,
    },
    hover: {
      background: colors.warningXDark,
      border: colors.transparent,
      label: colors.white,
    },
    disabled: {
      background: colors.warningDark,
      border: colors.transparent,
      label: colors.white,
    },
  },
  soft: {
    default: {
      background: withOpacity(colors.warningDark, opacities.soft.default),
      border: colors.transparent,
      label: colors.warningXDark,
    },
    hover: {
      background: withOpacity(colors.warningDark, opacities.soft.hover),
      border: colors.transparent,
      label: colors.warningXDark,
    },
    disabled: {
      background: withOpacity(colors.warningDark, opacities.soft.default),
      border: colors.transparent,
      label: colors.warningXDark,
    },
  },
  outline: {
    default: {
      background: colors.transparent,
      border: colors.warningDark,
      label: colors.warningDark,
    },
    hover: {
      background: withOpacity(colors.warningDark, opacities.outline.hover),
      border: colors.warningXDark,
      label: colors.warningXDark,
    },
    disabled: {
      background: colors.transparent,
      border: colors.warningDark,
      label: colors.warningDark,
    },
  },
  ghost: {
    default: {
      background: colors.transparent,
      border: colors.transparent,
      label: colors.warningDark,
    },
    hover: {
      background: withOpacity(colors.warningDark, opacities.ghost.hover),
      border: colors.transparent,
      label: colors.warningXDark,
    },
    disabled: {
      background: colors.transparent,
      border: colors.transparent,
      label: colors.warningDark,
    },
  },
};

const danger: ButtonColorVariant = {
  solid: {
    default: {
      background: colors.dangerDark,
      border: colors.transparent,
      label: colors.white,
    },
    hover: {
      background: colors.dangerXDark,
      border: colors.transparent,
      label: colors.white,
    },
    disabled: {
      background: colors.dangerDark,
      border: colors.transparent,
      label: colors.white,
    },
  },
  soft: {
    default: {
      background: withOpacity(colors.dangerDark, opacities.soft.default),
      border: colors.transparent,
      label: colors.dangerXDark,
    },
    hover: {
      background: withOpacity(colors.dangerDark, opacities.soft.hover),
      border: colors.transparent,
      label: colors.dangerXDark,
    },
    disabled: {
      background: withOpacity(colors.dangerDark, opacities.soft.default),
      border: colors.transparent,
      label: colors.dangerXDark,
    },
  },
  outline: {
    default: {
      background: colors.transparent,
      border: colors.dangerDark,
      label: colors.dangerDark,
    },
    hover: {
      background: withOpacity(colors.dangerDark, opacities.outline.hover),
      border: colors.dangerXDark,
      label: colors.dangerXDark,
    },
    disabled: {
      background: colors.transparent,
      border: colors.dangerDark,
      label: colors.dangerDark,
    },
  },
  ghost: {
    default: {
      background: colors.transparent,
      border: colors.transparent,
      label: colors.dangerDark,
    },
    hover: {
      background: withOpacity(colors.dangerDark, opacities.ghost.hover),
      border: colors.transparent,
      label: colors.dangerXDark,
    },
    disabled: {
      background: colors.transparent,
      border: colors.transparent,
      label: colors.dangerDark,
    },
  },
};

const info: ButtonColorVariant = {
  solid: {
    default: {
      background: colors.infoDark,
      border: colors.transparent,
      label: colors.white,
    },
    hover: {
      background: colors.infoXDark,
      border: colors.transparent,
      label: colors.white,
    },
    disabled: {
      background: colors.infoDark,
      border: colors.transparent,
      label: colors.white,
    },
  },
  soft: {
    default: {
      background: withOpacity(colors.infoDark, opacities.soft.default),
      border: colors.transparent,
      label: colors.infoXDark,
    },
    hover: {
      background: withOpacity(colors.infoDark, opacities.soft.hover),
      border: colors.transparent,
      label: colors.infoXDark,
    },
    disabled: {
      background: withOpacity(colors.infoDark, opacities.soft.default),
      border: colors.transparent,
      label: colors.infoXDark,
    },
  },
  outline: {
    default: {
      background: colors.transparent,
      border: colors.infoDark,
      label: colors.infoDark,
    },
    hover: {
      background: withOpacity(colors.infoDark, opacities.outline.hover),
      border: colors.infoXDark,
      label: colors.infoXDark,
    },
    disabled: {
      background: colors.transparent,
      border: colors.infoDark,
      label: colors.infoDark,
    },
  },
  ghost: {
    default: {
      background: colors.transparent,
      border: colors.transparent,
      label: colors.infoDark,
    },
    hover: {
      background: withOpacity(colors.infoDark, opacities.ghost.hover),
      border: colors.transparent,
      label: colors.infoXDark,
    },
    disabled: {
      background: colors.transparent,
      border: colors.transparent,
      label: colors.infoDark,
    },
  },
};

const defaultVariant: ButtonColorVariant = {
  solid: {
    default: {
      background: colors.defaultDark,
      border: colors.transparent,
      label: colors.white,
    },
    hover: {
      background: colors.defaultXDark,
      border: colors.transparent,
      label: colors.white,
    },
    disabled: {
      background: colors.defaultDark,
      border: colors.transparent,
      label: colors.white,
    },
  },
  soft: {
    default: {
      background: withOpacity(colors.defaultDark, opacities.soft.default),
      border: colors.transparent,
      label: colors.defaultXDark,
    },
    hover: {
      background: withOpacity(colors.defaultDark, opacities.soft.hover),
      border: colors.transparent,
      label: colors.defaultXDark,
    },
    disabled: {
      background: withOpacity(colors.defaultDark, opacities.soft.default),
      border: colors.transparent,
      label: colors.defaultDark,
    },
  },
  outline: {
    default: {
      background: colors.transparent,
      border: colors.defaultLight,
      label: colors.defaultLight,
    },
    hover: {
      background: withOpacity(colors.default, opacities.outline.hover),
      border: colors.defaultDark,
      label: colors.defaultDark,
    },
    disabled: {
      background: colors.transparent,
      border: colors.defaultXDark,
      label: colors.defaultXDark,
    },
  },
  ghost: {
    default: {
      background: colors.transparent,
      border: colors.transparent,
      label: colors.defaultDark,
    },
    hover: {
      background: withOpacity(colors.defaultDark, opacities.ghost.hover),
      border: colors.transparent,
      label: colors.defaultXDark,
    },
    disabled: {
      background: colors.transparent,
      border: colors.transparent,
      label: colors.defaultDark,
    },
  },
};

// Combined color variables with type safety
export const colorVariables: Record<ButtonStatusColor, ButtonColorVariant> = {
  success,
  warning,
  danger,
  info,
  default: defaultVariant,
} as const;

// Helper function to get button styles
export const getButtonStyles = (variant: ButtonVariant, color: ButtonStatusColor) => {
  const styles = colorVariables[color][variant];

  return css`
    background-color: ${styles.default.background};
    border-color: ${styles.default.border};
    color: ${styles.default.label};
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background-color: ${styles.hover.background};
      border-color: ${styles.hover.border};
      color: ${styles.hover.label};
    }

    &:disabled {
      opacity: ${opacities.disabled};
      cursor: not-allowed;
    }
  `;
};
