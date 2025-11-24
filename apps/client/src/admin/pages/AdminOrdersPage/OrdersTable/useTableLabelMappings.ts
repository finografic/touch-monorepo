import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';
import { api } from 'api';

import { useGetContainerTypes } from 'queries/container-types';
import { GET_DRINK_SUBTYPES_QUERYKEY, useGetDrinkSubtypes, useGetDrinkTypes } from 'queries/drink-types';
import { useGetDrinkVolumes } from 'queries/drink-volumes';
import { useGetModes } from 'queries/modes';
import { useGetOrdersReadable } from 'queries/orders';

import type { ContainerType, DrinkSubtype, DrinkType, DrinkVolume } from 'types/models';
import { SelectOptionDto } from 'types/models/select-option.model';
import { ROUTE_FILTER_KEYS } from 'config/app';
import startCase from 'lodash/startCase';
import camelCase from 'lodash/camelCase';

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
      queryKey: [...GET_DRINK_SUBTYPES_QUERYKEY, dt.id],
      queryFn: async () => {
        interface SubtypesResponse {
          data?: DrinkSubtype[];
          success: boolean;
        }
        const response = await api.get<SubtypesResponse | DrinkSubtype[]>(`/drink-types/${dt.id}/subtypes`);

        if (response.status !== 200) {
          throw new Error('Failed to fetch drink subtypes');
        }

        // Axios: response.data is the parsed JSON body
        // Server returns array directly: response.data = [...]
        // Handle both structures for safety (though server returns array)
        if (Array.isArray(response.data)) {
          return response.data;
        }
        // Fallback: if wrapped in object { data: [...], success: true }
        return (response.data as SubtypesResponse)?.data || [];
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

  // Helper function to create database options from entities with translations
  const createDatabaseOptions = <T extends { name?: string; translations?: Record<string, string> }>(
    entities: T[],
    getValue: (entity: T) => string = (e) => e.name || '',
  ) => {
    return entities.map((entity) => {
      const translatedLabel = entity.translations?.[language] || entity.name || '';
      return {
        value: getValue(entity),
        label: translatedLabel,
        category: 'Database' as const,
      };
    });
  };

  // Helper function to merge database and orders options
  const mergeOptions = (
    databaseOptions: Array<{ value: string; label: string; category: 'Database' }>,
    ordersOptions: Array<{ value: string; label: string; category?: string }>,
    mergeLabels = false, // For subtypes: merge database labels into orders options
  ) => {
    if (mergeLabels) {
      // Create a map of Database labels by value for quick lookup
      const databaseLabelMap = new Map<string, string>();
      databaseOptions.forEach((opt) => {
        databaseLabelMap.set(opt.value, opt.label);
      });

      // Overwrite labels with Database labels when the value exists in Database
      const mergedOrdersOptions = ordersOptions.map((opt) => {
        const databaseLabel = databaseLabelMap.get(opt.value);
        return databaseLabel ? { ...opt, label: databaseLabel } : opt;
      });

      return [...databaseOptions, ...mergedOrdersOptions];
    }

    return [...databaseOptions, ...ordersOptions];
  };

  // Create options using the same logic as the form
  const drinkTypeOptions = useMemo(() => {
    const databaseOptions = createDatabaseOptions(drinkTypes);
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, ROUTE_FILTER_KEYS.drinkType);
    return mergeOptions(databaseOptions, ordersOptions);
  }, [drinkTypes, ordersData, language]);

  const drinkSubtypeOptions = useMemo(() => {
    const databaseOptions = createDatabaseOptions(allSubtypes);
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, ROUTE_FILTER_KEYS.drinkSubtype);
    return mergeOptions(databaseOptions, ordersOptions, true); // Merge labels for subtypes
  }, [allSubtypes, ordersData, language]);

  const volumeOptions = useMemo(() => {
    const databaseOptions = createDatabaseOptions(volumes);
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, ROUTE_FILTER_KEYS.drinkVolume);
    return mergeOptions(databaseOptions, ordersOptions);
  }, [volumes, ordersData, language]);

  const containerTypeOptions = useMemo(() => {
    const databaseOptions = createDatabaseOptions(containerTypes);
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, ROUTE_FILTER_KEYS.containerType);
    return mergeOptions(databaseOptions, ordersOptions);
  }, [containerTypes, ordersData, language]);

  const modeOptions = useMemo(() => {
    return modes.map((mode) => ({
      value: mode.id,
      label: String(mode.name),
    }));
  }, [modes]);

  // Helper function to create a Map from options with Database priority
  const createLabelMap = (
    options: Array<{ value: string; label: string; category?: string }>,
  ): Map<string, string> => {
    const map = new Map<string, string>();

    // Process database options first (they have translations and proper capitalization)
    options
      .filter((opt) => opt.category === 'Database')
      .forEach((opt) => {
        map.set(opt.value, opt.label);
      });

    // Then add other options only if they don't already exist (for custom values)
    options
      .filter((opt) => opt.category !== 'Database')
      .forEach((opt) => {
        if (!map.has(opt.value)) {
          map.set(opt.value, opt.label);
        }
      });

    return map;
  };

  // Helper function to create a Map from simple options (no category)
  const createSimpleLabelMap = (options: Array<{ value: string; label: string }>): Map<string, string> => {
    const map = new Map<string, string>();
    options.forEach((opt) => {
      map.set(opt.value, opt.label);
    });
    return map;
  };

  // Create value-to-label maps for fast lookup
  // Priority: Database options (with translations) > Orders options (raw values)
  // This ensures:
  // - Translated labels are used when available (e.g., "Rubia", "Tinto" with proper capitalization)
  // - Database labels take precedence over orders labels (which may be lowercase like "rubia", "tinto")
  // - Custom values from orders are still available if not in database
  const labelMappings = useMemo(() => {
    return {
      drinkType: createLabelMap(drinkTypeOptions),
      drinkSubtype: createLabelMap(drinkSubtypeOptions),
      volume: createLabelMap(volumeOptions),
      containerType: createLabelMap(containerTypeOptions),
      mode: createSimpleLabelMap(modeOptions),
    };
  }, [drinkTypeOptions, drinkSubtypeOptions, volumeOptions, containerTypeOptions, modeOptions]);

  // Helper functions to get labels (backward compatibility)
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

  // Dynamic labels object with field display names
  // Maps field names to their display labels (for headers, etc.)
  const labels = useMemo(() => {
    // Custom label mappings for fields (can be extended)
    const customLabels: Record<string, string> = {
      mode: labelMappings.mode.get('mode'),
      drinkType: labelMappings.drinkType.get('drinkType'),
      drinkSubtype: labelMappings.drinkSubtype.get('drinkSubtype'), // Note: "Subtype" not "Drink Subtype"
      volume: labelMappings.volume.get('volume'),
      containerType: labelMappings.containerType.get('containerType'), // Note: "Container" not "Container Type"
    };

    // Create labels object dynamically from labelMappings keys
    const fieldLabels: Record<string, string> = {};

    Object.keys(labelMappings).forEach((key) => {
      // Use custom label if available, otherwise convert camelCase to Title Case
      fieldLabels[key] = customLabels[key] || startCase(camelCase(key));
    });

    return fieldLabels;
  }, [labelMappings]);

  return {
    labelMappings,
    getLabel, // Backward compatibility
    labels, // New: object with field display names
  };
};
