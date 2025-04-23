/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-redeclare */
import { useDragLayer } from 'react-dnd';
import { useState, useLayoutEffect } from 'react';
import { DragPreview } from './DragPreview';
import { getStylesDragging } from './dnd.utils';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

export const DragLayer = ({ rect }) => {
  const [limits, setLimits] = useState({
    minY: 0,
    maxY: 0,
  });

  useLayoutEffect(() => {
    if (rect?.top && rect?.height) {
      const minY = rect.top;
      const maxY = minY + rect.height;
      setLimits({ minY, maxY });
    }
  }, [rect]);

  const { isDragging, initialOffset, currentOffset, itemRect, valueName } = useDragLayer((monitor) => {
    const valueName = monitor.getItem()?.value;
    const itemRect = monitor.getItem()?.rect;
    const itemHeight = itemRect?.height;
    const x = monitor.getInitialSourceClientOffset()?.x;
    const dragY = monitor.getSourceClientOffset()?.y || 0;

    let y = dragY;
    if (dragY < limits.minY) y = limits.minY;
    if (dragY > limits.maxY - itemHeight * 2) y = limits.maxY - itemHeight * 2;

    return {
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: { x, y },
      isDragging: monitor.isDragging(),
      itemRect,
      valueName,
    };
  });

  if (!isDragging) {
    return null;
  }

  const draggingStyles = getStylesDragging(itemRect, initialOffset, currentOffset, isDragging);

  return (
    <div style={layerStyles}>
      <div style={draggingStyles}>
        <DragPreview valueName={valueName} />
      </div>
    </div>
  );
};
