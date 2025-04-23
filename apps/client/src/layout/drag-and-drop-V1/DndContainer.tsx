import { FC, useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { styles } from './Dnd.styles';
import { DndItem } from './DndItem';
import type { DndItemType } from './DndItem.types';

const INITIAL_ITEMS: DndItemType[] = [
  {
    id: '1',
    name: 'Item 1',
    description: 'First item description',
  },
  {
    id: '2',
    name: 'Item 2',
    description: 'Second item description',
  },
  {
    id: '3',
    name: 'Item 3',
    description: 'Third item description',
  },
];

export const DndContainer: FC = () => {
  const [items, setItems] = useState<DndItemType[]>(INITIAL_ITEMS);

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
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
          {items.map((item, index) => (
            <DndItem key={item.id} index={index} item={item} moveItem={moveItem} />
          ))}
        </div>
      </DndProvider>
    </div>
  );
};
