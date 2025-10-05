import type { SlotItem } from 'types/orders.types';
import { SlotType } from 'types/orders.types';

export const MOCK_ORDERS_DATA: SlotItem[] = [
  {
    mode: {
      id: 'cmgbc4mnk0002r47nq3mron26',
      name: '3',
    },
    drinkType: {
      id: 'cmgbc4jhr0001h57ncoth90z6',
      name: 'vino',
      hasSubtypes: true,
      defaultTempConsume: 15,
    },
    drinkSubtype: {
      id: 'cmgbc4jht0009h57nvth8peba',
      name: 'tinto',
      defaultTempConsume: 15,
    },
    drinkVolume: {
      id: 'cmgbc4lv70004oq7nlce8la1r',
      name: '75cl',
    },
    containerType: {
      id: 'cmgbc4l0v0001m57n1osvrk3p',
      name: 'vidrio',
    },
    temperature: {
      defaultConsume: 5,
      defaultFreeze: -5,
      temperatureProfiles: [
        {
          id: 'ffd2fc36-3b02-46d8-8953-f910cc65bc1c',
          orderId: 'cmgbc4o8k003avt7n78bsu8lc',
          modeId: 'cmgbc4mnk0003r47ny5t1g4ao',
          temperature: 25,
          timeA: 60,
          timeB: 90,
          timeC: 120,
        },
        {
          id: '514deb34-60cc-4e4f-817d-ab8fdefc9e62',
          orderId: 'cmgbc4o8k003avt7n78bsu8lc',
          modeId: 'cmgbc4mnk0003r47ny5t1g4ao',
          temperature: 15,
          timeA: 90,
          timeB: 135,
          timeC: 180,
        },
        {
          id: '0696cb77-aa92-4f1f-8a7b-473bef9a9175',
          orderId: 'cmgbc4o8k003avt7n78bsu8lc',
          modeId: 'cmgbc4mnk0003r47ny5t1g4ao',
          temperature: 8,
          timeA: 120,
          timeB: 180,
          timeC: 240,
        },
        {
          id: '7399e4de-05a4-4c6c-aa93-4594fb95dce3',
          orderId: 'cmgbc4o8k003avt7n78bsu8lc',
          modeId: 'cmgbc4mnk0003r47ny5t1g4ao',
          temperature: 2,
          timeA: 150,
          timeB: 225,
          timeC: 300,
        },
      ],
      initial: 25,
      final: 5,
      closestInitialTemperature: 25,
      closestFinalTemperature: 8,
    },
  },
];
