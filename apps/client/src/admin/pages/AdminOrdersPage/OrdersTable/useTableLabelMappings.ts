import { useMemo } from 'react';

import { useGetContainerTypes } from 'queries/container-types';
import { useGetDrinkTypes } from 'queries/drink-types';
import { useGetDrinkVolumes } from 'queries/drink-volumes';
import { useGetModes } from 'queries/modes';
import { useGetOrdersReadable } from 'queries/orders';

import { SelectOptionDto } from 'types/models/select-option.model';
import { ROUTE_FILTER_KEYS } from 'config/app';

/**
 * Hook to generate value-to-label mappings for table display
 * Uses the same data sources as the form to ensure consistency
 */
export const useTableLabelMappings = (language: string = 'es-ES') => {
  // Data hooks - same as form
  const { data: modes = [] } = useGetModes();
  const { data: drinkTypes = [] } = useGetDrinkTypes();
  const { data: volumes = [] } = useGetDrinkVolumes();
  const { data: containerTypes = [] } = useGetContainerTypes();
  const { data: ordersData = [] } = useGetOrdersReadable();
  // Note: Subtypes are fetched per drink type, so we'll extract them from orders data
  // This matches the form's approach of using orders data for options

  // Create options using the same logic as the form
  const drinkTypeOptions = useMemo(() => {
    const databaseOptions = SelectOptionDto.fromDrinkTypes(drinkTypes, language);
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, ROUTE_FILTER_KEYS.drinkType);
    return [...databaseOptions, ...ordersOptions];
  }, [drinkTypes, ordersData, language]);

  const drinkSubtypeOptions = useMemo(() => {
    // Extract subtypes from orders data (matches form's approach)
    // This includes both database subtypes and custom ones added via the form
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, ROUTE_FILTER_KEYS.drinkSubtype);
    return ordersOptions;
  }, [ordersData]);

  const volumeOptions = useMemo(() => {
    const databaseOptions = SelectOptionDto.fromVolumes(volumes, language);
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, ROUTE_FILTER_KEYS.drinkVolume);
    return [...databaseOptions, ...ordersOptions];
  }, [volumes, ordersData, language]);

  const containerTypeOptions = useMemo(() => {
    const databaseOptions = SelectOptionDto.fromContainerTypes(containerTypes, language);
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, ROUTE_FILTER_KEYS.containerType);
    return [...databaseOptions, ...ordersOptions];
  }, [containerTypes, ordersData, language]);

  const modeOptions = useMemo(() => {
    return modes.map((mode) => ({
      value: mode.id,
      label: String(mode.name),
    }));
  }, [modes]);

  // Create value-to-label maps for fast lookup
  const labelMappings = useMemo(() => {
    const drinkTypeMap = new Map<string, string>();
    drinkTypeOptions.forEach((opt) => {
      drinkTypeMap.set(opt.value, opt.label);
    });

    const drinkSubtypeMap = new Map<string, string>();
    drinkSubtypeOptions.forEach((opt) => {
      drinkSubtypeMap.set(opt.value, opt.label);
    });

    const volumeMap = new Map<string, string>();
    volumeOptions.forEach((opt) => {
      volumeMap.set(opt.value, opt.label);
    });

    const containerTypeMap = new Map<string, string>();
    containerTypeOptions.forEach((opt) => {
      containerTypeMap.set(opt.value, opt.label);
    });

    const modeMap = new Map<string, string>();
    modeOptions.forEach((opt) => {
      modeMap.set(opt.value, opt.label);
    });

    return {
      drinkType: drinkTypeMap,
      drinkSubtype: drinkSubtypeMap,
      volume: volumeMap,
      containerType: containerTypeMap,
      mode: modeMap,
    };
  }, [drinkTypeOptions, drinkSubtypeOptions, volumeOptions, containerTypeOptions, modeOptions]);

  // Helper functions to get labels
  const getLabel = useMemo(
    () => ({
      drinkType: (value: string | null | undefined): string => {
        if (!value) return '-';
        return labelMappings.drinkType.get(value) || value;
      },
      drinkSubtype: (value: string | null | undefined): string => {
        if (!value) return '-';
        return labelMappings.drinkSubtype.get(value) || value;
      },
      volume: (value: string | null | undefined): string => {
        if (!value) return '-';
        return labelMappings.volume.get(value) || value;
      },
      containerType: (value: string | null | undefined): string => {
        if (!value) return '-';
        return labelMappings.containerType.get(value) || value;
      },
      mode: (value: string | null | undefined): string => {
        if (!value) return '-';
        return labelMappings.mode.get(value) || value;
      },
    }),
    [labelMappings],
  );

  return {
    labelMappings,
    getLabel,
  };
};
