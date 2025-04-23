import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import { DND_TYPE } from './dnd.config';
import type { DraggableItem } from './ItemDndContainer.types';

export const useDragDrop = ({
  id,
  index,
  onDndMove,
}: {
  id: string;
  index: number;
  onDndMove: (fromIndex: number, toIndex: number) => void;
}) => {
  const dndRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, dragHandleRef, preview] = useDrag(() => ({
    type: DND_TYPE.ITEM,
    item: () => ({ id, index }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const [{ handlerId }, drop] = useDrop<DraggableItem, void, { handlerId: Identifier | null }>(() => ({
    accept: DND_TYPE.ITEM,
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover(item: DraggableItem, monitor) {
      if (!dndRef.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = dndRef.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y;

      // NOTE: THRESHOLD is TOP / BOTTOM EDGES
      // Trigger when crossing the bottom edge (dragging upward)
      if (dragIndex > hoverIndex && hoverClientY < hoverBoundingRect.bottom) {
        onDndMove(dragIndex, hoverIndex);
        return;
      }
      // Trigger when crossing the top edge (dragging downward)
      if (dragIndex < hoverIndex && hoverClientY > hoverBoundingRect.top) {
        onDndMove(dragIndex, hoverIndex);
        return;
      }
    },
  }));

  drop(dndRef);
  preview(dndRef);

  return {
    dndRef,
    dragHandleRef,
    isDragging,
    handlerId,
  };
};
