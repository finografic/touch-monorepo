import type { FC } from 'react';

interface DndItemProps {
  item: {
    description: string;
    name: string;
  };
}

export const DndItem: FC<DndItemProps> = ({ item }) => {
  return (
    <div>
      <div ref={preview} style={{ ...style, opacity }} className="dnd-item">
        <div ref={drag} style={handleStyle} />
        <strong>{item.name}</strong>
        <p>{item.description}</p>
      </div>
    </div>
  );
};
