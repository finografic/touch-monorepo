import { css } from '@emotion/react';
import { colors, layout } from 'styles';

export const styles = css`
  .screen-800x480 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: ${layout.borderRadius};
    opacity: 0.5;
    background-color: #00cc9944;
    width: 800px;
    height: 480px;
    box-shadow: inset 0 0 0 3px ${colors.greyDark}cc;
  }
`;
