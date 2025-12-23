import { useCallback } from 'react';

import type { TimeRow } from './orders-form.utils';
import { PROFILE_ITEM_VALUES_EMPTY } from './orders-form.utils';

// ============================================================================
// Types
// ============================================================================

export interface MockDataOptions {
  drinkTypeOptions: any[];
  volumeOptions: any[];
  containerTypeOptions: any[];
  setValue: any;
  defaultTempFreeze?: number;
  modeOptions: any[];
}

export interface MockDataHandlers {
  generateRandomValuesForRow: (rowIndex: number) => void;
  handleMockValues: () => void;
  handleMockPartial: () => any;
  handleMockTwoRows: () => any;
}

// ============================================================================
// Random Value Generation
// ============================================================================

const getRandomOptionValue = (options: { value: string }[]): string => {
  if (!options || options.length === 0) return '';
  const index = Math.floor(Math.random() * options.length);
  return options[index].value;
};

export const generateRandomTime = (): number => {
  const minTime = 30; // 30 seconds minimum
  const maxTime = 1800; // 30 minutes maximum
  const randomSeconds = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  // Round to nearest 30 seconds
  return Math.round(randomSeconds / 30) * 30;
};

export const generateRandomTemperature = (defaultTempFreeze: number): number => {
  // Random temperature between defaultTempFreeze and 50°C
  return Math.round((Math.random() * (50 - defaultTempFreeze) + defaultTempFreeze) * 2) / 2; // Round to 0.5
};

// ============================================================================
// Mock Data Generation
// ============================================================================

export const createMockDataHandlers = ({
  drinkTypeOptions,
  volumeOptions,
  containerTypeOptions,
  setValue,
  defaultTempFreeze = -2,
  modeOptions,
}: MockDataOptions): MockDataHandlers => {
  const generateRandomValuesForRow = useCallback(
    (rowIndex: number) => {
      const randomTemp = generateRandomTemperature(defaultTempFreeze);
      const randomTimeA = generateRandomTime();
      const randomTimeB = generateRandomTime();
      const randomTimeC = generateRandomTime();

      setValue(
        `timeRows.${rowIndex}`,
        {
          temperature: randomTemp,
          timeA: randomTimeA,
          timeB: randomTimeB,
          timeC: randomTimeC,
        },
        { shouldValidate: true },
      );
    },
    [setValue, defaultTempFreeze],
  );

  const handleMockValues = useCallback(() => {
    setValue('modeId', getRandomOptionValue(modeOptions), {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue('defaultTempConsume', 4, { shouldValidate: true, shouldDirty: true });
    setValue('defaultTempFreeze', -1, { shouldValidate: true, shouldDirty: true });

    if (drinkTypeOptions.length > 0) {
      const sampleDrinkType = drinkTypeOptions.find((opt) => opt.value === 'cerveza') || drinkTypeOptions[0];
      setValue('drinkType', sampleDrinkType.value, { shouldValidate: true, shouldDirty: true });
    }

    if (volumeOptions.length > 0) {
      const sampleVolume = volumeOptions.find((opt) => opt.value === '50cl') || volumeOptions[0];
      setValue('volume', sampleVolume.value, { shouldValidate: true, shouldDirty: true });
    }

    if (containerTypeOptions.length > 0) {
      const sampleContainer =
        containerTypeOptions.find((opt) => opt.value === 'vidrio') || containerTypeOptions[0];
      setValue('containerType', sampleContainer.value, { shouldValidate: true, shouldDirty: true });
    }

    const sampleRows = [
      { temperature: 25, timeA: 180, timeB: 240, timeC: 300 },
      { temperature: 15, timeA: 360, timeB: 480, timeC: 600 },
      { temperature: 8, timeA: 540, timeB: 720, timeC: 900 },
      { temperature: 2, timeA: 720, timeB: 960, timeC: 1200 },
    ];

    setValue('timeRows', sampleRows, { shouldValidate: true, shouldDirty: true });
  }, [setValue, drinkTypeOptions, volumeOptions, containerTypeOptions, modeOptions]);

  const handleMockPartial = useCallback(() => {
    const formValues = {
      modeId: getRandomOptionValue(modeOptions),
      defaultTempConsume: 4,
      defaultTempFreeze: -1,
      drinkType: '',
      volume: '',
      containerType: '',
      timeRows: Array.from({ length: 4 }, () => PROFILE_ITEM_VALUES_EMPTY),
    };

    if (drinkTypeOptions.length > 0) {
      formValues.drinkType = (
        drinkTypeOptions.find((opt) => opt.value === 'cerveza') || drinkTypeOptions[0]
      ).value;
    }

    if (volumeOptions.length > 0) {
      formValues.volume = (volumeOptions.find((opt) => opt.value === '50cl') || volumeOptions[0]).value;
    }

    if (containerTypeOptions.length > 0) {
      formValues.containerType = (
        containerTypeOptions.find((opt) => opt.value === 'vidrio') || containerTypeOptions[0]
      ).value;
    }

    return formValues;
  }, [drinkTypeOptions, volumeOptions, containerTypeOptions, modeOptions]);

  const handleMockTwoRows = useCallback(() => {
    const twoRows = Array.from({ length: 4 }, () => ({ ...PROFILE_ITEM_VALUES_EMPTY }));

    const completeRow1: TimeRow = { temperature: 25, timeA: 180, timeB: 240, timeC: 300 };
    const completeRow2: TimeRow = { temperature: 15, timeA: 360, timeB: 480, timeC: 600 };

    twoRows[0] = completeRow1;
    twoRows[1] = completeRow2;

    const formValues = {
      modeId: getRandomOptionValue(modeOptions),
      defaultTempConsume: 4,
      defaultTempFreeze: -1,
      drinkType:
        (drinkTypeOptions.find((opt) => opt.value === 'cerveza') || drinkTypeOptions[0])?.value || '',
      volume: (volumeOptions.find((opt) => opt.value === '50cl') || volumeOptions[0])?.value || '',
      containerType:
        (containerTypeOptions.find((opt) => opt.value === 'vidrio') || containerTypeOptions[0])?.value || '',
      timeRows: twoRows,
    };

    return formValues;
  }, [drinkTypeOptions, volumeOptions, containerTypeOptions, modeOptions]);

  return {
    generateRandomValuesForRow,
    handleMockValues,
    handleMockPartial,
    handleMockTwoRows,
  };
};
