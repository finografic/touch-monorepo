import type { PadItem, PadType } from 'types/ui.types';

export const initPadItems = ({
  numPads = 0,
  keys = [],
  type = 'radio',
}: {
  numPads: number;
  keys?: string[];
  type: PadType;
}): PadItem[] => {
  return numPads > 0
    ? Array.from({ length: numPads }, (_, i) => ({
        key: keys[i],
        type,
        isChecked: false,
      }))
    : [];
};

export const initPadItem = ({
  key,
  type = 'radio',
  isChecked = false,
}: {
  key: string;
  type: PadType;
  isChecked: boolean;
}): PadItem => {
  return {
    key,
    type,
    isChecked,
  };
};
