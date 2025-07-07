import React, { useMemo, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Flex } from '@radix-ui/themes';
import { SelectSearchable } from 'forms/SelectSearchable/SelectSearchable';
import { SelectSimple } from 'forms/SelectSimple';
import { TemperatureInput } from 'forms/TemperatureInput';
import { TimeInput } from 'forms/TimeInput';
import { FieldWrapper } from 'forms/FieldWrapper';
import { useGetDrinkTypes } from 'queries/drink-types';
import { useGetDrinkVolumes } from 'queries/drink-volumes/useGetDrinkVolumes';
import { useGetContainerTypes } from 'queries/container-types';
import { useGetOrdersReadable } from 'api/hooks/useOrdersReadable';
import { SelectOptionDto } from 'types/models/select-option.model';
import { MIN_TEMP_DIFFERENCE } from 'constants/temperature.config';
import { Col, Row } from 'react-grid-system';
import { styles } from './OrdersForm.styles';

// Form validation schema
const timeRowSchema = z.object({
  tiempoA: z.coerce.number().int().min(0).max(3600).optional(), // 0 to 60 minutes in seconds
  tiempoB: z.coerce.number().int().min(0).max(3600).optional(),
  tiempoC: z.coerce.number().int().min(0).max(3600).optional(),
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
  .refine((data) => data.defaultTempFreeze <= data.defaultTempConsume - MIN_TEMP_DIFFERENCE, {
    message: `Freezing temperature must be at least ${MIN_TEMP_DIFFERENCE}°C below consumption temperature`,
    path: ['defaultTempFreeze'],
  });

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
        { tiempoA: undefined, tiempoB: undefined, tiempoC: undefined },
        { tiempoA: undefined, tiempoB: undefined, tiempoC: undefined },
        { tiempoA: undefined, tiempoB: undefined, tiempoC: undefined },
        { tiempoA: undefined, tiempoB: undefined, tiempoC: undefined },
      ],
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
  const handleFieldChange = (field: keyof OrdersFormValues, value: string | number) => {
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

  // Field array for time rows
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'timeRows',
  });

  // TimeTable component
  const TimeTable = () => {
    const isRowComplete = (index: number) => {
      const row = formValues.timeRows[index];
      return row?.tiempoA !== undefined && row?.tiempoB !== undefined && row?.tiempoC !== undefined;
    };

    const getEditableRowIndex = () => {
      // Find first incomplete row
      for (let i = 0; i < fields.length; i++) {
        if (!isRowComplete(i)) {
          return i;
        }
      }
      return -1; // All rows complete
    };

    const editableRowIndex = getEditableRowIndex();
    const canAddRow = editableRowIndex === -1; // All rows are complete
    const canDeleteRow = fields.length > 4;

    return (
      <div css={styles}>
        {/* Table Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: '8px',
            padding: '12px 16px',
            backgroundColor: 'var(--gray-4)',
            borderRadius: '6px 6px 0 0',
            border: '1px solid var(--gray-6)',
            borderBottom: 'none',
            fontWeight: '500',
            fontSize: '14px',
            color: 'var(--gray-11)',
          }}
        >
          <div>Tiempo A</div>
          <div>Tiempo B</div>
          <div>Tiempo C</div>
          <div style={{ width: '40px' }}></div>
        </div>

        {/* Table Rows */}
        {fields.map((field, index) => {
          const isEditable = index === editableRowIndex || isRowComplete(index);
          const isEven = index % 2 === 0;

          return (
            <div
              key={field.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr auto',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: isEven ? 'var(--gray-1)' : 'var(--gray-2)',
                border: '1px solid var(--gray-6)',
                borderTop: index === 0 ? '1px solid var(--gray-6)' : 'none',
                ...(index === fields.length - 1 && {
                  borderRadius: '0 0 6px 6px',
                }),
              }}
            >
              <div
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '14px',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                }}
              >
                <TimeInput
                  value={formValues.timeRows[index]?.tiempoA}
                  min={0}
                  max={3600}
                  step={30}
                  onTimeChange={(seconds) => {
                    setValue(`timeRows.${index}.tiempoA`, seconds, { shouldValidate: true });
                  }}
                  disabled={!isEditable}
                />
              </div>
              <div
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '14px',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                }}
              >
                <TimeInput
                  value={formValues.timeRows[index]?.tiempoB}
                  min={0}
                  max={3600}
                  step={30}
                  onTimeChange={(seconds) => {
                    setValue(`timeRows.${index}.tiempoB`, seconds, { shouldValidate: true });
                  }}
                  disabled={!isEditable}
                />
              </div>
              <div
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '14px',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                }}
              >
                <TimeInput
                  value={formValues.timeRows[index]?.tiempoC}
                  min={0}
                  max={3600}
                  step={30}
                  onTimeChange={(seconds) => {
                    setValue(`timeRows.${index}.tiempoC`, seconds, { shouldValidate: true });
                  }}
                  disabled={!isEditable}
                />
              </div>
              <div style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
                {canDeleteRow && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="1"
                    color="red"
                    onClick={() => remove(index)}
                    style={{ opacity: 0.7, padding: '4px' }}
                  >
                    ×
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Row Button */}
        {canAddRow && (
          <div style={{ padding: '12px 16px', textAlign: 'center' }}>
            <Button
              type="button"
              variant="soft"
              size="2"
              onClick={() => append({ tiempoA: undefined, tiempoB: undefined, tiempoC: undefined })}
            >
              + Add Row
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Row className="row">
          <Col xs={8} md={8} className="col col-form-fields">
            <Row className="row">
              {/* ======================================================================== */}

              <Col xs={12} md={12} className="col col-form-fields">
                <Flex gap="4" justify="between" className="b">
                  {/* Drink Type */}
                  <FieldWrapper label="Drink Type" required error={errors.drinkType}>
                    <SelectSearchable
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
                    <SelectSearchable
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
                  <FieldWrapper label="Volume" required error={errors.volume}>
                    <SelectSearchable
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
                    <SelectSearchable
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
                  <FieldWrapper label="Mode" required error={errors.mode}>
                    <SelectSimple
                      {...register('mode')}
                      className="mode-select"
                      options={[1, 2, 3, 4, 5]}
                      placeholder="Select mode"
                      defaultValue={formValues.mode}
                      onSelect={(value) => handleFieldChange('mode', Number(value))}
                    />
                  </FieldWrapper>

                  <FieldWrapper label="Temperatura consumo" required error={errors.defaultTempConsume}>
                    <TemperatureInput
                      {...register('defaultTempConsume')}
                      min={-40}
                      max={40}
                      step={0.5}
                      defaultValue={formValues.defaultTempConsume}
                    />
                  </FieldWrapper>

                  <FieldWrapper label="Temperatura congelación" required error={errors.defaultTempFreeze}>
                    <TemperatureInput
                      {...register('defaultTempFreeze')}
                      min={-50}
                      max={formValues.defaultTempConsume - MIN_TEMP_DIFFERENCE}
                      step={0.5}
                      defaultValue={formValues.defaultTempFreeze}
                    />
                  </FieldWrapper>
                </Flex>
              </Col>

              {/* ======================================================================== */}

              <Col xs={12} md={12} className="col col-form-fields">
                <TimeTable />
              </Col>
            </Row>
          </Col>

          <Col xs={4} md={4} className="col col-form-buttons">
            <pre>{JSON.stringify(formValues, null, 2)}</pre>
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
