import { createMenuLayout } from 'types/menu.types';
import { NUM_ITEMS_TYPE_B } from 'src/config/app.config';
import type { MenuBCount } from 'pages/MenuPage/menu.types';
import type { PadTestProps } from 'pages/MenuPage/MenuPage';

// Create and export the menu layout configuration
export const menuLayout = createMenuLayout<MenuBCount>({
  typeA: { index: 0 },
  typeB: { startIndex: 1, count: NUM_ITEMS_TYPE_B, indices: [1, 2, 3, 4, 5, 6, 7, 8] },
  typeC: { startIndex: 9 },
});

type FlowType = 'product' | 'repeat' | 'time';

export const FLOW_TYPE = {
  PRODUCT: 'product',
  REPEAT: 'repeat',
  TIME: 'time',
} as const;

export const TEST: PadTestProps = {
  id: '1',
  label: 'LABEL A',
  type: 'button',
  fieldKey: 'home',
  className: 'pad-rect',
  isChecked: false,
  disabled: false,
};

type FlowTypeValues = (typeof FLOW_TYPE)[keyof typeof FLOW_TYPE];

export const FLOW_CONFIG: Record<FlowTypeValues, PadTestProps> = {
  [FLOW_TYPE.PRODUCT]: {
    id: '1',
    label: 'LABEL A',
    type: 'button',
    fieldKey: 'home',
    className: 'pad-rect',
    isChecked: false,
    disabled: false,
  },
  [FLOW_TYPE.REPEAT]: {
    id: '2',
    label: 'LABEL B',
    type: 'button',
    fieldKey: 'home',
    className: 'pad-rect',
    isChecked: false,
    disabled: false,
  },
  [FLOW_TYPE.TIME]: {
    id: '3',
    label: 'LABEL C',
    type: 'button',
    fieldKey: 'home',
    className: 'pad-rect',
    isChecked: false,
    disabled: false,
  },
};
