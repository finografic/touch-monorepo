import { css } from '@emotion/react';
import { colors } from 'styles';
import { generateComponentColorVariants } from './generateClassColorVariants';

/**
 * Usage Examples for generateComponentColorVariants
 *
 * This file demonstrates how to use the modernized color variant generator
 * for different component types.
 */

// ============================================================================
// Button Component Example
// ============================================================================

export const buttonColorVariants = generateComponentColorVariants(
  'button',
  (colorName, variants, componentType) => css`
    &.${componentType}-${colorName} {
      background-color: ${variants.dark};
      border-color: ${variants.xdark};
      color: ${colors.white};

      &:hover:not(:disabled) {
        background-color: ${variants.xdark};
        border-color: ${variants.xxdark};
      }

      &:active:not(:disabled) {
        background-color: ${variants.xxdark};
      }
    }
  `,
);

// ============================================================================
// Alert Component Example
// ============================================================================

export const alertColorVariants = generateComponentColorVariants(
  'alert',
  (colorName, variants, componentType) => css`
    &.${componentType}-${colorName} {
      background-color: ${variants.light};
      border-color: ${variants.dark};
      color: ${variants.dark};

      .${componentType}-icon {
        color: ${variants.dark};
      }

      .${componentType}-close {
        color: ${variants.dark};

        &:hover {
          background-color: ${variants.xlight};
        }
      }
    }
  `,
);

// ============================================================================
// Card Component Example
// ============================================================================

export const cardColorVariants = generateComponentColorVariants(
  'card',
  (colorName, variants, componentType) => css`
    &.${componentType}-${colorName} {
      background-color: ${colors.white};
      border: 1px solid ${variants.light};

      .${componentType}-header {
        background-color: ${variants.light};
        color: ${variants.dark};
      }

      .${componentType}-footer {
        background-color: ${variants.xlight};
        color: ${variants.dark};
      }
    }
  `,
);

// ============================================================================
// Toast Component Example
// ============================================================================

export const toastColorVariants = generateComponentColorVariants(
  'toast',
  (colorName, variants, componentType) => css`
    &.${componentType}-${colorName} {
      background-color: ${variants.light};
      border-left: 4px solid ${variants.dark};
      color: ${variants.dark};

      .${componentType}-icon {
        color: ${variants.dark};
      }

      .${componentType}-close {
        color: ${variants.dark};

        &:hover {
          background-color: ${variants.xlight};
        }
      }
    }
  `,
);

// ============================================================================
// Badge Component Example
// ============================================================================

export const badgeColorVariants = generateComponentColorVariants(
  'badge',
  (colorName, variants, componentType) => css`
    &.${componentType}-${colorName} {
      background-color: ${variants.dark};
      color: ${colors.white};

      &.${componentType}-outline {
        background-color: transparent;
        color: ${variants.dark};
        border: 1px solid ${variants.dark};
      }

      &.${componentType}-light {
        background-color: ${variants.light};
        color: ${variants.dark};
      }
    }
  `,
);

// ============================================================================
// Usage in Component Styles
// ============================================================================

/*
// Example: Alert Component Styles
export const alertStyles = css`
  // Base alert styles
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  // Include color variants
  ${alertColorVariants}
`;

// Example: Button Component Styles (alternative to getVariantStyles)
export const buttonStyles = css`
  // Base button styles
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  // Include color variants
  ${buttonColorVariants}
`;
*/
