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
  type OrdersFormValues as MiddlewareOrdersFormValues,
  ordersFormFieldConfigs,
} from 'forms/FormMiddleware/OrdersFormFieldConfigs';
import { Col, Row } from 'react-grid-system';
import { MIN_TEMP_DIFFERENCE } from 'constants/temperature.config';
import { useDev } from 'providers/DevProvider';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import { useContent } from 'providers/ContentProvider/ContentContext';

// Import utilities
import {
  createMockDataHandlers,
  createTempItemHandlers,
  isRowComplete,
  PROFILE_ITEM_VALUES_EMPTY,
  type TempItems,
  type TimeRow,
  useDropdownData,
} from './orders-form.utils';
import {
  createFormSubmissionHandler,
  getSubmissionLoadingState,
  useFormSubmissionMutations,
} from './orders-form.submission';

// ============================================================================
// Form Schema & Types
// ============================================================================

const timeRowSchema = z.object({
  temperature: z.coerce.number().min(-50).max(50).optional(),
  timeA: z.coerce.number().int().min(0).max(3600).optional(),
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
        path: ['timeRows'],
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

// ============================================================================
// Component Props
// ============================================================================

interface OrdersFormProps {
  onSubmit: (formData: OrdersFormValues) => void;
  isLoading?: boolean;
  language?: string;
  orderData?: OrderReadableModel;
  isEditMode?: boolean;
  onNavigateBack?: () => void;
}

// ============================================================================
// Main Component
// ============================================================================

export const OrdersForm: React.FC<OrdersFormProps> = ({
  onSubmit,
  isLoading = false,
  language = 'es-ES',
  orderData,
  isEditMode = false,
  onNavigateBack,
}) => {
  // ========================================================================
  // State & Context
  // ========================================================================

  const [tempItems, setTempItems] = useState<TempItems>({
    drinkTypes: [],
    drinkSubtypes: [],
    volumes: [],
    containerTypes: [],
  });
  const [canAddRow, setCanAddRow] = useState(false);

  const { isDevToolsVisible } = useDev();
  const { currentLanguage } = useContent();

  // ========================================================================
  // Form Setup
  // ========================================================================

  const methods = useForm<OrdersFormValues>({
    mode: 'onChange',
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
        const existingProfiles =
          isEditMode && orderData?.temperatureProfiles?.length
            ? orderData.temperatureProfiles.map((profile) => ({
                temperature: profile.temperature,
                timeA: profile.timeA,
                timeB: profile.timeB,
                timeC: profile.timeC,
              }))
            : [];

        const emptyRowsNeeded = MIN_TABLE_ROWS - existingProfiles.length;
        const emptyRows = Array.from(
          { length: Math.max(0, emptyRowsNeeded) },
          () => PROFILE_ITEM_VALUES_EMPTY,
        );

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

  const { append } = useFieldArray({
    control,
    name: 'timeRows',
  });

  const formValues = watch();

  // ========================================================================
  // Data & Mutations
  // ========================================================================

  const dropdownData = useDropdownData({
    language,
    tempItems,
    formDrinkType: formValues.drinkType,
  });

  const mutations = useFormSubmissionMutations();
  const isSubmitLoading = getSubmissionLoadingState(mutations);

  // ========================================================================
  // Handlers
  // ========================================================================

  const tempItemHandlers = createTempItemHandlers(setTempItems);

  const mockDataHandlers = createMockDataHandlers({
    drinkTypeOptions: dropdownData.drinkTypeOptions,
    volumeOptions: dropdownData.volumeOptions,
    containerTypeOptions: dropdownData.containerTypeOptions,
    setValue,
    defaultTempFreeze: formValues.defaultTempFreeze,
  });

  const formSubmissionHandler = createFormSubmissionHandler(mutations, {
    drinkTypes: dropdownData.drinkTypes,
    volumes: dropdownData.volumes,
    containerTypes: dropdownData.containerTypes,
    tempItems,
    findIdByName: dropdownData.findIdByName,
    orderData,
    isEditMode,
    onSubmit,
    resetForm: () => {
      methods.reset();
      setTempItems({
        drinkTypes: [],
        drinkSubtypes: [],
        volumes: [],
        containerTypes: [],
      });
    },
    setTempItems,
  });

  // ========================================================================
  // Form Field Handlers
  // ========================================================================

  const handleFieldChange = (fieldName: string, value: any, allFormValues: MiddlewareOrdersFormValues) => {
    if (fieldName === 'defaultTempConsume') {
      const currentFreezeTemp = allFormValues.defaultTempFreeze;
      const maxFreezeTemp = value - MIN_TEMP_DIFFERENCE;

      if (currentFreezeTemp > maxFreezeTemp) {
        setValue('defaultTempFreeze', maxFreezeTemp, { shouldValidate: true });
      }
    }
  };

  const handleSimpleFieldChange = (field: keyof OrdersFormValues, value: string | number) => {
    setValue(field, value, { shouldValidate: true, shouldDirty: true });
    handleFieldChange(field, value, formValues as MiddlewareOrdersFormValues);
  };

  const handleAddSubtype = async (value: string) => {
    return tempItemHandlers.handleAddSubtype(value, formValues.drinkType);
  };

  // ========================================================================
  // Table & Row Management
  // ========================================================================

  const handleCanAddRowChange = useCallback((canAdd: boolean) => {
    setCanAddRow(canAdd);
  }, []);

  const handleAddRow = useCallback(() => {
    append(PROFILE_ITEM_VALUES_EMPTY);
  }, [append]);

  const handleMockAllRows = useCallback(() => {
    const currentRows = formValues.timeRows || [];
    currentRows.forEach((_, index) => {
      mockDataHandlers.generateRandomValuesForRow(index);
    });
  }, [formValues.timeRows, mockDataHandlers]);

  // ========================================================================
  // Dev Tools Handlers
  // ========================================================================

  const handleMockPartial = useCallback(() => {
    const formValues = mockDataHandlers.handleMockPartial();
    methods.reset(formValues, {
      keepDirty: true,
      keepErrors: false,
      keepTouched: false,
      keepIsSubmitted: false,
      keepSubmitCount: false,
    });
    methods.trigger();
  }, [mockDataHandlers, methods]);

  const handleMockTwoRows = useCallback(() => {
    const formValues = mockDataHandlers.handleMockTwoRows();
    methods.reset(formValues, {
      keepDirty: true,
      keepErrors: false,
      keepTouched: false,
      keepIsSubmitted: false,
      keepSubmitCount: false,
    });
    methods.trigger();
  }, [mockDataHandlers, methods]);

  const handleMockClick = useCallback(() => {
    mockDataHandlers.handleMockValues();
  }, [mockDataHandlers]);

  // ========================================================================
  // Filtered Form Values for Display
  // ========================================================================

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

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <FormProvider {...methods}>
      <FormMiddlewareProvider
        formMethods={methods}
        fieldConfigs={ordersFormFieldConfigs}
        defaultLocale={language}
        onFieldChange={handleFieldChange}
      >
        <form onSubmit={handleSubmit(formSubmissionHandler)} noValidate>
          <Row className="row">
            <Col xs={9} md={9} className="col">
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
                    hint={`${dropdownData.drinkTypeOptions.length} disponibles`}
                    required
                  >
                    <SelectSearchable
                      value={formValues.drinkType}
                      onSelect={(value) => {
                        handleSimpleFieldChange('drinkType', value);
                        handleSimpleFieldChange('drinkSubtype', '');
                      }}
                      onClear={() => {
                        handleSimpleFieldChange('drinkType', '');
                        handleSimpleFieldChange('drinkSubtype', '');
                      }}
                      onAddNew={(value) => tempItemHandlers.handleAddNew('drinkTypes', value)}
                      options={dropdownData.drinkTypeOptions}
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
                      formValues.drinkType
                        ? `${dropdownData.drinkSubtypeOptions.length} disponibles`
                        : 'Select drink type first'
                    }
                  >
                    <SelectSearchable
                      value={formValues.drinkSubtype}
                      onSelect={(value) => handleSimpleFieldChange('drinkSubtype', value)}
                      onClear={() => handleSimpleFieldChange('drinkSubtype', '')}
                      onAddNew={handleAddSubtype}
                      options={dropdownData.drinkSubtypeOptions}
                      placeholder={
                        formValues.drinkType ? 'Select or add new subtype' : 'Select drink type first'
                      }
                      windowSize={15}
                      disabled={!formValues.drinkType}
                    />
                  </FieldWrapper>
                </Col>
              </Row>

              <Row className="row">
                <Col xs={4} md={4} className="col col-form-fields">
                  {/* Volume */}
                  <FieldWrapper
                    name="volume"
                    label="Volume"
                    hint={`${dropdownData.volumeOptions.length} disponibles`}
                    required
                  >
                    <SelectSearchable
                      value={formValues.volume}
                      onSelect={(value) => handleSimpleFieldChange('volume', value)}
                      onClear={() => handleSimpleFieldChange('volume', '')}
                      onAddNew={(value) => tempItemHandlers.handleAddNew('volumes', value)}
                      options={dropdownData.volumeOptions}
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
                    hint={`${dropdownData.containerTypeOptions.length} disponibles`}
                    required
                  >
                    <SelectSearchable
                      value={formValues.containerType}
                      onSelect={(value) => handleSimpleFieldChange('containerType', value)}
                      onClear={() => handleSimpleFieldChange('containerType', '')}
                      onAddNew={(value) => tempItemHandlers.handleAddNew('containerTypes', value)}
                      options={dropdownData.containerTypeOptions}
                      placeholder="e.g., Cup, Bottle, Can"
                      windowSize={15}
                    />
                  </FieldWrapper>
                </Col>

                <Col xs={2} md={2} className="col col-form-fields">
                  {/* Temperatura consumo */}
                  <FieldWrapper name="defaultTempConsume" label="Temperatura consumo" required>
                    <InputTemperature name="defaultTempConsume" />
                  </FieldWrapper>
                </Col>

                <Col xs={2} md={2} className="col col-form-fields">
                  {/* Temperatura congelación */}
                  <FieldWrapper name="defaultTempFreeze" label="Temperatura congelación" required>
                    <InputTemperature name="defaultTempFreeze" />
                  </FieldWrapper>
                </Col>
              </Row>

              <Col xs={12} md={12} className="col col-form-fields col-form-table">
                <TimesRepeaterTable
                  name="timeRows"
                  emptyRowValues={PROFILE_ITEM_VALUES_EMPTY}
                  minRows={MIN_TABLE_ROWS}
                  minVisibleRows={MIN_TABLE_VISIBLE_ROWS}
                  language={language}
                  onCanAddRowChange={handleCanAddRowChange}
                  onGenerateRandomValues={mockDataHandlers.generateRandomValuesForRow}
                />
              </Col>
            </Col>

            <Col xs={3} md={3} className="col">
              <pre>{JSON.stringify(filteredFormValues, null, 2)}</pre>
            </Col>
          </Row>

          <Row className="row">
            <Col xs={12} md={12} className="col col-form-buttons">
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {/* Left side buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
