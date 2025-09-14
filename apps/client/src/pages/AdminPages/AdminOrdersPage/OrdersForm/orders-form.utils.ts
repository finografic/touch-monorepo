import type React from 'react';
import { useCallback, useMemo } from 'react';
import { useGetDrinkSubtypes, useGetDrinkTypes } from 'queries/drink-types';
import { useGetDrinkVolumes } from 'queries/drink-volumes';
import { useGetContainerTypes } from 'queries/container-types';
import { useGetOrdersReadable } from 'queries/orders';
import { SelectOptionDto } from 'types/models/select-option.model';
import { OrderFieldKeys } from 'constants/app.config';
import { slugify } from 'utils/string.utils';
import { useGetModes } from 'queries/modes';
import type { ModeModel } from 'types/models/mode.model';

// ============================================================================
// Types
// ============================================================================

export interface TempItem {
  value: string;
  displayValue: string;
}

export interface TempItems {
  drinkTypes: TempItem[];
  drinkSubtypes: TempItem[];
  volumes: TempItem[];
  containerTypes: TempItem[];
}

export interface TimeRow {
  temperature?: number;
  timeA?: number;
  timeB?: number;
  timeC?: number;
}

// ============================================================================
// Constants
// ============================================================================

export const PROFILE_ITEM_VALUES_EMPTY: TimeRow = {
  temperature: undefined,
  timeA: undefined,
  timeB: undefined,
  timeC: undefined,
};

// ============================================================================
// Random Value Generation
// ============================================================================

const getRandomOptionValue = (options: { value: string }[]): string => {
  if (!options || options.length === 0) return '';
  const idx = Math.floor(Math.random() * options.length);
  return options[idx].value;
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
// Form Validation Helpers
// ============================================================================

export const isRowComplete = (row: TimeRow): boolean => {
  return (
    typeof row.temperature === 'number' &&
    typeof row.timeA === 'number' &&
    typeof row.timeB === 'number' &&
    typeof row.timeC === 'number'
  );
};

// ============================================================================
// Dropdown Data Hook
// ============================================================================

interface UseDropdownDataProps {
  language: string;
  tempItems: TempItems;
  selectedDrinkTypeId?: string;
  formDrinkType?: string;
}

export const useDropdownData = ({ language, tempItems, formDrinkType }: UseDropdownDataProps) => {
  // Data hooks
  const { data: modes = [] } = useGetModes();
  const { data: drinkTypes = [] } = useGetDrinkTypes();
  const { data: volumes = [] } = useGetDrinkVolumes();
  const { data: containerTypes = [] } = useGetContainerTypes();
  const { data: ordersData = [] } = useGetOrdersReadable();

  const modeOptions = modes.map((mode: ModeModel) => ({
    value: mode.id,
    label: mode.name,
  }));

  // Get selected drink type
  const selectedDrinkType = useMemo(() => {
    return drinkTypes.find((dt) => dt.name === formDrinkType);
  }, [drinkTypes, formDrinkType]);

  // Fetch subtypes for selected drink type
  const { data: subtypesData = [] } = useGetDrinkSubtypes({
    drinkTypeId: selectedDrinkType?.id || '',
    enabled: Boolean(selectedDrinkType?.id && selectedDrinkType.hasSubtypes),
  });

  // Transform data into dropdown options
  const drinkTypeOptions = useMemo(() => {
    const databaseOptions = SelectOptionDto.fromDrinkTypes(drinkTypes, language);
    const customOptions = tempItems.drinkTypes.map((item) => ({
      value: item.value,
      label: item.displayValue,
      category: 'Custom',
    }));
    return [...databaseOptions, ...customOptions];
  }, [drinkTypes, tempItems.drinkTypes, language]);

  const drinkSubtypeOptions = useMemo(() => {
    if (!selectedDrinkType?.hasSubtypes && !formDrinkType) return [];

    const databaseOptions = subtypesData.map((subtype) => ({
      value: subtype.name,
      label: subtype.translations[language] || subtype.name,
      category: 'Database',
    }));

    const customOptions = tempItems.drinkSubtypes.map((item) => ({
      value: item.value,
      label: item.displayValue,
      category: 'Custom',
    }));

    return [...databaseOptions, ...customOptions];
  }, [subtypesData, selectedDrinkType, tempItems.drinkSubtypes, language, formDrinkType]);

  const volumeOptions = useMemo(() => {
    const databaseOptions = SelectOptionDto.fromVolumes(volumes, language);
    const customOptions = tempItems.volumes.map((item) => ({
      value: item.value,
      label: item.displayValue,
      category: 'Custom',
    }));
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, OrderFieldKeys.drinkVolume);
    return [...databaseOptions, ...customOptions, ...ordersOptions];
  }, [volumes, tempItems.volumes, ordersData, language]);

  const containerTypeOptions = useMemo(() => {
    const databaseOptions = SelectOptionDto.fromContainerTypes(containerTypes, language);
    const customOptions = tempItems.containerTypes.map((item) => ({
      value: item.value,
      label: item.displayValue,
      category: 'Custom',
    }));
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, OrderFieldKeys.containerType);
    return [...databaseOptions, ...customOptions, ...ordersOptions];
  }, [containerTypes, tempItems.containerTypes, ordersData, language]);

  // Helper function to find mode ID by name
  const findModeIdByName = useCallback(
    (name: string): string | undefined => {
      const mode = modes.find((m) => m.name === name);
      return mode?.id;
    },
    [modes],
  );

  // Helper function to find mode name by ID
  const findModeNameById = useCallback(
    (id: string): string | undefined => {
      const mode = modes.find((m) => m.id === id);
      return mode?.name;
    },
    [modes],
  );

  // Helper function to find ID by name
  const findIdByName = useCallback(
    (
      items: any[],
      name: string,
      itemType: 'drinkType' | 'drinkSubtype' | 'volume' | 'containerType',
    ): string | undefined => {
      if (itemType === 'drinkSubtype') {
        // For subtypes, search in the subtypesData array
        const item = subtypesData.find((subtype) => subtype.name === name);
        return item?.id;
      }

      // For other types, search in the provided items array
      const item = items.find((item) => item.name === name);
      return item?.id;
    },
    [subtypesData],
  );

  return {
    // Raw data
    modes,
    drinkTypes,
    volumes,
    containerTypes,
    ordersData,
    subtypesData,
    selectedDrinkType,

    // Options for dropdowns
    modeOptions,
    drinkTypeOptions,
    drinkSubtypeOptions,
    volumeOptions,
    containerTypeOptions,

    // Helper functions
    findIdByName,
    findModeIdByName,
    findModeNameById,
  };
};

// ============================================================================
// Temp Item Handlers
// ============================================================================

export const createTempItemHandlers = (setTempItems: React.Dispatch<React.SetStateAction<TempItems>>) => {
  const handleAddNew = async (field: keyof TempItems, value: string): Promise<string> => {
    if (!value.trim()) return value;

    const displayValue = value.trim();
    const kebabValue = slugify(displayValue);

    setTempItems((prev) => ({
      ...prev,
      [field]: [...prev[field], { value: kebabValue, displayValue }],
    }));

    return kebabValue;
  };

  const handleAddSubtype = async (value: string, formDrinkType?: string): Promise<string> => {
    if (!value.trim() || !formDrinkType) return value;

    const displayValue = value.trim();
    const kebabValue = slugify(displayValue);

    setTempItems((prev) => ({
      ...prev,
      drinkSubtypes: [...prev.drinkSubtypes, { value: kebabValue, displayValue }],
    }));

    return kebabValue;
  };

  return {
    handleAddNew,
    handleAddSubtype,
  };
};

// ============================================================================
// Mock Data Generation
// ============================================================================

interface MockDataOptions {
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

export const createMockDataHandlers = ({
  drinkTypeOptions,
  volumeOptions,
  containerTypeOptions,
  setValue,
  defaultTempFreeze = -2,
  modeOptions,
}: MockDataOptions) => {
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
  }, [setValue, drinkTypeOptions, volumeOptions, containerTypeOptions]);

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
  }, [drinkTypeOptions, volumeOptions, containerTypeOptions]);

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
  }, [drinkTypeOptions, volumeOptions, containerTypeOptions]);

  return {
    generateRandomValuesForRow,
    handleMockValues,
    handleMockPartial,
    handleMockTwoRows,
  };
};
