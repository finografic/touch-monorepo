import type React from 'react';

export interface ItemDndContainerProps {
  id: string;
  index: number;
  onDndMove: (fromIndex: number, toIndex: number) => void;
  children?: React.ReactNode;
}

export type DraggableItem = {
  id: string;
  index: number;
  name: string;
  description: string;
};
