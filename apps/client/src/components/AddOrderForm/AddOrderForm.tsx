import React, { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Flex } from '@radix-ui/themes';
import { SearchableSelect } from 'pages/AdminPages/AdminOrdersPage/SearchableSelect/SearchableSelect';
import { SelectSimple } from 'forms/SelectSimple';
import { TemperatureInput } from 'forms/TemperatureInput';
import { TimeInput } from 'forms/TimeInput';
import { FieldWrapper } from 'components/FieldWrapper';
import { useGetDrinkTypes } from 'queries/drink-types';
import { useGetDrinkVolumes } from 'queries/drink-volumes/useGetDrinkVolumes';
import { useGetContainerTypes } from 'queries/container-types';
import { useGetOrdersReadable } from 'api/hooks/useOrdersReadable';
import { SelectOptionDto } from 'types/models/select-option.model';
import { MIN_TEMP_DIFFERENCE } from 'constants/temperature.config';
import { Col, Row } from 'react-grid-system';

// Form validation schema
const addOrderSchema = z
  .object({
    mode: z.coerce.number().int().min(1).max(5),
    drinkType: z.string().min(1, 'Drink type is required'),
    drinkSubtype: z.string().optional(),
    volume: z.string().min(1, 'Volume is required'),
    containerType: z.string().min(1, 'Container type is required'),
    defaultTempConsume: z.coerce.number().min(-40).max(40),
    defaultTempFreeze: z.coerce.number().min(-50).max(40),
    preparationTime: z.coerce.number().int().min(0).max(3600), // 0 to 60 minutes in seconds
  })
  .refine((data) => data.defaultTempFreeze <= data.defaultTempConsume - MIN_TEMP_DIFFERENCE, {
    message: `Freezing temperature must be at least ${MIN_TEMP_DIFFERENCE}°C below consumption temperature`,
    path: ['defaultTempFreeze'],
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
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(addOrderSchema),
    defaultValues: {
      mode: 4,
      drinkType: '',
      drinkSubtype: '',
      volume: '',
      containerType: '',
      defaultTempConsume: 5,
      defaultTempFreeze: -2,
      preparationTime: 90, // 1:30 in seconds
    },
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

    // Handle temperature constraints: consumption temp controls max freezing temp
    if (field === 'defaultTempConsume') {
      const consumeTemp = Number(value);
      const currentFreezeTemp = formValues.defaultTempFreeze;
      const maxFreezeTemp = consumeTemp - MIN_TEMP_DIFFERENCE;

      // Adjust freezing temp if it violates the constraint
      if (currentFreezeTemp > maxFreezeTemp) {
        setValue('defaultTempFreeze', maxFreezeTemp, { shouldValidate: true });
      }
    }
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
          <Col xs={9} md={9} className="col col-form-fields">
            <Row className="row">
              {/* ======================================================================== */}

              <Col xs={12} md={12} className="col col-form-fields">
                <Flex gap="4" justify="between" className="b">
                  {/* Drink Type */}
                  <FieldWrapper label="Drink Type" required error={errors.drinkType} style={{ flex: 1 }}>
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
                  <FieldWrapper label="Subtype" style={{ flex: 1 }}>
                    <SearchableSelect
                      value={formValues.drinkSubtype || ''}
                      onSelect={(value) => handleFieldChange('drinkSubtype', value)}
                      options={[]}
                      placeholder="Optional"
                      allowAddNew={false}
                      windowSize={10}
                    />
                  </FieldWrapper>
                </Flex>
              </Col>

              {/* ======================================================================== */}

              <Col xs={12} md={12} className="col col-form-fields">
                <Flex gap="4" justify="between" className="b">
                  {/* Volume */}
                  <FieldWrapper label="Volume" required error={errors.volume} style={{ flex: 1 }}>
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
                  <FieldWrapper label="Container" required error={errors.containerType} style={{ flex: 1 }}>
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

              {/* ======================================================================== */}

              <Col xs={12} md={12} className="col col-form-fields">
                <Flex gap="4" className="b">
                  {/* Mode */}
                  <FieldWrapper label="Mode" required error={errors.mode} style={{ flex: 1 }}>
                    <SelectSimple
                      {...register('mode')}
                      className="mode-select"
                      options={[1, 2, 3, 4, 5]}
                      placeholder="Select mode"
                      defaultValue={formValues.mode}
                      onSelect={(value) => handleFieldChange('mode', Number(value))}
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Temperatura consumo"
                    required
                    error={errors.defaultTempConsume}
                    style={{ flex: 1 }}
                  >
                    <TemperatureInput
                      {...register('defaultTempConsume')}
                      min={-40}
                      max={40}
                      step={0.5}
                      defaultValue={formValues.defaultTempConsume}
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Temperatura congelación"
                    required
                    error={errors.defaultTempFreeze}
                    style={{ flex: 1 }}
                  >
                    <TemperatureInput
                      {...register('defaultTempFreeze')}
                      min={-50}
                      max={formValues.defaultTempConsume - MIN_TEMP_DIFFERENCE}
                      step={0.5}
                      defaultValue={formValues.defaultTempFreeze}
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Tiempo de preparación"
                    required
                    error={errors.preparationTime}
                    style={{ flex: 1 }}
                  >
                    <input
                      {...register('preparationTime')}
                      type="hidden"
                      value={formValues.preparationTime}
                    />
                    <TimeInput
                      value={formValues.preparationTime}
                      min={0}
                      max={3600}
                      step={30}
                      onTimeChange={(seconds) => handleFieldChange('preparationTime', seconds)}
                    />
                  </FieldWrapper>
                </Flex>
              </Col>
            </Row>
          </Col>

          <Col xs={3} md={3} className="col col-form-buttons">
            <Button
              type="submit"
              style={{ padding: '1rem 3rem' }}
              // disabled={!isValid || isLoading}
              loading={isLoading}
              size="3"
            >
              Añadir
            </Button>
          </Col>
        </Row>
      </form>
    </FormProvider>
  );
};
