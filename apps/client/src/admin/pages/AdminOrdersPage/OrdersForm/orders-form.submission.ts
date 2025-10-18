import type { UseMutationResult } from '@tanstack/react-query';

import { useCreateContainerType } from 'queries/container-types/useCreateContainerType';
import { useCreateDrinkSubtype } from 'queries/drink-types/useCreateDrinkSubtype';
import { useCreateDrinkType } from 'queries/drink-types/useCreateDrinkType';
import { useUpdateDrinkType } from 'queries/drink-types/useUpdateDrinkType';
import { useCreateVolume } from 'queries/drink-volumes/useCreateVolume';
import { useCreateOrder } from 'queries/orders/useCreateOrder';
import { useUpdateOrder } from 'queries/orders/useUpdateOrder';
import { useUpdateTemperatureProfiles } from 'queries/orders/useUpdateTemperatureProfiles';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { TempItems, TimeRow } from './orders-form.utils';
import type { OrdersFormValues } from './OrdersForm.schema';

// ============================================================================
// Types
// ============================================================================

interface SubmissionDependencies {
  // Data arrays for ID lookups
  drinkTypes: any[];
  volumes: any[];
  containerTypes: any[];

  // Temp items
  tempItems: TempItems;

  // Helper functions
  findIdByName: (
    items: any[],
    name: string,
    slotType: 'drinkType' | 'drinkSubtype' | 'volume' | 'containerType',
  ) => string | undefined;

  // Order data for edit mode
  orderData?: OrderReadableModel;
  isEditMode: boolean;

  // Callbacks
  onSubmit: (data: OrdersFormValues) => void;
  resetForm?: () => void;
  setTempItems?: (items: TempItems) => void;
}

// ============================================================================
// Mutation Hooks Provider
// ============================================================================

export const useFormSubmissionMutations = () => {
  return {
    // Order mutations
    updateOrder: useUpdateOrder(),
    updateTemperatureProfiles: useUpdateTemperatureProfiles(),
    createOrder: useCreateOrder(),

    // Entity creation mutations
    createDrinkType: useCreateDrinkType(),
    createDrinkSubtype: useCreateDrinkSubtype(),
    createVolume: useCreateVolume(),
    createContainerType: useCreateContainerType(),

    // Entity update mutations
    updateDrinkType: useUpdateDrinkType(),
  };
};

// ============================================================================
// Update Order Logic
// ============================================================================

interface UpdateOrderDependencies {
  updateOrder: any;
  updateTemperatureProfiles: any;
  findIdByName: (
    items: any[],
    name: string,
    slotType: 'drinkType' | 'drinkSubtype' | 'volume' | 'containerType',
  ) => string | undefined;
  drinkTypes: any[];
  volumes: any[];
  containerTypes: any[];
  onSubmit: (data: OrdersFormValues) => void;
}

const handleUpdateOrder = async (
  data: OrdersFormValues,
  orderData: OrderReadableModel,
  deps: UpdateOrderDependencies,
) => {
  const {
    updateOrder,
    updateTemperatureProfiles,
    findIdByName,
    drinkTypes,
    volumes,
    containerTypes,
    onSubmit,
  } = deps;

  try {
    // Convert form values to IDs for API
    const orderUpdates = {
      modeId: data.modeId,
      drinkTypeId: findIdByName(drinkTypes, data.drinkType, 'drinkType'),
      drinkSubtypeId: data.drinkSubtype ? findIdByName([], data.drinkSubtype, 'drinkSubtype') : null,
      volumeId: findIdByName(volumes, data.volume, 'volume'),
      containerTypeId: findIdByName(containerTypes, data.containerType, 'containerType'),
      defaultTempConsume: data.defaultTempConsume,
      defaultTempFreeze: data.defaultTempFreeze,
    };

    // Only include fields that have actually changed
    const changedUpdates = Object.entries(orderUpdates).reduce(
      (acc, [key, value]) => {
        const currentValue = orderData[key as keyof typeof orderData];
        if (currentValue !== value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    console.log('Current order data:', orderData);
    console.log('Updating order with:', changedUpdates);

    // Update the order if we have changes
    if (Object.keys(changedUpdates).length > 0) {
      await updateOrder.mutateAsync({
        id: orderData.id,
        updates: changedUpdates,
      });
    }

    // Update temperature profiles if they exist and have valid data
    const validTimeRows = data.timeRows.filter(
      (row) =>
        row.temperature !== undefined &&
        row.timeA !== undefined &&
        row.timeB !== undefined &&
        row.timeC !== undefined,
    );

    if (validTimeRows.length > 0 || (orderData?.temperatureProfiles?.length ?? 0) > 0) {
      const profileUpdates = validTimeRows.map((row, index) => {
        const existingProfile = orderData.temperatureProfiles?.[index];

        return {
          id: existingProfile?.id,
          temperature: row.temperature!,
          timeA: row.timeA!,
          timeB: row.timeB!,
          timeC: row.timeC!,
          modeId: data.modeId,
        };
      });

      console.log('Updating temperature profiles with:', profileUpdates);
      console.log('Existing profiles:', orderData.temperatureProfiles);

      await updateTemperatureProfiles.mutateAsync({
        orderId: orderData.id,
        profiles: profileUpdates,
        existingProfiles: orderData.temperatureProfiles || [],
      });
    }

    onSubmit(data);
  } catch (error) {
    console.error('Failed to update order:', error);
    throw error;
  }
};

// ============================================================================
// Create Order Logic
// ============================================================================

interface CreateOrderDependencies {
  createOrder: any;
  createDrinkType: any;
  createDrinkSubtype: any;
  createVolume: any;
  createContainerType: any;
  updateDrinkType: any;
  tempItems: TempItems;
  findIdByName: (
    items: any[],
    name: string,
    slotType: 'drinkType' | 'drinkSubtype' | 'volume' | 'containerType',
  ) => string | undefined;
  drinkTypes: any[];
  volumes: any[];
  containerTypes: any[];
  onSubmit: (data: OrdersFormValues) => void;
  resetForm?: () => void;
  setTempItems?: (items: TempItems) => void;
}

const handleCreateOrder = async (data: OrdersFormValues, deps: CreateOrderDependencies) => {
  const {
    createOrder,
    createDrinkType,
    createDrinkSubtype,
    createVolume,
    createContainerType,
    updateDrinkType,
    tempItems,
    findIdByName,
    drinkTypes,
    volumes,
    containerTypes,
    onSubmit,
    resetForm,
    setTempItems,
  } = deps;

  try {
    // Create any new entities first
    const createdIds: Record<string, string> = {};

    // Create new drink type if needed
    const drinkTypeTemp = tempItems.drinkTypes.find((item) => item.value === data.drinkType);
    if (drinkTypeTemp) {
      const drinkTypeResponse = await createDrinkType.mutateAsync({
        name: drinkTypeTemp.displayValue,
        hasSubtypes: Boolean(data.drinkSubtype),
        defaultTempConsume: data.defaultTempConsume,
        defaultTempFreeze: data.defaultTempFreeze,
      });
      createdIds.drinkTypeId = drinkTypeResponse.id;
    }

    // Create new subtype if needed
    const drinkSubtypeTemp = tempItems.drinkSubtypes.find((item) => item.value === data.drinkSubtype);
    if (drinkSubtypeTemp && data.drinkSubtype) {
      const drinkTypeId = createdIds.drinkTypeId || findIdByName(drinkTypes, data.drinkType, 'drinkType');

      if (!drinkTypeId) {
        throw new Error('Cannot create subtype: missing drinkTypeId');
      }

      // Check if the parent drink type has hasSubtypes set to true
      const existingDrinkType = drinkTypes.find((dt) => dt.id === drinkTypeId);
      if (existingDrinkType && !existingDrinkType.hasSubtypes) {
        console.log('Updating parent drink type to allow subtypes:', drinkTypeId);
        await updateDrinkType.mutateAsync({
          id: drinkTypeId,
          updates: { hasSubtypes: true },
        });
      }

      const drinkSubtypeResponse = await createDrinkSubtype.mutateAsync({
        name: drinkSubtypeTemp.displayValue,
        drinkTypeId,
        defaultTempConsume: data.defaultTempConsume,
        defaultTempFreeze: data.defaultTempFreeze,
      });
      createdIds.drinkSubtypeId = drinkSubtypeResponse.id;
    }

    // Create new volume if needed
    const volumeTemp = tempItems.volumes.find((item) => item.value === data.volume);
    if (volumeTemp) {
      const volumeResponse = await createVolume.mutateAsync({
        name: volumeTemp.displayValue,
        valueInMl: 500,
        sortOrder: volumes.length + 1,
      });
      createdIds.volumeId = volumeResponse.id;
    }

    // Create new container type if needed
    const containerTypeTemp = tempItems.containerTypes.find((item) => item.value === data.containerType);
    if (containerTypeTemp) {
      const containerTypeResponse = await createContainerType.mutateAsync({
        name: containerTypeTemp.displayValue,
        thermalConductivity: 50,
      });
      createdIds.containerTypeId = containerTypeResponse.id;
    }

    // Get existing IDs for non-temp items
    const existingDrinkTypeId = !createdIds.drinkTypeId
      ? findIdByName(drinkTypes, data.drinkType, 'drinkType')
      : undefined;
    const existingDrinkSubtypeId =
      !createdIds.drinkSubtypeId && data.drinkSubtype
        ? findIdByName([], data.drinkSubtype, 'drinkSubtype')
        : undefined;
    const existingVolumeId = !createdIds.volumeId ? findIdByName(volumes, data.volume, 'volume') : undefined;
    const existingContainerTypeId = !createdIds.containerTypeId
      ? findIdByName(containerTypes, data.containerType, 'containerType')
      : undefined;

    // Get final IDs, ensuring required fields are not undefined
    const finalDrinkTypeId = createdIds.drinkTypeId || existingDrinkTypeId;
    const finalVolumeId = createdIds.volumeId || existingVolumeId;
    const finalContainerTypeId = createdIds.containerTypeId || existingContainerTypeId;

    // Validate required fields
    if (!finalDrinkTypeId || !finalVolumeId || !finalContainerTypeId) {
      throw new Error('Missing required field IDs. Cannot create order.');
    }

    // Create the order
    const orderData = {
      modeId: data.modeId,
      drinkTypeId: finalDrinkTypeId,
      drinkSubtypeId: createdIds.drinkSubtypeId || existingDrinkSubtypeId || undefined,
      volumeId: finalVolumeId,
      containerTypeId: finalContainerTypeId,
      defaultTempConsume: data.defaultTempConsume,
      defaultTempFreeze: data.defaultTempFreeze,
    };

    console.log('Creating order with:', orderData);

    // Prepare temperature profiles
    const validTimeRows = data.timeRows.filter(
      (row) =>
        row.temperature !== undefined &&
        row.timeA !== undefined &&
        row.timeB !== undefined &&
        row.timeC !== undefined,
    );

    const temperatureProfiles = validTimeRows.map((row) => ({
      temperature: row.temperature!,
      timeA: row.timeA!,
      timeB: row.timeB!,
      timeC: row.timeC!,
      modeId: data.modeId,
    }));

    console.log('Creating order with temperature profiles:', temperatureProfiles);

    // Create the order with temperature profiles
    await createOrder.mutateAsync({
      orderData,
      temperatureProfiles,
    });

    onSubmit(data);

    // Reset form and temp items
    if (resetForm) resetForm();
    if (setTempItems) {
      setTempItems({
        drinkTypes: [],
        drinkSubtypes: [],
        volumes: [],
        containerTypes: [],
      });
    }
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
};

// ============================================================================
// Form Submission Handler
// ============================================================================

export const createFormSubmissionHandler = (
  mutations: ReturnType<typeof useFormSubmissionMutations>,
  dependencies: SubmissionDependencies,
) => {
  const {
    drinkTypes,
    volumes,
    containerTypes,
    tempItems,
    findIdByName,
    orderData,
    isEditMode,
    onSubmit,
    resetForm,
    setTempItems,
  } = dependencies;

  const {
    updateOrder,
    updateTemperatureProfiles,
    createOrder,
    createDrinkType,
    createDrinkSubtype,
    createVolume,
    createContainerType,
    updateDrinkType,
  } = mutations;

  const handleFormSubmission = async (data: OrdersFormValues) => {
    if (isEditMode && orderData?.id) {
      await handleUpdateOrder(data, orderData, {
        updateOrder,
        updateTemperatureProfiles,
        findIdByName,
        drinkTypes,
        volumes,
        containerTypes,
        onSubmit,
      });
    } else {
      await handleCreateOrder(data, {
        createOrder,
        createDrinkType,
        createDrinkSubtype,
        createVolume,
        createContainerType,
        updateDrinkType,
        tempItems,
        findIdByName,
        drinkTypes,
        volumes,
        containerTypes,
        onSubmit,
        resetForm,
        setTempItems,
      });
    }
  };

  return handleFormSubmission;
};

// ============================================================================
// Loading State Helper
// ============================================================================

export const getSubmissionLoadingState = (
  mutations: ReturnType<typeof useFormSubmissionMutations>,
): boolean => {
  return (
    mutations.updateOrder.isPending ||
    mutations.updateTemperatureProfiles.isPending ||
    mutations.createOrder.isPending ||
    mutations.updateDrinkType.isPending
  );
};
