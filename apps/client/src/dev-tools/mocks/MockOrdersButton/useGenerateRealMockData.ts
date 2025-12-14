import { useMemo } from 'react';

import { useOrders } from 'providers/OrdersProvider';
import { useGetModes } from 'queries/modes';
import { useGetDrinkTypes, useGetDrinkSubtypes } from 'queries/drink-types';
import { useGetDrinkVolumes } from 'queries/drink-volumes';
import { useGetContainerTypes } from 'queries/container-types';

import { filterData } from 'utils/filters/filters.utils';
import { ROUTE_FILTER_KEYS } from 'config/app/app.config';
import { MOCK_ORDERS_DATA } from './mock-orders.data';
import type { OrderFilters } from 'types/filters.types';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { FilterKey } from 'types/slots.types';

/**
 * Hook that generates real mock data by:
 * 1. Using MOCK_ORDERS_DATA as a template (with name values)
 * 2. Looking up actual IDs from database by matching names
 * 3. Following the filtering flow - applying filters sequentially
 * 4. Each filter reduces the available pool, just like a real user flow
 *
 * @returns Real OrderFilters with actual database IDs, or null if data not ready
 */
export const useGenerateRealMockData = (): OrderFilters | null => {
  const { ordersReadable } = useOrders();
  const { data: modes = [] } = useGetModes();
  const { data: drinkTypes = [] } = useGetDrinkTypes();
  const { data: volumes = [] } = useGetDrinkVolumes();
  const { data: containerTypes = [] } = useGetContainerTypes();

  // Get drinkTypeId from MOCK_ORDERS_DATA to fetch subtypes if needed
  const mockDrinkType = drinkTypes.find((dt) => dt.name === MOCK_ORDERS_DATA.drinkType?.name);
  const { data: drinkSubtypes = [] } = useGetDrinkSubtypes({
    drinkTypeId: mockDrinkType?.id || '',
    enabled: Boolean(mockDrinkType?.id && mockDrinkType.hasSubtypes),
  });

  const realMockData = useMemo(() => {
    // Early return if data not ready
    if (!ordersReadable || ordersReadable.length === 0) {
      return null;
    }

    if (modes.length === 0 || drinkTypes.length === 0 || volumes.length === 0 || containerTypes.length === 0) {
      return null;
    }

    // Start with full ordersReadable pool
    let currentPool: OrderReadableModel[] = ordersReadable;
    const result: Partial<OrderFilters> = {};

    // ======================================================================== //
    // 1. MODE FILTER
    // ======================================================================== //

    if (MOCK_ORDERS_DATA.mode?.name) {
      // Find unique modes in current pool
      const uniqueModes = Array.from(new Set(currentPool.map((order) => order.mode).filter(Boolean)));

      // Find matching mode by name
      const matchingModeName = uniqueModes.find((modeName) => modeName === MOCK_ORDERS_DATA.mode!.name);

      if (matchingModeName) {
        // Find the mode entity to get ID
        const modeEntity = modes.find((m) => m.name === matchingModeName);
        if (modeEntity) {
          result.mode = {
            id: modeEntity.id,
            name: modeEntity.name,
          };

          // Apply mode filter to reduce pool
          const { dataPool } = filterData({
            data: currentPool,
            filters: { mode: result.mode },
            filterKey: ROUTE_FILTER_KEYS.drinkType as FilterKey,
            applyContainerTypeFix: false,
          });
          currentPool = dataPool;
        }
      }
    }

    // ======================================================================== //
    // 2. DRINK TYPE FILTER
    // ======================================================================== //

    if (MOCK_ORDERS_DATA.drinkType?.name && currentPool.length > 0) {
      // Find unique drink types in current pool
      const uniqueDrinkTypes = Array.from(
        new Set(currentPool.map((order) => order.drinkType).filter(Boolean)),
      );

      // Find matching drink type by name
      const matchingDrinkTypeName = uniqueDrinkTypes.find(
        (dtName) => dtName === MOCK_ORDERS_DATA.drinkType!.name,
      );

      if (matchingDrinkTypeName) {
        // Find the drink type entity to get ID and properties
        const drinkTypeEntity = drinkTypes.find((dt) => dt.name === matchingDrinkTypeName);
        if (drinkTypeEntity) {
          result.drinkType = {
            id: drinkTypeEntity.id,
            name: drinkTypeEntity.name,
            hasSubtypes: drinkTypeEntity.hasSubtypes,
            defaultTempConsume: drinkTypeEntity.defaultTempConsume,
            defaultTempFreeze: drinkTypeEntity.defaultTempFreeze,
          };

          // Apply drink type filter to reduce pool
          const { dataPool } = filterData({
            data: currentPool,
            filters: { ...result, drinkType: result.drinkType },
            filterKey: ROUTE_FILTER_KEYS.drinkSubtype as FilterKey,
            applyContainerTypeFix: false,
          });
          currentPool = dataPool;
        }
      }
    }

    // ======================================================================== //
    // 3. DRINK SUBTYPE FILTER (only if drink type has subtypes)
    // ======================================================================== //

    if (
      MOCK_ORDERS_DATA.drinkSubtype?.name &&
      result.drinkType?.hasSubtypes &&
      result.drinkType?.id &&
      currentPool.length > 0
    ) {
      // Get subtypes for this drink type
      // Note: We can't use the hook here, so we'll need to filter from orders_readable
      // The subtype name in orders_readable might be in format "drinkType--subtype"
      const uniqueSubtypes = Array.from(
        new Set(currentPool.map((order) => order.drinkSubtype).filter(Boolean) as string[]),
      );

      // Extract subtype name (remove drinkType prefix if present)
      const targetSubtypeName = MOCK_ORDERS_DATA.drinkSubtype.name.includes('--')
        ? MOCK_ORDERS_DATA.drinkSubtype.name.split('--')[1]
        : MOCK_ORDERS_DATA.drinkSubtype.name;

      // Find matching subtype
      const matchingSubtypeName = uniqueSubtypes.find((stName) => {
        const cleanName = stName.includes('--') ? stName.split('--')[1] : stName;
        return cleanName === targetSubtypeName;
      });

      if (matchingSubtypeName) {
        // Find the subtype entity to get ID and properties
        // Subtypes are stored with name like "drinkType--subtype" or just "subtype"
        const subtypeEntity = drinkSubtypes.find((st) => {
          // Match by the clean name (after --) or full name
          const cleanSubtypeName = st.name.includes('--') ? st.name.split('--')[1] : st.name;
          return cleanSubtypeName === targetSubtypeName || st.name === matchingSubtypeName;
        });

        if (subtypeEntity) {
          result.drinkSubtype = {
            id: subtypeEntity.id,
            name: subtypeEntity.name,
            defaultTempConsume: subtypeEntity.defaultTempConsume ?? MOCK_ORDERS_DATA.drinkSubtype.defaultTempConsume,
            defaultTempFreeze: subtypeEntity.defaultTempFreeze ?? MOCK_ORDERS_DATA.drinkSubtype.defaultTempFreeze,
          };

          // Apply subtype filter to reduce pool
          const { dataPool } = filterData({
            data: currentPool,
            filters: { ...result, drinkSubtype: result.drinkSubtype },
            filterKey: ROUTE_FILTER_KEYS.drinkVolume as FilterKey,
            applyContainerTypeFix: false,
          });
          currentPool = dataPool;
        }
      }
    }

    // ======================================================================== //
    // 4. VOLUME FILTER
    // ======================================================================== //

    if (MOCK_ORDERS_DATA.drinkVolume?.name && currentPool.length > 0) {
      // Find unique volumes in current pool
      const uniqueVolumes = Array.from(new Set(currentPool.map((order) => order.volume).filter(Boolean)));

      // Find matching volume by name
      const matchingVolumeName = uniqueVolumes.find((vName) => vName === MOCK_ORDERS_DATA.drinkVolume!.name);

      if (matchingVolumeName) {
        // Find the volume entity to get ID
        const volumeEntity = volumes.find((v) => v.name === matchingVolumeName);
        if (volumeEntity) {
          result.drinkVolume = {
            id: volumeEntity.id,
            name: volumeEntity.name,
          };

          // Apply volume filter to reduce pool
          const { dataPool } = filterData({
            data: currentPool,
            filters: { ...result, drinkVolume: result.drinkVolume },
            filterKey: ROUTE_FILTER_KEYS.containerType as FilterKey,
            applyContainerTypeFix: false,
          });
          currentPool = dataPool;
        }
      }
    }

    // ======================================================================== //
    // 5. CONTAINER TYPE FILTER
    // ======================================================================== //

    if (MOCK_ORDERS_DATA.containerType?.name && currentPool.length > 0) {
      // Find unique container types in current pool
      const uniqueContainerTypes = Array.from(
        new Set(currentPool.map((order) => order.containerType).filter(Boolean)),
      );

      // Find matching container type by name
      const matchingContainerTypeName = uniqueContainerTypes.find(
        (ctName) => ctName === MOCK_ORDERS_DATA.containerType!.name,
      );

      if (matchingContainerTypeName) {
        // Find the container type entity to get ID
        const containerTypeEntity = containerTypes.find((ct) => ct.name === matchingContainerTypeName);
        if (containerTypeEntity) {
          result.containerType = {
            id: containerTypeEntity.id,
            name: containerTypeEntity.name,
          };
        }
      }
    }

    // Return result if we have at least mode and drinkType (minimum required)
    if (result.mode && result.drinkType) {
      return result as OrderFilters;
    }

    return null;
  }, [ordersReadable, modes, drinkTypes, drinkSubtypes, volumes, containerTypes]);

  return realMockData;
};

