import { css } from '@emotion/react';

import { button, colors } from 'styles';
import { generateUiColorVariants } from 'styles/utils/generate-ui-color-variants.utils';

// Generate semantic button color variants using the utility
export const buttonColorVariants = generateUiColorVariants(
  'button',
  (colorName, variants, componentType) => css`
    &.${componentType}-${colorName} {
      color: ${variants.light};
      border-color: ${variants.light};
      background-color: transparent;

      &:hover {
        color: ${variants.base};
        border-color: ${variants.base};
        background-color: ${colors[`${colorName}25` as keyof typeof colors]};
      }

      &:active {
        color: ${variants.dark};
        border-color: ${variants.dark};
        background-color: ${colors[`${colorName}50` as keyof typeof colors]};
      }

      &:disabled,
      &[data-disabled='true'] {
        cursor: not-allowed;
        color: ${colors.greyXLight};
        border-color: ${colors.greyXLight};
        background-color: transparent;

        &:hover {
          color: ${colors.greyXLight};
          border-color: ${colors.greyXLight};
          background-color: transparent;
        }
      }
    }
  `,
);

// Base styles shared across all interactive buttons
export const stylesButtonBase = css`
  /* TODO: NEEDED ?? ADD A LOT OF EXCESS CSS !!! */
  /* ${buttonColorVariants} */
  cursor: pointer;
  background: transparent;
  transition: ${button.transition};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* For absolute positioning of icons */
  box-shadow: none;

  color: ${colors.infoDark};
  border-color: ${colors.infoDark};
  border-width: ${button.border.width};
  border-style: ${button.border.style};

  color: ${colors.infoLight};
  border-color: ${colors.infoLight};

  :hover {
    color: ${colors.infoDark};
    border-color: ${colors.infoDark};
    background-color: ${colors.infoLight25};
    /* Scale removed for buttons - pads keep scale effect */
  }

  /* Override Radix UI disabled styles */
  :disabled,
  &.disabled,
  &[data-disabled='true'] {
    opacity: ${button.disabled.opacity};
    color: ${colors.defaultLight};
    border-color: ${colors.defaultLight};
    background-color: transparent;
    user-select: none;
    cursor: not-allowed;

    /* Ensure hover states don't override */
    :hover,
    :active {
      color: ${colors.defaultLight};
      border-color: ${colors.defaultLight};
      background-color: transparent;
      transform: none;
    }
  }

  /* Adjust for chevron icons to visually center the label */
  &.has-chevron {
    /* Add padding to compensate for the chevron */
    padding-left: 3rem;
    padding-right: 2rem;

    /* Position the chevron absolutely */
    svg {
      position: absolute;
      width: 30px;
      height: 30px;
      opacity: 0.8;
    }
  }

  /* For right-pointing chevrons */
  &.has-chevron-left {
    padding-left: 3.5rem;
    padding-right: 2.5rem;
    svg {
      left: 1.25rem;
      transform: translateX(25%);
    }
  }

  /* For right-pointing chevrons */
  &.has-chevron-right {
    padding-left: 2.5rem;
    padding-right: 3.5rem;
    svg {
      right: 1.25rem;
      transform: translateX(0);
    }
  }
`;

// Styles specific to navigation buttons
export const stylesSmallButton = css`
  ${stylesButtonBase}
  font-size: ${button.fontSize.base};
  font-weight: ${button.fontWeight.base};
  min-width: 180px;
  padding: 0.9rem 3rem;
  margin: 0 0.33rem;
  line-height: 1;
  gap: 0.5rem;
  flex: 1;
  width: fit-content;
  border-radius: 4px;
`;
