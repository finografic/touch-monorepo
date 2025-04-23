import type { FC } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { styles } from '../Layout.styles';
import { DndItem } from './DndItem';

const DND_ITEMS = [
  {
    id: '1',
    name: 'Item 1',
    description: 'Item 1 description',
  },
  {
    id: '2',
    name: 'Item 2',
    description: 'Item 2 description',
  },
  {
    id: '3',
    name: 'Item 3',
    description: 'Item 3 description',
  },
];

interface DndContainerProps {}

export const DndPage: FC<DndContainerProps> = () => {
  return (
    <section css={styles}>
      <DndProvider backend={HTML5Backend}>
        <div id="dnd-container">
          {DND_ITEMS.map((item) => (
            <DndItem key={item.id} item={item} />
          ))}
        </div>
      </DndProvider>
    </section>
  );
};
