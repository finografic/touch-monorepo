import React, { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@radix-ui/themes';
import { SelectSearchable } from 'forms/SelectSearchable/SelectSearchable';
import { SelectSimple } from 'forms/SelectSimple';
import { InputTemperature } from 'forms/InputTemperature';
import { InputTemperatureMiddleware } from 'forms/InputTemperatureMiddleware';
import { FormMiddlewareProvider } from 'forms/FormMiddleware/FormMiddleware.simple';
import { FieldWrapper } from 'forms/FieldWrapper';
import { TimesTableRepeater } from 'forms/TimesTableRepeater';
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

const PROFILE_ITEM_VALUES_EMPTY = {
  temperature: undefined,
  time_a: undefined,
  time_b: undefined,
  time_c: undefined,
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
}

export const OrdersForm: React.FC<OrdersFormProps> = ({
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
  const methods = useForm<OrdersFormValues>({
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
      timeRows: [
        PROFILE_ITEM_VALUES_EMPTY,
        PROFILE_ITEM_VALUES_EMPTY,
        PROFILE_ITEM_VALUES_EMPTY,
        PROFILE_ITEM_VALUES_EMPTY,
      ],
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { isValid },
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
    console.log(`Field ${fieldName} changed to:`, value);

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
            <Col xs={10} md={10} className="col col-form-fields">
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
                <Col xs={5} md={5} className="col col-form-fields">
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

                <Col xs={3} md={3} className="col col-form-fields">
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
                    <InputTemperatureMiddleware name="defaultTempConsume" />
                  </FieldWrapper>
                </Col>

                <Col xs={2} md={2} className="col col-form-fields">
                  {/* Temperatura congelación - MIDDLEWARE MAGIC WITH DYNAMIC CONSTRAINTS! */}
                  <FieldWrapper name="defaultTempFreeze" label="Temperatura congelación" required>
                    <InputTemperatureMiddleware name="defaultTempFreeze" />
                  </FieldWrapper>
                </Col>
              </Row>

              {/* ======================================================================== */}

              <Col xs={12} md={12} className="col col-form-fields">
                <TimesTableRepeater
                  name="timeRows"
                  emptyRowValues={PROFILE_ITEM_VALUES_EMPTY}
                  minRows={4}
                  language={language}
                />
              </Col>

              {/* ======================================================================== */}
            </Col>
            <Col xs={2} md={2} className="col col-form-buttons">
              <pre style={{ overflow: 'visible', transform: 'translateX(-30%)' }}>
                {JSON.stringify(formValues, null, 2)}
              </pre>
              <Button
                type="submit"
                style={{ padding: '1rem 3rem' }}
                // disabled={!isValid || isLoading}
                loading={isLoading}
                size="3"
              >
                SAVE
              </Button>
            </Col>
          </Row>
        </form>
      </FormMiddlewareProvider>
    </FormProvider>
  );
};
