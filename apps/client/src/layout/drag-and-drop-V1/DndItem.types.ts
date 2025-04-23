export interface DndItemType {
  id: string;
  name: string;
  description: string;
}

export interface DndItemProps {
  item: DndItemType;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}
