import type React from 'react';
import { useCallback, useMemo } from 'react';

import { useGetContainerTypes } from 'queries/container-types';
import { useGetDrinkSubtypes, useGetDrinkTypes } from 'queries/drink-types';
import { useGetDrinkVolumes } from 'queries/drink-volumes';
import { useGetModes } from 'queries/modes';
import { useGetOrdersReadable } from 'queries/orders';

import { slugify } from 'utils/string.utils';
import type { ModeModel } from 'types/models/mode.model';
import { SelectOptionDto } from 'types/models/select-option.model';
import { ROUTE_FILTER_KEYS } from 'config/app';

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
    label: String(mode.name),
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
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, ROUTE_FILTER_KEYS.drinkVolume);
    return [...databaseOptions, ...customOptions, ...ordersOptions];
  }, [volumes, tempItems.volumes, ordersData, language]);

  const containerTypeOptions = useMemo(() => {
    const databaseOptions = SelectOptionDto.fromContainerTypes(containerTypes, language);
    const customOptions = tempItems.containerTypes.map((item) => ({
      value: item.value,
      label: item.displayValue,
      category: 'Custom',
    }));
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, ROUTE_FILTER_KEYS.containerType);
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
      slotType: 'drinkType' | 'drinkSubtype' | 'volume' | 'containerType',
    ): string | undefined => {
      if (slotType === 'drinkSubtype') {
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

export type UseDropdownDataReturn = ReturnType<typeof useDropdownData>;

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
