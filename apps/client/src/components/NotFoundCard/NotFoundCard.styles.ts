import { css } from '@emotion/react';

import { colorsDirect as colors, layout } from 'styles';

export const styles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 100px;

  p {
    display: block;
    font-size: 3em;
    color: ${colors.textLight};
    padding-bottom: calc(${layout.padding} * 3);
  }

  a {
    display: inline-block;
  }

  button {
    width: 100%;
    max-width: 240px;
    margin: calc(${layout.padding} * 1.5) 0 !important;
  }
`;
