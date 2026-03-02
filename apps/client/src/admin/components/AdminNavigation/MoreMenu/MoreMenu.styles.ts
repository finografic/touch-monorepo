import { colors, layout } from '@workspace/design-system/tokens';

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

  /* Dropdown menu styles */
  .rt-DropdownMenuContent {
    min-width: 180px;

    .rt-DropdownMenuItem {
      cursor: pointer;

      &.active {
        background-color: ${colors.primary25};
        color: ${colors.primaryDark};
        font-weight: 700;
      }
    }
  }
`;
