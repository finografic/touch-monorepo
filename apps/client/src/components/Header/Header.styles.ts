import { css } from '@emotion/react';
import { colors, min, spacing } from 'styles';

export const styles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  padding: ${spacing[4]} 0;
  background-color: transparent;
  /* background-color: pink; */
  border-bottom: none;

  ${min.md} {
    padding: ${spacing[2]} 0;
  }

  h1 {
    color: ${colors.info};
  }
`;
