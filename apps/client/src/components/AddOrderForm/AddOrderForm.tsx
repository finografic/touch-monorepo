import React, { useMemo, useState } from 'react';
import { Box, Button, Card, Flex, Text } from '@radix-ui/themes';
import { ComboboxField } from 'components/ComboboxField';
import { useGetDrinkTypes } from 'queries/drink-types';
import { useGetDrinkVolumes } from 'queries/drink-volumes/useGetDrinkVolumes';
import { useGetContainerTypes } from 'queries/container-types';
import { useGetOrdersReadable } from 'api/hooks/useOrdersReadable';
import { Col, Row } from 'react-grid-system';

interface FormState {
  drinkType: string;
  drinkSubtype: string;
  volume: string;
  containerType: string;
}

interface TempItems {
  drinkTypes: string[];
  volumes: string[];
  containerTypes: string[];
}

interface AddOrderFormProps {
  onSubmit: (formData: FormState) => void;
  isLoading?: boolean;
}

export const AddOrderForm: React.FC<AddOrderFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formState, setFormState] = useState<FormState>({
    drinkType: '',
    drinkSubtype: '',
    volume: '',
    containerType: '',
  });

  const [tempItems, setTempItems] = useState<TempItems>({
    drinkTypes: [],
    volumes: [],
    containerTypes: [],
  });

  // Data hooks
  const { data: drinkTypes = [] } = useGetDrinkTypes();
  const { data: volumes = [] } = useGetDrinkVolumes();
  const { data: containerTypes = [] } = useGetContainerTypes();
  const { data: ordersData = [] } = useGetOrdersReadable();

  // Transform data into ComboboxOption format
  const drinkTypeOptions = useMemo(
    () =>
      [
        ...drinkTypes.map((dt: any) => ({ value: dt.name || '', label: dt.name || '' })),
        ...tempItems.drinkTypes.map((name) => ({ value: name, label: name })),
      ].filter((option) => option.value),
    [drinkTypes, tempItems.drinkTypes],
  );

  const volumeOptions = useMemo(() => {
    let baseOptions = [
      ...volumes.map((v: any) => ({ value: v.name || '', label: v.name || '' })),
      ...tempItems.volumes.map((name) => ({ value: name, label: name })),
    ].filter((option) => option.value);

    // Progressive filtering: if drink type is selected, also include volumes used with that drink type
    if (formState.drinkType) {
      const usedVolumes = ordersData
        .filter((order) => order.drinkType === formState.drinkType)
        .map((order) => order.volume)
        .filter(Boolean)
        .map((volume) => ({ value: volume, label: volume }));

      baseOptions = [...baseOptions, ...usedVolumes];
      // Remove duplicates
      baseOptions = Array.from(new Map(baseOptions.map((opt) => [opt.value, opt])).values());
    }

    return baseOptions;
  }, [volumes, tempItems.volumes, formState.drinkType, ordersData]);

  const containerTypeOptions = useMemo(() => {
    let baseOptions = [
      ...containerTypes.map((ct: any) => ({ value: ct.name || '', label: ct.name || '' })),
      ...tempItems.containerTypes.map((name) => ({ value: name, label: name })),
    ].filter((option) => option.value);

    // Progressive filtering: if drink type and volume are selected, include containers used with that combination
    if (formState.drinkType && formState.volume) {
      const usedContainers = ordersData
        .filter((order) => order.drinkType === formState.drinkType && order.volume === formState.volume)
        .map((order) => order.containerType)
        .filter(Boolean)
        .map((container) => ({ value: container, label: container }));

      baseOptions = [...baseOptions, ...usedContainers];
      // Remove duplicates
      baseOptions = Array.from(new Map(baseOptions.map((opt) => [opt.value, opt])).values());
    }

    return baseOptions;
  }, [containerTypes, tempItems.containerTypes, formState.drinkType, formState.volume, ordersData]);

  // Handle field changes
  const handleFieldChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => {
      const newState = { ...prev, [field]: value };

      // Reset dependent fields when parent changes
      if (field === 'drinkType') {
        newState.volume = '';
        newState.containerType = '';
      } else if (field === 'volume') {
        newState.containerType = '';
      }

      return newState;
    });
  };

  // Handle adding new temp items
  const handleAddNew = (field: keyof TempItems, value: string) => {
    if (value.trim()) {
      setTempItems((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (formState.drinkType && formState.volume && formState.containerType) {
      onSubmit(formState);
      // Reset form
      setFormState({
        drinkType: '',
        drinkSubtype: '',
        volume: '',
        containerType: '',
      });
    }
  };

  // Check if form is valid
  const isFormValid = formState.drinkType && formState.volume && formState.containerType;

  return (
    <Row className="row">
      <Col xs={12} md={12} className="col">
        <Flex gap="4" justify="between" className="b">
          {/* Drink Type */}
          <ComboboxField
            label="Drink Type"
            value={formState.drinkType}
            onChange={(value) => handleFieldChange('drinkType', value)}
            options={drinkTypeOptions}
            placeholder="e.g., Coffee, Tea, Juice"
            required
            onAddNew={(value) => handleAddNew('drinkTypes', value)}
          />

          {/* Subtype */}
          <ComboboxField
            label="Subtype"
            value={formState.drinkSubtype}
            onChange={(value) => handleFieldChange('drinkSubtype', value)}
            options={[]}
            placeholder="Optional"
            allowAddNew={false}
          />

          {/* Volume */}
          <ComboboxField
            label="Volume"
            value={formState.volume}
            onChange={(value) => handleFieldChange('volume', value)}
            options={volumeOptions}
            placeholder="e.g., 250ml, 500ml, 1L"
            required
            disabled={!formState.drinkType}
            onAddNew={(value) => handleAddNew('volumes', value)}
          />

          {/* Container Type */}
          <ComboboxField
            label="Container"
            value={formState.containerType}
            onChange={(value) => handleFieldChange('containerType', value)}
            options={containerTypeOptions}
            placeholder="e.g., Cup, Bottle, Can"
            required
            disabled={!formState.volume}
            onAddNew={(value) => handleAddNew('containerTypes', value)}
          />
        </Flex>

        {/* Form validation feedback */}
        {!isFormValid && (
          <Text size="1" color="gray" mt="2">
            Please fill in Drink Type, Volume, and Container fields
          </Text>
        )}
      </Col>
      {/* ======================================================================== */}
      <Col xs={12} md={12} className="col col-form-buttons">
        {/* Submit Button */}
        <Button onClick={handleSubmit} disabled={!isFormValid || isLoading} loading={isLoading} size="2">
          Add Order
        </Button>
      </Col>
    </Row>
  );
};
