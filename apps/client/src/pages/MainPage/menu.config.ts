import { NUM_GRID_ITEMS } from 'constants/app.config';
import type { PadTestProps } from 'pages/MainPage/MainPage';
import type { PadUI } from 'types/ui.types';

// ======================================================================== //
// TODO: REMOVE  - UNUSED CODE !!

// Simple grid layout configuration
export const menuLayout = {
  mainGrid: Array.from({ length: NUM_GRID_ITEMS }, (_, i) => i),
  specialPad: NUM_GRID_ITEMS, // Special pad is always at NUM_GRID_ITEMS index
};

type FlowType = 'product' | 'repeat' | 'time';

export const FLOW_TYPE = {
  PRODUCT: 'product',
  REPEAT: 'repeat',
  TIME: 'time',
} as const;

export const FLOW_CONFIG: Record<FlowType, PadTestProps> = {
  [FLOW_TYPE.PRODUCT]: {
    id: '1',
    label: 'Programar Producto',
    type: 'button',
    fieldKey: 'main',
    className: 'pad-rect',
    isChecked: false,
    disabled: false,
  },
  [FLOW_TYPE.REPEAT]: {
    id: '2',
    label: 'Programar Selección',
    type: 'button',
    fieldKey: 'main',
    className: 'pad-rect',
    isChecked: false,
    disabled: false,
  },
  [FLOW_TYPE.TIME]: {
    id: '3',
    label: 'Programar Tiempo',
    type: 'button',
    fieldKey: 'main',
    className: 'pad-rect',
    isChecked: false,
    disabled: false,
  },
};
