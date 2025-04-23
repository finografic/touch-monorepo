import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  .dnd-container {
    width: 800px;
    height: 600px;
    border: 1px ${colors.greyDark};
    background-color: ${colors.greyXXLight};
  }

  .dnd-item {
    width: 800px;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    box-shadow: 0 0 0 2px ${colors.grey};
    background-color: ${colors.greyLight};
  }
`;
