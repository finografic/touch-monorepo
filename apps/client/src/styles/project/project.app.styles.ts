import { css } from '@emotion/react';
import { colors } from 'styles';

export const stylesAppContent = css`
  &.temperature-content,
  &.time-content {
    min-width: 800px;
    min-height: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .page-description {
    margin-top: -33%;
    margin-bottom: -8%;
  }

  .button-box button.btn {
    svg.icon {
      color: ${colors.default50};
    }
    svg.icon {
      width: 3rem;
      height: 3rem;
      display: inline-block;
      flex-shrink: 0;
      transition: all 0.2s ease-in-out;
      color: currentColor;
      display: none !important;
    }
    &:hover {
      border-color: transparent;
      background-color: ${colors.grey25};
      svg.icon {
        color: ${colors.greyLight};
      }
    }

    &.active {
      svg.icon {
        color: ${colors.warningDark};
      }
    }
  }
`;
