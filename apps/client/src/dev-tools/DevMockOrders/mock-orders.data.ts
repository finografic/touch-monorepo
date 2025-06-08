import type { OrderItem } from 'types/orders.types';

export const MOCK_ORDERS_DATA: OrderItem[] = [
  {
    itemType: 'A',
    itemNumber: 0,
    isSelected: true,
    isLocked: false,
    filters: {
      drinkType: {
        id: 'cmbcrkatw0001k5lwfoklln89',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkTypeName: 'vino' },
      },
      drinkSubtype: {
        id: 'cmbcrkatz000ak5lwqlsf7ycq',
        name: 'blanco',
        defaultTempConsume: 12,
        lookup: { drinkSubtypeName: 'blanco' },
      },
      drinkVolume: {
        id: 'cmbcrkcst0005nflwsaxp1ykn',
        name: '50cl',
        lookup: { volumeName: '50cl' },
      },
      containerType: {
        id: 'cmbcrkc4x0002melw7smoy5ec',
        name: 'metal',
        lookup: { containerTypeName: 'metal' },
      },
    },
    processStatus: { isProcessing: false },
  },
  {
    itemType: 'B',
    itemNumber: 1,
    isSelected: true,
    isLocked: false,
    filters: {
      drinkType: {
        id: 'cmbcrkatw0001k5lwfoklln89',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkTypeName: 'vino' },
      },
      drinkSubtype: {
        id: 'cmbcrkatz000ak5lwqlsf7ycq',
        name: 'blanco',
        defaultTempConsume: 12,
        lookup: { drinkSubtypeName: 'blanco' },
      },
      drinkVolume: {
        id: 'cmbcrkcst0005nflwsaxp1ykn',
        name: '50cl',
        lookup: { volumeName: '50cl' },
      },
      containerType: {
        id: 'cmbcrkc4x0002melw7smoy5ec',
        name: 'metal',
        lookup: { containerTypeName: 'metal' },
      },
    },
    processStatus: { isProcessing: false },
  },
  {
    itemType: 'C',
    itemNumber: 9,
    isSelected: true,
    isLocked: false,
    filters: {
      drinkType: {
        id: 'cmbcrkatw0001k5lwfoklln89',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkTypeName: 'vino' },
      },
      drinkSubtype: {
        id: 'cmbcrkatz000ak5lwqlsf7ycq',
        name: 'blanco',
        defaultTempConsume: 12,
        lookup: { drinkSubtypeName: 'blanco' },
      },
      drinkVolume: {
        id: 'cmbcrkcst0005nflwsaxp1ykn',
        name: '50cl',
        lookup: { volumeName: '50cl' },
      },
      containerType: {
        id: 'cmbcrkc4x0002melw7smoy5ec',
        name: 'metal',
        lookup: { containerTypeName: 'metal' },
      },
    },
    processStatus: { isProcessing: false },
  },
];
