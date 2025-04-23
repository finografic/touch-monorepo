import { FC, useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { styles } from './Dnd.styles';
import type { DraggableItem } from './ItemDndContainer.types';
import ItemDndContainer from './ItemDndContainer';
import { ListDndContainer } from './ListDndContainer';
import { Col } from 'react-grid-system';

const INITIAL_ITEMS: DraggableItem[] = [
  {
    id: '1',
    index: 0,
    name: 'Item 1',
    description: 'First item description',
  },
  {
    id: '2',
    index: 1,
    name: 'Item 2',
    description: 'Second item description',
  },
  {
    id: '3',
    index: 2,
    name: 'Item 3',
    description: 'Third item description',
  },
];

export const DndDemo: FC = () => {
  const [items, setItems] = useState<DraggableItem[]>(INITIAL_ITEMS);

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
    <div css={styles}>
      <DndProvider backend={HTML5Backend}>
        <div className="dnd-container">
          <ListDndContainer INITIAL_ITEMS={items} />
          {/* {items.map((item, index) => (
            // <DndItem key={item.id} index={index} item={item} moveItem={moveItem} />
            <ItemDndContainer key={item.id} id={item.id} index={index} onDndMove={onDndMove}>
              <Col>
                <h3>{item.name}</h3>
              </Col>
              <Col>
                <p>{item.description}</p>
              </Col>
            </ItemDndContainer>
          ))} */}
        </div>
      </DndProvider>
    </div>
  );
};
