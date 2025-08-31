import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  .screen-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: ${layout.borderRadius};
    opacity: 0.5;
    background-color: #00cc9944;
    box-shadow: inset 0 0 0 3px ${colors.greyDark}cc;
  }

  .screen-800x480 {
    width: 800px;
    height: 480px;
  }

  .screen-1024x600 {
    width: 1024px;
    height: 600px;
  }
`;
