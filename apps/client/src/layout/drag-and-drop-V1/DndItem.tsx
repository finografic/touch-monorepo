import type { FC, RefObject } from 'react';
import { useRef, useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import type { DndItemProps } from './DndItem.types';
import { ITEM_TYPE } from './dnd.config';

export const DndItem: FC<DndItemProps> = ({ item, index, moveItem }) => {
  const ref = useRef<HTMLDivElement>(null);
  const initialX = useRef<number>(0);
  const containerBounds = useRef<DOMRect | null>(null);
  const [dragPosition, setDragPosition] = useState<number | null>(null);

  useEffect(() => {
    // Get container bounds
    const container = ref.current?.closest('.dnd-container');
    if (container) {
      containerBounds.current = container.getBoundingClientRect();
    }
  }, []);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: () => {
      if (ref.current) {
        const bounds = ref.current.getBoundingClientRect();
        initialX.current = bounds.left;
        setDragPosition(bounds.top);
      }
      return { index };
    },
    collect: (monitor) => {
      const isDragging = monitor.isDragging();
      const offset = monitor.getClientOffset();

      if (isDragging && offset && containerBounds.current && ref.current) {
        const minY = containerBounds.current.top;
        const maxY = containerBounds.current.bottom - ref.current.offsetHeight;
        setDragPosition(Math.max(minY, Math.min(maxY, offset.y)));
      }

      return { isDragging };
    },
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem: { index: number }, monitor) => {
      if (!ref.current) return;

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  const handleRef = (dragHandle: HTMLDivElement) => {
    drag(dragHandle);
  };

  drop(preview(ref));

  const style = isDragging
    ? {
        opacity: 0.33,
        position: 'fixed' as const,
        left: `${initialX.current}px`,
        top: dragPosition ? `${dragPosition}px` : undefined,
        width: ref.current?.offsetWidth,
        zIndex: 1000,
        pointerEvents: 'none' as const,
      }
    : undefined;

  return (
    <div ref={ref} style={style} className="dnd-item">
      <div ref={handleRef} className="dnd-item-handle">
        <HamburgerMenuIcon width={24} height={24} />
      </div>
      <div className="dnd-item-content">
        <strong>{item.name}</strong>
        <p>{item.description}</p>
      </div>
    </div>
  );
};
