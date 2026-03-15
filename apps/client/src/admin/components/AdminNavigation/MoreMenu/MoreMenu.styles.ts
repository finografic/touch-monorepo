import { colors, layout } from '@finografic/design-system/tokens';

import { css } from '@emotion/react';

import { stylesTypography } from '../AdminNavWrapper.styles';

export const styles = css`
  button {
    display: flex;
    align-items: center;
    justify-content: center;

    ${stylesTypography}

    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: ${layout.borderRadius};
    transition: all 0.2s ease;
    opacity: 1;
    white-space: nowrap;

    :hover {
      background-color: transparent !important;
      color: ${colors.text};
    }

    &.active {
      color: ${colors.info};
      :before {
        border-bottom: 2px solid ${colors.info};
      }
      & span {
        background-color: transparent;
      }
      :hover {
        color: ${colors.infoXDark};
        :before {
          border-bottom: 2px solid ${colors.infoXDark};
        }
        & span {
          background-color: transparent;
        }
      }
    }

    &.transitioning {
      cursor: wait;
      opacity: 0.7;
    }

    &.more-button,
    &.hamburger-button {
      font-weight: 600;
    }
  }

  /* caret icon */
  svg:not(.icon) {
    transform: scale(1.4);
  }
  /* route icon */
  svg.icon {
    width: 1.4rem;
  }

  /* Dropdown menu styles — Ark UI [data-part] selectors */
  .more-dropdown {
    min-width: 180px;
    background-color: ${colors.white};
    border: 1px solid ${colors.defaultXXLight};
    border-radius: ${layout.borderRadius};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 0.25rem;
    z-index: 100;

    [data-part='item'] {
      cursor: pointer;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 600;
      color: ${colors.text};
      transition: background-color 0.15s ease;

      &[data-highlighted] {
        background-color: ${colors.defaultXXXLight};
        outline: none;
      }

      &.active {
        background-color: ${colors.primaryLight};
        color: ${colors.primaryDark};
        font-weight: 700;
      }
    }
  }
`;
