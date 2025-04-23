import type { FC } from 'react';
import type { ItemDndContainerProps } from './ItemDndContainer.types';
import StyledItemDndContainer from './StyledItemDndContainer';
import { useDragDrop } from './useDragDrop';
import { Row, Col } from 'react-grid-system';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { DND_TYPE } from './dnd.config';

const ItemDndContainer: FC<ItemDndContainerProps> = ({ id, index, onDndMove, children }) => {
  const { dndRef, dragHandleRef, isDragging, handlerId } = useDragDrop({
    id,
    index,
    onDndMove,
  });

  return (
    <StyledItemDndContainer
      className={`dnd-item ${isDragging ? 'dragging' : ''}`}
      ref={dndRef}
      data-handler-id={handlerId}
      isDragging={isDragging}
    >
      <Row style={{ width: '100%' }} align="center" justify="between">
        <Col>
          <button ref={dragHandleRef} aria-grabbed={isDragging} className="dnd-item-handle">
            <HamburgerMenuIcon width={24} height={24} />
          </button>
        </Col>
        {children}
      </Row>
    </StyledItemDndContainer>
  );
};

export default ItemDndContainer;
