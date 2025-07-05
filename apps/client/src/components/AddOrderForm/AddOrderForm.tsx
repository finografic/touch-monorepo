import React, { useMemo, useState } from 'react';
import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { SearchableSelect } from 'pages/AdminPages/AdminOrdersPage/SearchableSelect/SearchableSelect';
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

  // Transform data into SelectOption format
  const drinkTypeOptions = useMemo(
    () =>
      [
        ...drinkTypes.map((dt: any) => ({
          value: dt.name || '',
          label: dt.name || '',
          category: 'Database',
        })),
        ...tempItems.drinkTypes.map((name) => ({
          value: name,
          label: name,
          category: 'Custom',
        })),
      ].filter((option) => option.value),
    [drinkTypes, tempItems.drinkTypes],
  );

  const volumeOptions = useMemo(() => {
    let baseOptions = [
      ...volumes.map((v: any) => ({
        value: v.name || '',
        label: v.name || '',
        category: 'Database',
      })),
      ...tempItems.volumes.map((name) => ({
        value: name,
        label: name,
        category: 'Custom',
      })),
    ].filter((option) => option.value);

    // Progressive filtering: if drink type is selected, also include volumes used with that drink type
    if (formState.drinkType) {
      const usedVolumes = ordersData
        .filter((order) => order.drinkType === formState.drinkType)
        .map((order) => order.volume)
        .filter(Boolean)
        .map((volume) => ({
          value: volume,
          label: volume,
          category: 'From existing orders',
        }));

      baseOptions = [...baseOptions, ...usedVolumes];
      // Remove duplicates
      baseOptions = Array.from(new Map(baseOptions.map((opt) => [opt.value, opt])).values());
    }

    return baseOptions;
  }, [volumes, tempItems.volumes, formState.drinkType, ordersData]);

  const containerTypeOptions = useMemo(() => {
    let baseOptions = [
      ...containerTypes.map((ct: any) => ({
        value: ct.name || '',
        label: ct.name || '',
        category: 'Database',
      })),
      ...tempItems.containerTypes.map((name) => ({
        value: name,
        label: name,
        category: 'Custom',
      })),
    ].filter((option) => option.value);

    // Progressive filtering: if drink type and volume are selected, include containers used with that combination
    if (formState.drinkType && formState.volume) {
      const usedContainers = ordersData
        .filter((order) => order.drinkType === formState.drinkType && order.volume === formState.volume)
        .map((order) => order.containerType)
        .filter(Boolean)
        .map((container) => ({
          value: container,
          label: container,
          category: 'From existing orders',
        }));

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
      // Reset temp items too
      setTempItems({
        drinkTypes: [],
        volumes: [],
        containerTypes: [],
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
          <SearchableSelect
            label="Drink Type"
            value={formState.drinkType}
            onSelect={(value) => handleFieldChange('drinkType', value)}
            onAddNew={(value) => handleAddNew('drinkTypes', value)}
            options={drinkTypeOptions}
            placeholder="e.g., Coffee, Tea, Juice"
            required
            windowSize={15}
          />

          {/* Subtype */}
          <SearchableSelect
            label="Subtype"
            value={formState.drinkSubtype}
            onSelect={(value) => handleFieldChange('drinkSubtype', value)}
            options={[]}
            placeholder="Optional"
            allowAddNew={false}
            windowSize={10}
          />

          {/* Volume */}
          <SearchableSelect
            label="Volume"
            value={formState.volume}
            onSelect={(value) => handleFieldChange('volume', value)}
            onAddNew={(value) => handleAddNew('volumes', value)}
            options={volumeOptions}
            placeholder="e.g., 250ml, 500ml, 1L"
            required
            disabled={!formState.drinkType}
            windowSize={15}
          />

          {/* Container Type */}
          <SearchableSelect
            label="Container"
            value={formState.containerType}
            onSelect={(value) => handleFieldChange('containerType', value)}
            onAddNew={(value) => handleAddNew('containerTypes', value)}
            options={containerTypeOptions}
            placeholder="e.g., Cup, Bottle, Can"
            required
            disabled={!formState.volume}
            windowSize={15}
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
