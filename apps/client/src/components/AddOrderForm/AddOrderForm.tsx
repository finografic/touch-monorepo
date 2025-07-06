import React, { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { SearchableSelect } from 'pages/AdminPages/AdminOrdersPage/SearchableSelect/SearchableSelect';
import { SimpleSelect } from 'components/SimpleSelect';
import { FieldWrapper } from 'components/FieldWrapper';
import { useGetDrinkTypes } from 'queries/drink-types';
import { useGetDrinkVolumes } from 'queries/drink-volumes/useGetDrinkVolumes';
import { useGetContainerTypes } from 'queries/container-types';
import { useGetOrdersReadable } from 'api/hooks/useOrdersReadable';
import { SelectOptionDto } from 'types/models/select-option.model';
import { Col, Row } from 'react-grid-system';

// Form validation schema
const addOrderSchema = z.object({
  mode: z.number().int().min(1).max(5),
  drinkType: z.string().min(1, 'Drink type is required'),
  drinkSubtype: z.string().optional(),
  volume: z.string().min(1, 'Volume is required'),
  containerType: z.string().min(1, 'Container type is required'),
});

type AddOrderFormValues = z.infer<typeof addOrderSchema>;

interface TempItems {
  drinkTypes: string[];
  volumes: string[];
  containerTypes: string[];
}

interface AddOrderFormProps {
  onSubmit: (formData: AddOrderFormValues) => void;
  isLoading?: boolean;
  language?: string;
}

export const AddOrderForm: React.FC<AddOrderFormProps> = ({
  onSubmit,
  isLoading = false,
  language = 'es-ES',
}) => {
  const [tempItems, setTempItems] = useState<TempItems>({
    drinkTypes: [],
    volumes: [],
    containerTypes: [],
  });

  // RHF setup
  const methods = useForm<AddOrderFormValues>({
    resolver: zodResolver(addOrderSchema),
    defaultValues: {
      mode: 4,
      drinkType: '',
      drinkSubtype: '',
      volume: '',
      containerType: '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { isValid, errors },
  } = methods;

  // Watch form values
  const formValues = watch();

  // Data hooks
  const { data: drinkTypes = [] } = useGetDrinkTypes();
  const { data: volumes = [] } = useGetDrinkVolumes();
  const { data: containerTypes = [] } = useGetContainerTypes();
  const { data: ordersData = [] } = useGetOrdersReadable();

  // Transform data using DTO with language translations
  const drinkTypeOptions = useMemo(() => {
    const databaseOptions = SelectOptionDto.fromDrinkTypes(drinkTypes, language);
    const customOptions = SelectOptionDto.fromCustomItems(tempItems.drinkTypes, 'Custom');
    return SelectOptionDto.mergeOptions(databaseOptions, customOptions);
  }, [drinkTypes, tempItems.drinkTypes, language]);

  const volumeOptions = useMemo(() => {
    const databaseOptions = SelectOptionDto.fromVolumes(volumes, language);
    const customOptions = SelectOptionDto.fromCustomItems(tempItems.volumes, 'Custom');
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, 'volume');
    return SelectOptionDto.mergeOptions(databaseOptions, customOptions, ordersOptions);
  }, [volumes, tempItems.volumes, ordersData, language]);

  const containerTypeOptions = useMemo(() => {
    const databaseOptions = SelectOptionDto.fromContainerTypes(containerTypes, language);
    const customOptions = SelectOptionDto.fromCustomItems(tempItems.containerTypes, 'Custom');
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, 'containerType');
    return SelectOptionDto.mergeOptions(databaseOptions, customOptions, ordersOptions);
  }, [containerTypes, tempItems.containerTypes, ordersData, language]);

  // Handle field changes
  const handleFieldChange = (field: keyof AddOrderFormValues, value: string | number) => {
    setValue(field, value, { shouldValidate: true });
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
  const onFormSubmit = (data: AddOrderFormValues) => {
    onSubmit(data);
    // Reset form
    methods.reset();
    // Reset temp items too
    setTempItems({
      drinkTypes: [],
      volumes: [],
      containerTypes: [],
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Row className="row">
          <Col xs={12} md={12} className="col">
            <Flex gap="4" justify="between" className="b">
              {/* Mode */}
              <FieldWrapper label="Mode" required error={errors.mode}>
                <SimpleSelect
                  {...register('mode', { valueAsNumber: true })}
                  options={[1, 2, 3, 4, 5]}
                  placeholder="Select mode"
                  defaultValue={formValues.mode}
                  onSelect={(value) => handleFieldChange('mode', Number(value))}
                />
              </FieldWrapper>

              {/* Drink Type */}
              <FieldWrapper label="Drink Type" required error={errors.drinkType}>
                <SearchableSelect
                  value={formValues.drinkType}
                  onSelect={(value) => handleFieldChange('drinkType', value)}
                  onAddNew={(value) => handleAddNew('drinkTypes', value)}
                  options={drinkTypeOptions}
                  placeholder="e.g., Coffee, Tea, Juice"
                  windowSize={15}
                />
              </FieldWrapper>

              {/* Subtype */}
              <FieldWrapper label="Subtype">
                <SearchableSelect
                  value={formValues.drinkSubtype || ''}
                  onSelect={(value) => handleFieldChange('drinkSubtype', value)}
                  options={[]}
                  placeholder="Optional"
                  allowAddNew={false}
                  windowSize={10}
                />
              </FieldWrapper>

              {/* Volume */}
              <FieldWrapper label="Volume" required error={errors.volume}>
                <SearchableSelect
                  value={formValues.volume}
                  onSelect={(value) => handleFieldChange('volume', value)}
                  onAddNew={(value) => handleAddNew('volumes', value)}
                  options={volumeOptions}
                  placeholder="e.g., 250ml, 500ml, 1L"
                  windowSize={15}
                />
              </FieldWrapper>

              {/* Container Type */}
              <FieldWrapper label="Container" required error={errors.containerType}>
                <SearchableSelect
                  value={formValues.containerType}
                  onSelect={(value) => handleFieldChange('containerType', value)}
                  onAddNew={(value) => handleAddNew('containerTypes', value)}
                  options={containerTypeOptions}
                  placeholder="e.g., Cup, Bottle, Can"
                  windowSize={15}
                />
              </FieldWrapper>
            </Flex>
          </Col>

          {/* Form Actions */}
          <Col xs={12} md={12} className="col col-form-buttons">
            <Button type="submit" disabled={!isValid || isLoading} loading={isLoading} size="2">
              Add Order
            </Button>
          </Col>
        </Row>
      </form>
    </FormProvider>
  );
};
