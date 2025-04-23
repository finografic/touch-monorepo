import { css } from '@emotion/react';
import { colors } from 'styles';

export const styles = css`
  .dnd-container {
    width: 800px;
    height: 600px;
    padding: 1rem;
    border: 2px solid ${colors.greyDark};
    background-color: ${colors.greyXXLight};
    overflow-y: auto;
  }

  .dnd-item {
    width: 100%;
    height: 100px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: ${colors.white};
    border: 1px solid ${colors.greyLight};
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.2s ease;

    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }

  .dnd-item-handle {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    color: ${colors.grey};
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  .dnd-item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;
