import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';
import { api } from 'api';

import { useGetContainerTypes } from 'queries/container-types';
import { useGetDrinkTypes } from 'queries/drink-types';
import { useGetDrinkVolumes } from 'queries/drink-volumes';
import { useGetModes } from 'queries/modes';
import { useGetOrdersReadable } from 'queries/orders';

import type { ContainerType, DrinkSubtype, DrinkType, DrinkVolume } from 'types/models';
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

  // Fetch subtypes for all drink types that have subtypes
  const drinkTypesWithSubtypes = useMemo(() => drinkTypes.filter((dt) => dt.hasSubtypes), [drinkTypes]);

  const subtypeQueries = useQueries({
    queries: drinkTypesWithSubtypes.map((dt) => ({
      queryKey: ['get-drink-subtypes', dt.id],
      queryFn: async () => {
        interface SubtypesResponse {
          data?: DrinkSubtype[];
          success: boolean;
        }
        const response = await api.get<SubtypesResponse>(`/drink-types/${dt.id}/subtypes`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch drink subtypes');
        }
        // Match the structure from useGetDrinkSubtypes - response.data is the SubtypesResponse
        // and response.data.data is the DrinkSubtype[] array
        return response.data?.data || [];
      },
      enabled: Boolean(dt.id && dt.hasSubtypes),
    })),
  });

  // Combine all subtypes from all drink types
  const allSubtypes = useMemo(() => {
    return subtypeQueries
      .map((query) => query.data || [])
      .flat()
      .filter(Boolean) as DrinkSubtype[];
  }, [subtypeQueries]);

  // Create options using the same logic as the form
  // Note: DrinkType has id and name properties (camelCase version of DrinkTypeEntity)
  const drinkTypeOptions = useMemo(() => {
    const databaseOptions = drinkTypes.map((dt) => {
      const translatedLabel = dt.translations?.[language] || dt.name || '';
      return {
        value: dt.name || '',
        label: translatedLabel,
        category: 'Database',
      };
    });
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, ROUTE_FILTER_KEYS.drinkType);
    return [...databaseOptions, ...ordersOptions];
  }, [drinkTypes, ordersData, language]);

  const drinkSubtypeOptions = useMemo(() => {
    // Map database subtypes with translations
    const databaseOptions = allSubtypes.map((subtype) => {
      const translatedLabel = subtype.translations?.[language] || subtype.name || '';
      return {
        value: subtype.name || '',
        label: translatedLabel,
        category: 'Database' as const,
      };
    });
    // Extract custom subtypes from orders data (for values not in database)
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, ROUTE_FILTER_KEYS.drinkSubtype);
    return [...databaseOptions, ...ordersOptions];
  }, [allSubtypes, ordersData, language]);

  const volumeOptions = useMemo(() => {
    // DrinkVolume has id and name properties (camelCase version of VolumeEntity)
    const databaseOptions = volumes.map((v) => {
      const translatedLabel = v.translations?.[language] || v.name || '';
      return {
        value: v.name || '',
        label: translatedLabel,
        category: 'Database',
      };
    });
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, ROUTE_FILTER_KEYS.drinkVolume);
    return [...databaseOptions, ...ordersOptions];
  }, [volumes, ordersData, language]);

  const containerTypeOptions = useMemo(() => {
    // ContainerType has id and name properties (camelCase version of ContainerTypeEntity)
    const databaseOptions = containerTypes.map((ct) => {
      const translatedLabel = ct.translations?.[language] || ct.name || '';
      return {
        value: ct.name || '',
        label: translatedLabel,
        category: 'Database',
      };
    });
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
  // Priority: Database options (with translations) > Orders options (raw values)
  // This ensures translated labels are used when available
  const labelMappings = useMemo(() => {
    const drinkTypeMap = new Map<string, string>();
    // Process database options first (they have translations)
    drinkTypeOptions
      .filter((opt) => opt.category === 'Database')
      .forEach((opt) => {
        drinkTypeMap.set(opt.value, opt.label);
      });
    // Then add orders options only if they don't already exist (for custom values)
    drinkTypeOptions
      .filter((opt) => opt.category !== 'Database')
      .forEach((opt) => {
        if (!drinkTypeMap.has(opt.value)) {
          drinkTypeMap.set(opt.value, opt.label);
        }
      });

    const drinkSubtypeMap = new Map<string, string>();
    drinkSubtypeOptions
      .filter((opt) => opt.category === 'Database')
      .forEach((opt) => {
        drinkSubtypeMap.set(opt.value, opt.label);
      });
    drinkSubtypeOptions
      .filter((opt) => opt.category !== 'Database')
      .forEach((opt) => {
        if (!drinkSubtypeMap.has(opt.value)) {
          drinkSubtypeMap.set(opt.value, opt.label);
        }
      });

    const volumeMap = new Map<string, string>();
    volumeOptions
      .filter((opt) => opt.category === 'Database')
      .forEach((opt) => {
        volumeMap.set(opt.value, opt.label);
      });
    volumeOptions
      .filter((opt) => opt.category !== 'Database')
      .forEach((opt) => {
        if (!volumeMap.has(opt.value)) {
          volumeMap.set(opt.value, opt.label);
        }
      });

    const containerTypeMap = new Map<string, string>();
    containerTypeOptions
      .filter((opt) => opt.category === 'Database')
      .forEach((opt) => {
        containerTypeMap.set(opt.value, opt.label);
      });
    containerTypeOptions
      .filter((opt) => opt.category !== 'Database')
      .forEach((opt) => {
        if (!containerTypeMap.has(opt.value)) {
          containerTypeMap.set(opt.value, opt.label);
        }
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
