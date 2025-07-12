import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from 'components/Button';
import { SelectSearchable } from 'forms/SelectSearchable/SelectSearchable';
import { SelectSimple } from 'forms/SelectSimple';
import { InputTemperature } from 'forms/InputTemperature';
import { FormMiddlewareProvider, useFormMiddleware } from 'forms/FormMiddleware';
import { FieldWrapper } from 'forms/FieldWrapper';
import { TimesRepeaterTable } from 'pages/AdminPages/AdminOrdersPage/TimesRepeaterTable';
import { MIN_TABLE_ROWS, MIN_TABLE_VISIBLE_ROWS } from 'forms/FormMiddleware/FormMiddleware.constants';
import {
  useCreateDrinkSubtype,
  useCreateDrinkType,
  useGetDrinkTypes,
  useUpdateDrinkType,
} from 'queries/drink-types';
import { useCreateVolume, useGetDrinkVolumes } from 'queries/drink-volumes';
import { useCreateContainerType, useGetContainerTypes } from 'queries/container-types';
import {
  useCreateOrder,
  useGetOrdersReadable,
  useUpdateOrder,
  useUpdateTemperatureProfiles,
} from 'queries/orders';
import { useGetDrinkSubtypes } from 'queries/drink-types/useGetDrinkSubtypes'; // Updated import
import { SelectOptionDto } from 'types/models/select-option.model';
import { MIN_TEMP_DIFFERENCE } from 'constants/temperature.config';
import {
  type OrdersFormValues as MiddlewareOrdersFormValues,
  ordersFormFieldConfigs,
} from 'forms/FormMiddleware/OrdersFormFieldConfigs';
import { Col, Row } from 'react-grid-system';
import { OrderFieldKeys } from 'constants/app.config';
import { useDev } from 'providers/DevProvider';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import { slugify } from 'utils/string.utils';
import { useContent } from 'providers/ContentProvider/ContentContext';

// Define the type for a row to match the schema
interface TimeRow {
  temperature?: number;
  timeA?: number;
  timeB?: number;
  timeC?: number;
}

const PROFILE_ITEM_VALUES_EMPTY: TimeRow = {
  temperature: undefined,
  timeA: undefined,
  timeB: undefined,
  timeC: undefined,
};

// Utility functions for generating random values
const generateRandomTime = () => {
  const minTime = 30; // 30 seconds minimum
  const maxTime = 1800; // 30 minutes maximum
  const randomSeconds = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  // Round to nearest 30 seconds
  return Math.round(randomSeconds / 30) * 30;
};

const generateRandomTemperature = (defaultTempFreeze: number) => {
  // Random temperature between defaultTempFreeze and 50°C
  return Math.round((Math.random() * (50 - defaultTempFreeze) + defaultTempFreeze) * 2) / 2; // Round to 0.5
};

// Helper to check if a row is complete
const isRowComplete = (row: TimeRow) => {
  return (
    typeof row.temperature === 'number' &&
    typeof row.timeA === 'number' &&
    typeof row.timeB === 'number' &&
    typeof row.timeC === 'number'
  );
};

// Form validation schema
const timeRowSchema = z.object({
  temperature: z.coerce.number().min(-50).max(50).optional(), // Temperature in Celsius
  timeA: z.coerce.number().int().min(0).max(3600).optional(), // 0 to 60 minutes in seconds
  timeB: z.coerce.number().int().min(0).max(3600).optional(),
  timeC: z.coerce.number().int().min(0).max(3600).optional(),
});

const addOrderSchema = z
  .object({
    mode: z.coerce.number().int().min(1).max(5),
    drinkType: z.string().min(1, 'Drink type is required'),
    drinkSubtype: z.string().optional(),
    volume: z.string().min(1, 'Volume is required'),
    containerType: z.string().min(1, 'Container type is required'),
    defaultTempConsume: z.coerce.number().min(-40).max(40),
    defaultTempFreeze: z.coerce.number().min(-50).max(40),
    timeRows: z
      .array(timeRowSchema)
      .min(1)
      .refine((rows) => rows.some(isRowComplete), {
        message: 'At least one complete row with all values is required',
        path: ['timeRows'], // Add path to ensure error shows up on timeRows
      }),
  })
  .refine(
    (data) => data.defaultTempFreeze <= data.defaultTempConsume - MIN_TEMP_DIFFERENCE,
    (data) => {
      const maxValue = data.defaultTempConsume - MIN_TEMP_DIFFERENCE;
      const formattedMax = new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(maxValue);
      return {
        message: `Max value is ${formattedMax}`,
        path: ['defaultTempFreeze'],
      };
    },
  );

type OrdersFormValues = z.infer<typeof addOrderSchema>;

interface TempItem {
  value: string;
  displayValue: string;
}

interface TempItems {
  drinkTypes: TempItem[];
  drinkSubtypes: TempItem[]; // Add separate array for subtypes
  volumes: TempItem[];
  containerTypes: TempItem[];
}

interface OrdersFormProps {
  onSubmit: (formData: OrdersFormValues) => void;
  isLoading?: boolean;
  language?: string;
  orderData?: OrderReadableModel;
  isEditMode?: boolean;
  onNavigateBack?: () => void;
}

export const OrdersForm: React.FC<OrdersFormProps> = ({
  onSubmit,
  isLoading = false,
  language = 'es-ES',
  orderData,
  isEditMode = false,
  onNavigateBack,
}) => {
  const [tempItems, setTempItems] = useState<TempItems>({
    drinkTypes: [],
    drinkSubtypes: [], // Initialize separate array for subtypes
    volumes: [],
    containerTypes: [],
  });

  // State to track if we can add new rows
  const [canAddRow, setCanAddRow] = useState(false);

  // Dev tools visibility
  const { isDevToolsVisible } = useDev();

  // Mutation hooks for saving
  const updateOrderMutation = useUpdateOrder();
  const updateTemperatureProfilesMutation = useUpdateTemperatureProfiles();
  const createOrderMutation = useCreateOrder();

  // Creation hooks
  const createDrinkType = useCreateDrinkType();
  const createDrinkSubtype = useCreateDrinkSubtype();
  const createVolume = useCreateVolume();
  const createContainerType = useCreateContainerType();

  // Update hooks
  const updateDrinkType = useUpdateDrinkType();

  // RHF setup with temperature profiles
  const methods = useForm<OrdersFormValues>({
    mode: 'onChange', // Change to track form changes in real-time
    reValidateMode: 'onChange',
    resolver: zodResolver(addOrderSchema),
    defaultValues: {
      mode: orderData?.mode ? Number(orderData.mode) : 4,
      drinkType: orderData?.drinkType || '',
      drinkSubtype: orderData?.drinkSubtype || '',
      volume: orderData?.volume || '',
      containerType: orderData?.containerType || '',
      defaultTempConsume: orderData?.defaultTempConsume || 5,
      defaultTempFreeze: orderData?.defaultTempFreeze || -2,
      timeRows: (() => {
        // Start with existing profiles if in edit mode
        const existingProfiles =
          isEditMode && orderData?.temperatureProfiles?.length
            ? orderData.temperatureProfiles.map((profile) => ({
                temperature: profile.temperature,
                timeA: profile.timeA,
                timeB: profile.timeB,
                timeC: profile.timeC,
              }))
            : [];

        // Calculate how many empty rows we need to add
        const emptyRowsNeeded = MIN_TABLE_ROWS - existingProfiles.length;
        const emptyRows = Array.from(
          { length: Math.max(0, emptyRowsNeeded) },
          () => PROFILE_ITEM_VALUES_EMPTY,
        );

        // Combine existing profiles with empty rows
        return [...existingProfiles, ...emptyRows];
      })(),
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    control,
    formState: { isValid, isDirty },
  } = methods;

  // Field array for adding rows externally
  const { append } = useFieldArray({
    control,
    name: 'timeRows',
  });

  // Watch form values
  const formValues = watch();

  // Create filtered version of form values for display
  const filteredFormValues = useMemo(
    () => ({
      ...formValues,
      timeRows: formValues.timeRows?.filter(
        (row) =>
          row.temperature !== undefined ||
          row.timeA !== undefined ||
          row.timeB !== undefined ||
          row.timeC !== undefined,
      ),
    }),
    [formValues],
  );

  // Data hooks
  const { data: drinkTypes = [] } = useGetDrinkTypes();
  const { data: volumes = [] } = useGetDrinkVolumes();
  const { data: containerTypes = [] } = useGetContainerTypes();
  const { data: ordersData = [] } = useGetOrdersReadable();
  // const { data: drinkSubtypes = [] } = useGetDrinkSubtypes(); // Get all subtypes
  const { currentLanguage } = useContent();

  // Watch form values for drinkType to fetch subtypes
  const selectedDrinkType = useMemo(() => {
    return drinkTypes.find((dt) => dt.name === formValues.drinkType);
  }, [drinkTypes, formValues.drinkType]);

  // Fetch subtypes for selected drink type
  const { data: subtypesData = [] } = useGetDrinkSubtypes({
    drinkTypeId: selectedDrinkType?.id || '',
    enabled: Boolean(selectedDrinkType?.id && selectedDrinkType.hasSubtypes),
  });

  // Transform subtype data for the dropdown
  const drinkSubtypeOptions = useMemo(() => {
    if (!selectedDrinkType?.hasSubtypes) return [];

    const databaseOptions = subtypesData.map((subtype) => ({
      value: subtype.name,
      label: subtype.translations[language] || subtype.name,
      category: 'Database',
    }));

    const customOptions = tempItems.drinkSubtypes // Use drinkSubtypes array instead of drinkTypes
      .map((item) => ({
        value: item.value,
        label: item.displayValue,
        category: 'Custom',
      }));

    return [...databaseOptions, ...customOptions];
  }, [subtypesData, selectedDrinkType, tempItems.drinkSubtypes, language]); // Update dependency

  // Helper function to find ID by name with support for subtypes
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

  // Transform data using DTO with language translations
  const drinkTypeOptions = useMemo(() => {
    const databaseOptions = SelectOptionDto.fromDrinkTypes(drinkTypes, language);
    const customOptions = tempItems.drinkTypes.map((item) => ({
      value: item.value,
      label: item.displayValue,
      category: 'Custom',
    }));
    return [...databaseOptions, ...customOptions];
  }, [drinkTypes, tempItems.drinkTypes, language]);

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

  // Handle form submission with actual API calls
  const onFormSubmit = async (data: OrdersFormValues) => {
    if (isEditMode && orderData?.id) {
      try {
        // Convert form values to IDs for API
        const orderUpdates = {
          mode: data.mode,
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
            // Include the field if it's different from the current value
            // Note: undefined means "don't change", null means "explicitly set to null"
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
          await updateOrderMutation.mutateAsync({
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
          // Map form rows to profile updates, preserving order and handling creates/updates properly
          const profileUpdates = validTimeRows.map((row, index) => {
            // Try to find existing profile that matches this row's data or use index-based mapping as fallback
            const existingProfile = orderData.temperatureProfiles?.[index];

            return {
              id: existingProfile?.id, // Use existing ID if available, undefined for new profiles
              temperature: row.temperature!,
              timeA: row.timeA!,
              timeB: row.timeB!,
              timeC: row.timeC!,
              coolingProfileId: 'ebbe533a-a892-4079-afff-84085bc8048b', // Use the correct slow cooling profile ID
            };
          });

          console.log('Updating temperature profiles with:', profileUpdates);
          console.log('Existing profiles:', orderData.temperatureProfiles);

          await updateTemperatureProfilesMutation.mutateAsync({
            orderId: orderData.id,
            profiles: profileUpdates,
            existingProfiles: orderData.temperatureProfiles || [],
          });
        }

        // Call the parent onSubmit to handle success message and navigation
        onSubmit(data);
      } catch (error) {
        console.error('Failed to update order:', error);
        // You might want to show an error toast here
      }
    } else {
      try {
        // Create any new entities first
        const createdIds: Record<string, string> = {};

        // Create new drink type if needed
        const drinkTypeTemp = tempItems.drinkTypes.find((item) => item.value === data.drinkType);
        if (drinkTypeTemp) {
          const drinkTypeResponse = await createDrinkType.mutateAsync({
            name: drinkTypeTemp.displayValue, // Use displayValue (original user input) for the name
            hasSubtypes: Boolean(data.drinkSubtype), // Set hasSubtypes based on whether a subtype is selected
            defaultTempConsume: data.defaultTempConsume,
            defaultTempFreeze: data.defaultTempFreeze,
            // Let the mutation handle translations automatically
          });
          createdIds.drinkTypeId = drinkTypeResponse.id;
        }

        // Create new subtype if needed
        const drinkSubtypeTemp = tempItems.drinkSubtypes.find((item) => item.value === data.drinkSubtype); // Use drinkSubtypes array
        if (drinkSubtypeTemp && data.drinkSubtype) {
          // Get the drinkTypeId - either from newly created or existing
          const drinkTypeId = createdIds.drinkTypeId || findIdByName(drinkTypes, data.drinkType, 'drinkType');

          if (!drinkTypeId) {
            throw new Error('Cannot create subtype: missing drinkTypeId');
          }

          // Check if the parent drink type has hasSubtypes set to true
          const existingDrinkType = drinkTypes.find((dt) => dt.id === drinkTypeId);
          if (existingDrinkType && !existingDrinkType.hasSubtypes) {
            // Update the parent drink type to allow subtypes
            console.log('Updating parent drink type to allow subtypes:', drinkTypeId);
            await updateDrinkType.mutateAsync({
              id: drinkTypeId,
              updates: {
                hasSubtypes: true,
              },
            });
          }

          const drinkSubtypeResponse = await createDrinkSubtype.mutateAsync({
            name: drinkSubtypeTemp.displayValue, // Use displayValue (original user input) for the name
            drinkTypeId, // Use the actual drinkTypeId
            defaultTempConsume: data.defaultTempConsume,
            defaultTempFreeze: data.defaultTempFreeze,
            // Let the mutation handle translations automatically
          });
          createdIds.drinkSubtypeId = drinkSubtypeResponse.id;
        }

        // Create new volume if needed
        const volumeTemp = tempItems.volumes.find((item) => item.value === data.volume);
        if (volumeTemp) {
          const volumeResponse = await createVolume.mutateAsync({
            name: volumeTemp.displayValue, // Use displayValue for the name
            valueInMl: 500, // Default to 500ml
            sortOrder: volumeOptions.length + 1,
            // Let the mutation handle translations automatically
          });
          createdIds.volumeId = volumeResponse.id;
        }

        // Create new container type if needed
        const containerTypeTemp = tempItems.containerTypes.find((item) => item.value === data.containerType);
        if (containerTypeTemp) {
          const containerTypeResponse = await createContainerType.mutateAsync({
            name: containerTypeTemp.displayValue, // Use displayValue for the name
            thermalConductivity: 50, // Default to middle value
            // Let the mutation handle translations automatically
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
        const existingVolumeId = !createdIds.volumeId
          ? findIdByName(volumes, data.volume, 'volume')
          : undefined;
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

        // Now create the order using either new IDs or existing ones
        const orderData = {
          mode: data.mode,
          drinkTypeId: finalDrinkTypeId,
          drinkSubtypeId: createdIds.drinkSubtypeId || existingDrinkSubtypeId || undefined, // Use undefined for new orders
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
          coolingProfileId: 'ebbe533a-a892-4079-afff-84085bc8048b', // Use the correct slow cooling profile ID
        }));

        console.log('Creating order with temperature profiles:', temperatureProfiles);

        // Create the order with temperature profiles
        await createOrderMutation.mutateAsync({
          orderData,
          temperatureProfiles,
        });

        // Call the parent onSubmit to handle success message
        onSubmit(data);

        // Reset form and temp items
        methods.reset();
        setTempItems({
          drinkTypes: [],
          drinkSubtypes: [], // Reset subtypes array
          volumes: [],
          containerTypes: [],
        });
      } catch (error) {
        console.error('Failed to create order:', error);
        // You might want to show an error toast here
      }
    }
  };

  // Handle field changes for dependency management (middleware will also handle this)
  const handleFieldChange = (fieldName: string, value: any, allFormValues: MiddlewareOrdersFormValues) => {
    // Example of centralized dependency logic (middleware will do this, but keeping for backward compatibility)
    if (fieldName === 'defaultTempConsume') {
      const currentFreezeTemp = allFormValues.defaultTempFreeze;
      const maxFreezeTemp = value - MIN_TEMP_DIFFERENCE;

      if (currentFreezeTemp > maxFreezeTemp) {
        setValue('defaultTempFreeze', maxFreezeTemp, { shouldValidate: true });
      }
    }
  };

  // Simple field change for form components (adapts to new signature)
  const handleSimpleFieldChange = (field: keyof OrdersFormValues, value: string | number) => {
    setValue(field, value, { shouldValidate: true, shouldDirty: true });
    // Call the middleware-compatible version
    handleFieldChange(field, value, formValues as MiddlewareOrdersFormValues);
  };

  // Handle adding new temp items
  const handleAddNew = async (field: keyof TempItems, value: string) => {
    if (!value.trim()) return;

    // Store the new value temporarily
    const displayValue = value.trim();
    const kebabValue = slugify(displayValue);

    setTempItems((prev) => ({
      ...prev,
      [field]: [...prev[field], { value: kebabValue, displayValue }],
    }));

    // Return the kebab value to be used in the form
    return kebabValue;
  };

  // Handle adding new subtype
  const handleAddSubtype = async (value: string) => {
    if (!value.trim() || !formValues.drinkType) return;

    // Store the new value temporarily in drinkSubtypes array
    const displayValue = value.trim();
    const kebabValue = slugify(displayValue);

    setTempItems((prev) => ({
      ...prev,
      drinkSubtypes: [...prev.drinkSubtypes, { value: kebabValue, displayValue }], // Use drinkSubtypes array
    }));

    // Return the kebab value to be used in the form
    return kebabValue;
  };

  // Callback to track when rows can be added
  const handleCanAddRowChange = useCallback((canAdd: boolean) => {
    setCanAddRow(canAdd);
  }, []);

  // Handle adding a new row
  const handleAddRow = useCallback(() => {
    append(PROFILE_ITEM_VALUES_EMPTY);
  }, [append]);

  // Generate random values for a specific row
  const generateRandomValuesForRow = useCallback(
    (rowIndex: number) => {
      const defaultTempFreeze = formValues.defaultTempFreeze || -2;
      const randomTemp = generateRandomTemperature(defaultTempFreeze);
      const randomTimeA = generateRandomTime();
      const randomTimeB = generateRandomTime();
      const randomTimeC = generateRandomTime();

      // Ensure all values are numbers
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
    [setValue, formValues.defaultTempFreeze],
  );

  // Generate random values for all rows
  const handleMockAllRows = useCallback(() => {
    const currentRows = formValues.timeRows || [];
    currentRows.forEach((_, index) => {
      generateRandomValuesForRow(index);
    });
  }, [formValues.timeRows, generateRandomValuesForRow]);

  // Fill form with valid test values for development
  const handleMockValues = useCallback(() => {
    console.log('handleMockValues called');

    // Set basic form values with realistic data
    setValue('mode', 2, { shouldValidate: true, shouldDirty: true });
    console.log('Set mode value');

    // Set temperatures
    setValue('defaultTempConsume', 4, { shouldValidate: true, shouldDirty: true });
    setValue('defaultTempFreeze', -1, { shouldValidate: true, shouldDirty: true });
    console.log('Set temperatures');

    // Use available options from the form data
    if (drinkTypeOptions.length > 0) {
      const sampleDrinkType = drinkTypeOptions.find((opt) => opt.value === 'cerveza') || drinkTypeOptions[0];
      console.log('Setting drink type to:', sampleDrinkType.value);
      setValue('drinkType', sampleDrinkType.value, { shouldValidate: true, shouldDirty: true });
    }

    if (drinkTypeOptions.length > 1) {
      const sampleSubtype = drinkTypeOptions.find((opt) => opt.value === 'rubia') || drinkTypeOptions[1];
      console.log('Setting drink subtype to:', sampleSubtype.value);
      setValue('drinkSubtype', sampleSubtype.value, { shouldValidate: true, shouldDirty: true });
    }

    if (volumeOptions.length > 0) {
      const sampleVolume = volumeOptions.find((opt) => opt.value === '50cl') || volumeOptions[0];
      console.log('Setting volume to:', sampleVolume.value);
      setValue('volume', sampleVolume.value, { shouldValidate: true, shouldDirty: true });
    }

    if (containerTypeOptions.length > 0) {
      const sampleContainer =
        containerTypeOptions.find((opt) => opt.value === 'vidrio') || containerTypeOptions[0];
      console.log('Setting container type to:', sampleContainer.value);
      setValue('containerType', sampleContainer.value, { shouldValidate: true, shouldDirty: true });
    }

    // Fill temperature profile rows with sample data
    const sampleRows = [
      { temperature: 25, timeA: 180, timeB: 240, timeC: 300 },
      { temperature: 15, timeA: 360, timeB: 480, timeC: 600 },
      { temperature: 8, timeA: 540, timeB: 720, timeC: 900 },
      { temperature: 2, timeA: 720, timeB: 960, timeC: 1200 },
    ];

    console.log('Setting time rows:', sampleRows);
    setValue('timeRows', sampleRows, { shouldValidate: true, shouldDirty: true });

    // Log the current form state
    console.log('Form values after mock:', methods.getValues());
    console.log('Form state:', methods.formState);
  }, [setValue, drinkTypeOptions, volumeOptions, containerTypeOptions, methods]);

  // Also add a console log to the button click handler
  const handleMockClick = useCallback(() => {
    console.log('Mock button clicked');
    handleMockValues();
  }, [handleMockValues]);

  // Mock functions
  const handleMockPartial = useCallback(() => {
    console.log('Mocking partial form data');

    // Set all values at once to trigger a single validation
    const formValues = {
      mode: 2,
      defaultTempConsume: 4,
      defaultTempFreeze: -1,
      drinkType: '',
      volume: '',
      containerType: '',
      timeRows: Array.from({ length: MIN_TABLE_ROWS }, () => PROFILE_ITEM_VALUES_EMPTY),
    };

    // Add available options
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

    // Reset form with all values at once
    methods.reset(formValues, {
      keepDirty: true,
      keepErrors: false,
      keepTouched: false,
      keepIsSubmitted: false,
      keepSubmitCount: false,
    });

    // Trigger validation
    methods.trigger();
  }, [setValue, drinkTypeOptions, volumeOptions, containerTypeOptions]);

  const handleMockTwoRows = useCallback(() => {
    console.log('Mocking two rows');

    // Prepare all form data at once including the two rows
    const twoRows = Array.from({ length: MIN_TABLE_ROWS }, () => ({ ...PROFILE_ITEM_VALUES_EMPTY }));

    // Add two complete rows with proper types
    const completeRow1: TimeRow = {
      temperature: 25,
      timeA: 180,
      timeB: 240,
      timeC: 300,
    };

    const completeRow2: TimeRow = {
      temperature: 15,
      timeA: 360,
      timeB: 480,
      timeC: 600,
    };

    twoRows[0] = completeRow1;
    twoRows[1] = completeRow2;

    // Prepare complete form data
    const formValues = {
      mode: 2,
      defaultTempConsume: 4,
      defaultTempFreeze: -1,
      drinkType:
        (drinkTypeOptions.find((opt) => opt.value === 'cerveza') || drinkTypeOptions[0])?.value || '',
      volume: (volumeOptions.find((opt) => opt.value === '50cl') || volumeOptions[0])?.value || '',
      containerType:
        (containerTypeOptions.find((opt) => opt.value === 'vidrio') || containerTypeOptions[0])?.value || '',
      timeRows: twoRows,
    };

    // Reset form with all values at once
    methods.reset(formValues, {
      keepDirty: true,
      keepErrors: false,
      keepTouched: false,
      keepIsSubmitted: false,
      keepSubmitCount: false,
    });

    // Trigger validation
    methods.trigger();
  }, [setValue, handleMockPartial]);

  const isSubmitLoading =
    updateOrderMutation.isPending ||
    updateTemperatureProfilesMutation.isPending ||
    createOrderMutation.isPending ||
    updateDrinkType.isPending;

  return (
    <FormProvider {...methods}>
      <FormMiddlewareProvider
        formMethods={methods}
        fieldConfigs={ordersFormFieldConfigs}
        defaultLocale={language}
        onFieldChange={handleFieldChange}
      >
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <Row className="row">
            <Col xs={9} md={9} className="col">
              {/* ======================================================================== */}

              <Row className="row">
                <Col xs={2} md={2} className="col col-form-fields">
                  {/* Mode */}
                  <FieldWrapper name="mode" label="Mode" required>
                    <SelectSimple
                      {...register('mode')}
                      className="mode-select"
                      options={[1, 2, 3, 4, 5]}
                      placeholder="Select mode"
                      defaultValue={formValues.mode}
                      onSelect={(value) => handleSimpleFieldChange('mode', Number(value))}
                    />
                  </FieldWrapper>
                </Col>

                <Col xs={5} md={5} className="col col-form-fields">
                  {/* Drink Type */}
                  <FieldWrapper
                    name="drinkType"
                    label="Drink Type"
                    hint={`${drinkTypeOptions.length} disponibles`}
                    required
                  >
                    <SelectSearchable
                      value={formValues.drinkType}
                      onSelect={(value) => {
                        handleSimpleFieldChange('drinkType', value);
                        // Clear subtype when drink type changes
                        handleSimpleFieldChange('drinkSubtype', '');
                      }}
                      onClear={() => {
                        handleSimpleFieldChange('drinkType', '');
                        handleSimpleFieldChange('drinkSubtype', '');
                      }}
                      onAddNew={(value) => handleAddNew('drinkTypes', value)}
                      options={drinkTypeOptions}
                      placeholder="e.g., Coffee, Tea, Juice"
                      windowSize={15}
                    />
                  </FieldWrapper>
                </Col>

                <Col xs={5} md={5} className="col col-form-fields">
                  {/* Drink Subtype */}
                  <FieldWrapper
                    name="drinkSubtype"
                    label="Drink Subtype"
                    hint={
                      selectedDrinkType?.hasSubtypes
                        ? `${drinkSubtypeOptions.length} disponibles`
                        : 'No subtypes available'
                    }
                  >
                    <SelectSearchable
                      value={formValues.drinkSubtype}
                      onSelect={(value) => handleSimpleFieldChange('drinkSubtype', value)}
                      onClear={() => handleSimpleFieldChange('drinkSubtype', '')}
                      onAddNew={handleAddSubtype}
                      options={drinkSubtypeOptions}
                      placeholder={
                        selectedDrinkType?.hasSubtypes ? 'Select subtype' : 'No subtypes available'
                      }
                      windowSize={15}
                      disabled={!selectedDrinkType?.hasSubtypes || !formValues.drinkType}
                    />
                  </FieldWrapper>
                </Col>
              </Row>

              {/* ======================================================================== */}

              <Row className="row">
                <Col xs={4} md={4} className="col col-form-fields">
                  {/* Volume */}
                  <FieldWrapper
                    name="volume"
                    label="Volume"
                    hint={`${volumeOptions.length} disponibles`}
                    required
                  >
                    <SelectSearchable
                      value={formValues.volume}
                      onSelect={(value) => handleSimpleFieldChange('volume', value)}
                      onClear={() => handleSimpleFieldChange('volume', '')}
                      onAddNew={(value) => handleAddNew('volumes', value)}
                      options={volumeOptions}
                      placeholder="e.g., 250ml, 500ml, 1L"
                      windowSize={15}
                    />
                  </FieldWrapper>
                </Col>

                <Col xs={4} md={4} className="col col-form-fields">
                  {/* Container Type */}
                  <FieldWrapper
                    name="containerType"
                    label="Container"
                    hint={`${containerTypeOptions.length} disponibles`}
                    required
                  >
                    <SelectSearchable
                      value={formValues.containerType}
                      onSelect={(value) => handleSimpleFieldChange('containerType', value)}
                      onClear={() => handleSimpleFieldChange('containerType', '')}
                      onAddNew={(value) => handleAddNew('containerTypes', value)}
                      options={containerTypeOptions}
                      placeholder="e.g., Cup, Bottle, Can"
                      windowSize={15}
                    />
                  </FieldWrapper>
                </Col>

                <Col xs={2} md={2} className="col col-form-fields">
                  {/* Temperatura consumo - MIDDLEWARE MAGIC! */}
                  <FieldWrapper name="defaultTempConsume" label="Temperatura consumo" required>
                    <InputTemperature name="defaultTempConsume" />
                  </FieldWrapper>
                </Col>

                <Col xs={2} md={2} className="col col-form-fields">
                  {/* Temperatura congelación - MIDDLEWARE MAGIC WITH DYNAMIC CONSTRAINTS! */}
                  <FieldWrapper name="defaultTempFreeze" label="Temperatura congelación" required>
                    <InputTemperature name="defaultTempFreeze" />
                  </FieldWrapper>
                </Col>
              </Row>

              {/* ======================================================================== */}

              <Col xs={12} md={12} className="col col-form-fields col-form-table">
                <TimesRepeaterTable
                  name="timeRows"
                  emptyRowValues={PROFILE_ITEM_VALUES_EMPTY}
                  minRows={MIN_TABLE_ROWS}
                  minVisibleRows={MIN_TABLE_VISIBLE_ROWS}
                  language={language}
                  onCanAddRowChange={handleCanAddRowChange}
                  onGenerateRandomValues={generateRandomValuesForRow}
                />
              </Col>

              {/* ======================================================================== */}
            </Col>

            {/* ======================================================================== */}

            <Col xs={3} md={3} className="col">
              <pre>{JSON.stringify(filteredFormValues, null, 2)}</pre>
            </Col>

            {/* ======================================================================== */}
          </Row>
          <Row className="row">
            <Col xs={12} md={12} className="col col-form-buttons">
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {/* Left side buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Add Row Button */}
                  <Button
                    type="button"
                    variant="soft"
                    size="3"
                    onClick={handleAddRow}
                    disabled={!canAddRow}
                    color="success"
                  >
                    + Add Row
                  </Button>

                  {/* Dev Tools Buttons */}
                  {isDevToolsVisible && (
                    <>
                      <Button type="button" variant="soft" size="3" onClick={handleMockPartial} color="info">
                        📝 Mock Partial
                      </Button>
                      <Button
                        type="button"
                        variant="soft"
                        size="3"
                        onClick={handleMockTwoRows}
                        color="default"
                      >
                        🎲 Mock 2 Rows
                      </Button>
                      <Button type="button" variant="soft" size="3" onClick={handleMockClick} color="info">
                        📝 Mock All
                      </Button>
                      <Button
                        type="button"
                        variant="soft"
                        size="3"
                        onClick={handleMockAllRows}
                        color="default"
                      >
                        🎲 Mock All Rows
                      </Button>
                    </>
                  )}
                </div>

                {/* Right side buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
                  {/* Cancel button */}
                  {isEditMode && (
                    <Button type="button" variant="soft" size="3" onClick={onNavigateBack} color="default">
                      Cancelar
                    </Button>
                  )}

                  <Button
                    type="submit"
                    css={{ padding: '1rem 3rem' }}
                    disabled={!isValid || (isEditMode && !isDirty) || isSubmitLoading}
                    loading={isSubmitLoading}
                    size="3"
                    color={isEditMode ? 'warning' : 'success'}
                  >
                    {isEditMode ? 'CONFIRM CHANGES' : 'GUARDAR'}
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </form>
      </FormMiddlewareProvider>
    </FormProvider>
  );
};
