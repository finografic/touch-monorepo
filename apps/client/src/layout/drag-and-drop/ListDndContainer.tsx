import { FC, useState, useCallback, useRef } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import type { DraggableItem } from './ItemDndContainer.types';
import ItemDndContainer from './ItemDndContainer';
import { Col } from 'react-grid-system';
import { DragLayer } from './DragLayer';
import { DND_TYPE } from './dnd.config';

type ListDndContainerProps = {
  INITIAL_ITEMS: DraggableItem[];
  // onDndMove: (dragIndex: number, hoverIndex: number) => void;
};

export const ListDndContainer: FC<ListDndContainerProps> = ({ INITIAL_ITEMS }) => {
  const [items, setItems] = useState<DraggableItem[]>(INITIAL_ITEMS);

  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, refDrop] = useDrop(() => ({
    accept: DND_TYPE.ITEM,
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const onDndMove = useCallback((dragIndex: number, hoverIndex: number) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const dragItem = newItems[dragIndex];

      // Remove dragItem and insert it at new position
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, dragItem);

      return newItems;
    });
  }, []);

  return (
    <div ref={ref}>
      <DragLayer rect={ref.current?.getBoundingClientRect()} />
      <div className={`dnd-drop-area ${isOver && 'hovering'}`} ref={refDrop}>
        {items.map((item, index) => (
          // <DndItem key={item.id} index={index} item={item} moveItem={moveItem} />
          <ItemDndContainer key={item.id} id={item.id} index={index} onDndMove={onDndMove}>
            <Col>
              <h3>{item.name}</h3>
            </Col>
            <Col>
              <p>{item.description}</p>
            </Col>
          </ItemDndContainer>
        ))}
      </div>
    </div>
  );
};
