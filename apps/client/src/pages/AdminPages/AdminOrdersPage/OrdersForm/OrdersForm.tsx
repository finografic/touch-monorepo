import React, { useCallback, useMemo, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@radix-ui/themes';
import { SelectSearchable } from 'forms/SelectSearchable/SelectSearchable';
import { SelectSimple } from 'forms/SelectSimple';
import { InputTemperature } from 'forms/InputTemperature';
import { FormMiddlewareProvider } from 'forms/FormMiddleware/FormMiddleware.simple';
import { FieldWrapper } from 'forms/FieldWrapper';
import { TimesTableRepeater } from 'forms/TimesTableRepeater';
import { MIN_TABLE_ROWS, MIN_TABLE_VISIBLE_ROWS } from 'forms/FormMiddleware/FormMiddleware.constants';
import { useGetDrinkTypes } from 'queries/drink-types';
import { useGetDrinkVolumes } from 'queries/drink-volumes/useGetDrinkVolumes';
import { useGetContainerTypes } from 'queries/container-types';
import { useGetOrdersReadable } from 'api/hooks/useOrdersReadable';
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

const PROFILE_ITEM_VALUES_EMPTY = {
  temperature: undefined,
  time_a: undefined,
  time_b: undefined,
  time_c: undefined,
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

// Form validation schema
const timeRowSchema = z.object({
  temperature: z.coerce.number().min(-50).max(50).optional(), // Temperature in Celsius
  time_a: z.coerce.number().int().min(0).max(3600).optional(), // 0 to 60 minutes in seconds
  time_b: z.coerce.number().int().min(0).max(3600).optional(),
  time_c: z.coerce.number().int().min(0).max(3600).optional(),
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
    timeRows: z.array(timeRowSchema).min(1),
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

interface TempItems {
  drinkTypes: string[];
  volumes: string[];
  containerTypes: string[];
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
    volumes: [],
    containerTypes: [],
  });

  // State to track if we can add new rows
  const [canAddRow, setCanAddRow] = useState(false);

  // Dev tools visibility
  const { isDevToolsVisible } = useDev();

  // RHF setup
  const methods = useForm<OrdersFormValues>({
    mode: 'onSubmit',
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
      timeRows: Array.from({ length: MIN_TABLE_ROWS }, () => PROFILE_ITEM_VALUES_EMPTY),
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    control,
    formState: { isValid },
  } = methods;

  // Field array for adding rows externally
  const { append } = useFieldArray({
    control,
    name: 'timeRows',
  });

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
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, OrderFieldKeys.drinkVolume);
    return SelectOptionDto.mergeOptions(databaseOptions, customOptions, ordersOptions);
  }, [volumes, tempItems.volumes, ordersData, language]);

  const containerTypeOptions = useMemo(() => {
    const databaseOptions = SelectOptionDto.fromContainerTypes(containerTypes, language);
    const customOptions = SelectOptionDto.fromCustomItems(tempItems.containerTypes, 'Custom');
    const ordersOptions = SelectOptionDto.fromOrdersData(ordersData, OrderFieldKeys.containerType);
    return SelectOptionDto.mergeOptions(databaseOptions, customOptions, ordersOptions);
  }, [containerTypes, tempItems.containerTypes, ordersData, language]);

  // Handle form submission
  const onFormSubmit = (data: OrdersFormValues) => {
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
    setValue(field, value, { shouldValidate: true });
    // Call the middleware-compatible version
    handleFieldChange(field, value, formValues as MiddlewareOrdersFormValues);
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

      setValue(`timeRows.${rowIndex}.temperature`, randomTemp, { shouldValidate: true });
      setValue(`timeRows.${rowIndex}.time_a`, randomTimeA, { shouldValidate: true });
      setValue(`timeRows.${rowIndex}.time_b`, randomTimeB, { shouldValidate: true });
      setValue(`timeRows.${rowIndex}.time_c`, randomTimeC, { shouldValidate: true });
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
            <Col xs={12} md={12} className="col">
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
                  <FieldWrapper name="drinkType" label="Drink Type" required>
                    <SelectSearchable
                      value={formValues.drinkType}
                      onSelect={(value) => handleSimpleFieldChange('drinkType', value)}
                      onAddNew={(value) => handleAddNew('drinkTypes', value)}
                      options={drinkTypeOptions}
                      placeholder="e.g., Coffee, Tea, Juice"
                      windowSize={15}
                    />
                  </FieldWrapper>
                </Col>

                <Col xs={5} md={5} className="col col-form-fields">
                  {/* Drink Subtype */}
                  <FieldWrapper name="drinkSubtype" label="Drink Subtype">
                    <SelectSearchable
                      value={formValues.drinkSubtype}
                      onSelect={(value) => handleSimpleFieldChange('drinkSubtype', value)}
                      onAddNew={(value) => handleAddNew('drinkTypes', value)}
                      options={drinkTypeOptions}
                      placeholder="Optional variant"
                      windowSize={15}
                    />
                  </FieldWrapper>
                </Col>
              </Row>

              {/* ======================================================================== */}

              <Row className="row">
                <Col xs={4} md={4} className="col col-form-fields">
                  {/* Volume */}
                  <FieldWrapper name="volume" label="Volume" required>
                    <SelectSearchable
                      value={formValues.volume}
                      onSelect={(value) => handleSimpleFieldChange('volume', value)}
                      onAddNew={(value) => handleAddNew('volumes', value)}
                      options={volumeOptions}
                      placeholder="e.g., 250ml, 500ml, 1L"
                      windowSize={15}
                    />
                  </FieldWrapper>
                </Col>

                <Col xs={4} md={4} className="col col-form-fields">
                  {/* Container Type */}
                  <FieldWrapper name="containerType" label="Container" required>
                    <SelectSearchable
                      value={formValues.containerType}
                      onSelect={(value) => handleSimpleFieldChange('containerType', value)}
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
                <TimesTableRepeater
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
          </Row>
          <Row className="row">
            <Col xs={12} md={12} className="col col-form-buttons">
              {/* <pre style={{ overflow: 'visible', transform: 'translateX(-30%)' }}>
                {JSON.stringify(formValues, null, 2)}
              </pre> */}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                {/* Back button for edit mode - far left */}
                {isEditMode && (
                  <Button type="button" variant="soft" size="3" onClick={onNavigateBack}>
                    ← Back to Orders
                  </Button>
                )}

                {/* Right side buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
                  {/* Dev Tools: Mock All Rows Button */}
                  {isDevToolsVisible && (
                    <Button type="button" variant="soft" size="3" onClick={handleMockAllRows} color="gray">
                      🎲 Mock All Rows
                    </Button>
                  )}

                  {/* Add Row Button */}
                  <Button type="button" variant="soft" size="3" onClick={handleAddRow} disabled={!canAddRow}>
                    + Add Row
                  </Button>

                  <Button
                    type="submit"
                    style={{ padding: '1rem 3rem' }}
                    // disabled={!isValid || isLoading}
                    loading={isLoading}
                    size="3"
                    color={isEditMode ? 'orange' : undefined}
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
