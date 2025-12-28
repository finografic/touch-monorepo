import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'components/Toast';

import { GET_CONTAINER_TYPES_QUERYKEY } from 'queries/container-types';
import { useCreateContainerType } from 'queries/container-types/useCreateContainerType';
import { GET_DRINK_SUBTYPES_QUERYKEY, GET_DRINK_TYPES_QUERYKEY, useCreateDrinkSubtype, useCreateDrinkType  } from 'queries/drink-types';
import { GET_DRINK_VOLUMES_QUERYKEY } from 'queries/drink-volumes';
import { useCreateVolume } from 'queries/drink-volumes/useCreateVolume';

import { slugify } from 'utils/string.utils';
import type { UseDropdownDataReturn } from './orders-form.utils';
import type { OrdersFormValues } from './OrdersForm.schema';

interface UseAddNewItemHandlersProps {
  formValues: OrdersFormValues;
  dropdownData: UseDropdownDataReturn;
  handleSimpleFieldChange: (field: keyof OrdersFormValues, value: string | number) => void;
}

/**
 * Hook that provides handlers for adding new items (drink types, subtypes, volumes, container types)
 * These handlers write to the database immediately instead of caching
 */
export const useAddNewItemHandlers = ({
  formValues,
  dropdownData,
  handleSimpleFieldChange,
}: UseAddNewItemHandlersProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createDrinkTypeMutation = useCreateDrinkType();
  const createDrinkSubtypeMutation = useCreateDrinkSubtype();
  const createVolumeMutation = useCreateVolume();
  const createContainerTypeMutation = useCreateContainerType();

  const handleAddDrinkType = async (displayValue: string): Promise<string> => {
    if (!displayValue.trim()) return '';

    const kebabValue = slugify(displayValue.trim());

    // Optimistic update: set the form value immediately with kebab-case name
    // The form uses names (not IDs), so this will work even before the API responds
    handleSimpleFieldChange('drinkType', kebabValue);
    handleSimpleFieldChange('drinkSubtype', ''); // Clear subtype when drink type changes

    try {
      // Create the drink type in the database
      const createdDrinkType = await createDrinkTypeMutation.mutateAsync({
        name: displayValue.trim(),
        hasSubtypes: false, // Default to false, can be updated later
        defaultTempConsume: formValues.defaultTempConsume || 5,
        defaultTempFreeze: formValues.defaultTempFreeze || -2,
      });

      // Wait for the query to refetch to ensure dropdown options are updated
      await queryClient.refetchQueries({ queryKey: GET_DRINK_TYPES_QUERYKEY });

      // Ensure the form value is set to the created drink type's name
      const finalValue = createdDrinkType.name || kebabValue;
      handleSimpleFieldChange('drinkType', finalValue);

      toast({
        variant: 'success',
        message: `Drink type "${displayValue.trim()}" created successfully`,
      });

      return finalValue;
    } catch (error) {
      // On error, revert the optimistic update
      handleSimpleFieldChange('drinkType', '');
      toast({
        variant: 'error',
        message: 'Failed to create drink type',
        subText: error instanceof Error ? error.message : 'An error occurred while creating the drink type.',
      });
      throw error;
    }
  };

  const handleAddDrinkSubtype = async (displayValue: string): Promise<string> => {
    if (!displayValue.trim() || !formValues.drinkType) return '';

    const kebabValue = slugify(displayValue.trim());

    // Get the drink type ID
    const selectedDrinkType = dropdownData.drinkTypes.find((dt) => dt.name === formValues.drinkType);
    if (!selectedDrinkType?.id) {
      toast({
        variant: 'error',
        message: 'Please select a drink type first',
      });
      return '';
    }

    // Optimistic update: set the form value immediately
    handleSimpleFieldChange('drinkSubtype', kebabValue);

    try {
      // Create the drink subtype in the database
      const createdSubtype = await createDrinkSubtypeMutation.mutateAsync({
        name: displayValue.trim(),
        drinkTypeId: selectedDrinkType.id,
        defaultTempConsume: formValues.defaultTempConsume || 5,
        defaultTempFreeze: formValues.defaultTempFreeze || -2,
      });

      // Wait for the query to refetch
      await queryClient.refetchQueries({
        queryKey: [...GET_DRINK_SUBTYPES_QUERYKEY, selectedDrinkType.id],
      });

      // Ensure the form value is set correctly
      const finalValue = createdSubtype.name || kebabValue;
      handleSimpleFieldChange('drinkSubtype', finalValue);

      toast({
        variant: 'success',
        message: `Drink subtype "${displayValue.trim()}" created successfully`,
      });

      return finalValue;
    } catch (error) {
      // On error, revert the optimistic update
      handleSimpleFieldChange('drinkSubtype', '');
      toast({
        variant: 'error',
        message: 'Failed to create drink subtype',
        subText:
          error instanceof Error ? error.message : 'An error occurred while creating the drink subtype.',
      });
      throw error;
    }
  };

  const handleAddVolume = async (displayValue: string): Promise<string> => {
    if (!displayValue.trim()) return '';

    const kebabValue = slugify(displayValue.trim());

    // Optimistic update: set the form value immediately
    handleSimpleFieldChange('volume', kebabValue);

    try {
      // Create the volume in the database
      const createdVolume = await createVolumeMutation.mutateAsync({
        name: displayValue.trim(),
        valueInMl: 500, // Default value, can be updated later
        sortOrder: dropdownData.volumes.length + 1,
      });

      // Wait for the query to refetch
      await queryClient.refetchQueries({ queryKey: GET_DRINK_VOLUMES_QUERYKEY });

      // Ensure the form value is set correctly
      const finalValue = createdVolume.name || kebabValue;
      handleSimpleFieldChange('volume', finalValue);

      toast({
        variant: 'success',
        message: `Volume "${displayValue.trim()}" created successfully`,
      });

      return finalValue;
    } catch (error) {
      // On error, revert the optimistic update
      handleSimpleFieldChange('volume', '');
      toast({
        variant: 'error',
        message: 'Failed to create volume',
        subText: error instanceof Error ? error.message : 'An error occurred while creating the volume.',
      });
      throw error;
    }
  };

  const handleAddContainerType = async (displayValue: string): Promise<string> => {
    if (!displayValue.trim()) return '';

    const kebabValue = slugify(displayValue.trim());

    // Optimistic update: set the form value immediately
    handleSimpleFieldChange('containerType', kebabValue);

    try {
      // Create the container type in the database
      const createdContainerType = await createContainerTypeMutation.mutateAsync({
        name: displayValue.trim(),
        thermalConductivity: 50, // Default value, can be updated later
      });

      // Wait for the query to refetch
      await queryClient.refetchQueries({ queryKey: GET_CONTAINER_TYPES_QUERYKEY });

      // Ensure the form value is set correctly
      const finalValue = createdContainerType.name || kebabValue;
      handleSimpleFieldChange('containerType', finalValue);

      toast({
        variant: 'success',
        message: `Container type "${displayValue.trim()}" created successfully`,
      });

      return finalValue;
    } catch (error) {
      // On error, revert the optimistic update
      handleSimpleFieldChange('containerType', '');
      toast({
        variant: 'error',
        message: 'Failed to create container type',
        subText:
          error instanceof Error ? error.message : 'An error occurred while creating the container type.',
      });
      throw error;
    }
  };

  return {
    handleAddDrinkType,
    handleAddDrinkSubtype,
    handleAddVolume,
    handleAddContainerType,
  };
};
