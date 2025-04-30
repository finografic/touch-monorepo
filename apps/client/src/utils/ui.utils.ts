import type { PadItem, PadType } from 'types/ui.types';

export const initPadItems = ({
  num = 0,
  ids = [],
  type = 'radio',
}: {
  num: number;
  ids?: string[];
  type: PadType;
}): PadItem[] => {
  return num > 0
    ? Array.from({ length: num }, (_, i) => ({
        index: i + 1,
        id: ids[i] || `Pad ${i + 1}`,
        type,
        isChecked: false,
      }))
    : [];
};

export const initPadItem = ({
  index,
  id,
  type = 'radio',
  isChecked = false,
}: {
  index: number;
  id: string;
  type: PadType;
  isChecked: boolean;
}): PadItem => {
  return {
    index,
    id,
    type,
    isChecked,
  };
};
