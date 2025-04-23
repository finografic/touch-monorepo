import styled from 'styled-components';
import { DND_TYPE } from './dnd.config';

const StyledItemDndContainer = styled.div<{
  isDragging: boolean;
}>`
  box-sizing: border-box;
  opacity: ${(props) => (props.isDragging ? 0.85 : 1)};
  button[data-role$='-${DND_TYPE.HANDLE as string}'] {
    cursor: grab;
    &[aria-grabbed='true'],
    &:active {
      cursor: grabbing;
    }
  }
`;

export default StyledItemDndContainer;
