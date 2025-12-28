/* eslint-disable import/no-duplicates */
/**
 * Example Usage - Color System with Emotion Themes
 * Demonstrates the new performance-optimized approach
 */

import type { FC } from 'react';
import React from 'react';

import { css, useTheme } from '@emotion/react';

// ============================================================================
// EXAMPLE 2: Using Direct Colors (Static)
// ============================================================================
import { colorsDirect as colors } from 'styles';
// ============================================================================
// EXAMPLE 6: Migration from Old System
// ============================================================================
// ❌ OLD WAY (CSS Variables)
import { colors as oldColors } from 'styles';
// ============================================================================
// EXAMPLE 7: Utility Function with Theme
// ============================================================================
import type { EmotionTheme } from 'styles/themes/emotion-theme.types';

// ============================================================================
// EXAMPLE 1: Theme-Aware Button Component
// ============================================================================

interface ButtonProps {
  variant?: 'solid' | 'outline' | 'ghost';
  color?: 'primary' | 'secondary' | 'success' | 'danger';
  children: React.ReactNode;
}

const ThemedButton: FC<ButtonProps> = ({ variant = 'solid', color = 'primary', children }) => {
  const theme = useTheme();

  // Access colors from theme
  const baseColor = theme.colors[color];
  const lightColor = theme.colors[`${color}Light`];
  const darkColor = theme.colors[`${color}Dark`];
  const transparentColor = theme.colors[`${color}25`];

  const buttonStyles = css`
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    ${variant === 'solid' &&
    css`
      background: ${lightColor};
      color: ${theme.colors.white};
      border: 1px solid ${lightColor};

      &:hover {
        background: ${baseColor};
        border-color: ${baseColor};
      }
    `}

    ${variant === 'outline' &&
    css`
      background: transparent;
      color: ${baseColor};
      border: 1px solid ${baseColor};

      &:hover {
        background: ${transparentColor};
        color: ${darkColor};
        border-color: ${darkColor};
      }
    `}

    ${variant === 'ghost' &&
    css`
      background: transparent;
      color: ${baseColor};
      border: 1px solid transparent;

      &:hover {
        background: ${transparentColor};
        color: ${darkColor};
      }
    `}
  `;

  return <button css={buttonStyles}>{children}</button>;
};

const StaticCard: FC<{ children: React.ReactNode }> = ({ children }) => {
  const cardStyles = css`
    padding: 1rem;
    border-radius: 0.5rem;
    background: ${colors.white};
    border: 1px solid ${colors.greyLight};
    box-shadow: 0 2px 4px ${colors.black25};

    &:hover {
      border-color: ${colors.primary};
      box-shadow: 0 4px 8px ${colors.primary25};
    }
  `;

  return <div css={cardStyles}>{children}</div>;
};

// ============================================================================
// EXAMPLE 3: Using useTheme Hook
// ============================================================================

const ThemeAwareAlert: FC<{ type: 'success' | 'warning' | 'danger' }> = ({ type }) => {
  const theme = useTheme();

  const alertStyles = css`
    padding: 1rem;
    border-radius: 0.375rem;
    background: ${theme.colors[`${type}XXLight`]};
    border-left: 4px solid ${theme.colors[type]};
    color: ${theme.colors[`${type}Dark`]};

    strong {
      color: ${theme.colors[`${type}XDark`]};
      font-weight: 600;
    }
  `;

  return (
    <div css={alertStyles}>
      <strong>{type.toUpperCase()}:</strong> This is a {type} message
    </div>
  );
};

// ============================================================================
// EXAMPLE 4: Complex Styled Component
// ============================================================================

const ComplexCard: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    css={css`
      /* Uses theme context automatically */
      background: ${({ theme }) => theme.colors.background};
      border: 1px solid ${({ theme }) => theme.colors.greyLight};
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 2px 8px ${({ theme }) => theme.colors.black25};

      /* Nested selectors work too */
      .header {
        color: ${({ theme }) => theme.colors.primary};
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1rem;
        border-bottom: 2px solid ${({ theme }) => theme.colors.primaryLight};
        padding-bottom: 0.5rem;
      }

      .content {
        color: ${({ theme }) => theme.colors.text};
        line-height: 1.6;
      }

      .footer {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid ${({ theme }) => theme.colors.greyXLight};
        color: ${({ theme }) => theme.colors.textLight};
        font-size: 0.875rem;
      }

      /* Hover states */
      &:hover {
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 4px 12px ${({ theme }) => theme.colors.primary25};

        .header {
          color: ${({ theme }) => theme.colors.primaryDark};
        }
      }

      /* Responsive */
      @media (max-width: 768px) {
        padding: 1rem;

        .header {
          font-size: 1rem;
        }
      }
    `}
  >
    {children}
  </div>
);

// ============================================================================
// EXAMPLE 5: Gradients and Complex Colors
// ============================================================================

const GradientBanner: FC = () => {
  const theme = useTheme();

  return (
    <div
      css={css`
        padding: 3rem 2rem;
        background: linear-gradient(135deg, ${theme.colors.primaryLight}, ${theme.colors.secondaryLight});
        color: ${theme.colors.white};
        text-align: center;
        border-radius: 0.5rem;

        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px ${theme.colors.black50};
        }

        p {
          font-size: 1.25rem;
          opacity: 0.9;
        }
      `}
    >
      <h1>Welcome to Your App</h1>
      <p>Theme-aware components with no CSS variable overhead!</p>
    </div>
  );
};

const OldButton: FC = () => (
  <button
    css={css`
      background: ${oldColors.primary}; // Returns: var(--color-primary)
      color: ${oldColors.white};
    `}
  >
    Old Button
  </button>
);

// ✅ NEW WAY (Direct Values - Better Performance!)
const NewButton: FC = () => (
  <button
    css={css`
      background: ${({ theme }) => theme.colors.primary}; // Returns: #1e3a8a
      color: ${({ theme }) => theme.colors.white};
    `}
  >
    New Button
  </button>
);

/**
 * Generate status color based on value
 */
function getStatusColor(value: number, theme: EmotionTheme): string {
  if (value < 30) return theme.colors.danger;
  if (value < 70) return theme.colors.warning;
  return theme.colors.success;
}

const StatusIndicator: FC<{ value: number }> = ({ value }) => {
  const theme = useTheme();
  const statusColor = getStatusColor(value, theme);

  return (
    <div
      css={css`
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        background: ${statusColor}25;
        border: 1px solid ${statusColor};
        color: ${statusColor};
        font-weight: 500;
      `}
    >
      <span
        css={css`
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${statusColor};
        `}
      />
      {value}%
    </div>
  );
};

// ============================================================================
// Export examples for documentation
// ============================================================================

export {
  ComplexCard,
  GradientBanner,
  NewButton,
  OldButton,
  StaticCard,
  StatusIndicator,
  ThemeAwareAlert,
  ThemedButton,
};
