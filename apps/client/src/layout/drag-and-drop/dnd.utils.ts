import type { XYCoord } from 'react-dnd';
import type { CSSProperties } from 'react';
import { colors } from 'styles';
import type { Identifier } from 'dnd-core';

export const DND_TYPE: Record<string, Identifier> = {
  CONTAINER: 'dnd-container',
  ITEM: 'dnd-item',
  HANDLE: 'dnd-handle',
};

export const getStyles = ({
  geometry: { top, left },
  isDragging = false,
}: {
  geometry: { left: number | undefined; top: number | undefined };
  isDragging: boolean;
}): CSSProperties => {
  const transform = `translate(${left}px, ${top}px)`;
  return {
    position: 'absolute',
    transform,
    WebkitTransform: transform,
    opacity: isDragging ? 0 : 1,
  };
};

// WHEN DRAGGING

export const getStylesDragging = (
  itemRect: DOMRect,
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  isDragging: boolean,
): CSSProperties => {
  if (!initialOffset || !currentOffset) return { display: 'none' };

  const { left, width, height } = itemRect;
  const { x, y } = currentOffset;

  const fix = { x: 0, y: 5 }; // adjustments while dragging
  const transform = `translate(${x + fix.x}px, ${y + fix.y}px)`;

  return {
    transform,
    WebkitTransform: transform,
    opacity: isDragging ? 0.85 : 1,
    height,
    left,
    width,
    border: `2px solid ${colors.greyLight}`,
    background: 'white',
    boxShadow: '2px 2px 10px 2px rgba(0,0,0,0.25)',
  };
};
