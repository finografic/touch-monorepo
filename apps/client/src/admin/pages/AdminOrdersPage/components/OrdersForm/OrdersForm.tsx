import React, { useCallback, useMemo, useState } from 'react';
import { Col, Row } from 'react-grid-system';
import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Panel } from 'primereact/panel';
import { InputNumber } from 'primereact/inputnumber';
import {
  ORDER_FORM_SCHEMA,
  type OrdersFormValues,
} from 'admin/pages/AdminOrdersPage/components/OrdersForm/OrdersForm.schema';
import { TimesRepeaterTable } from 'admin/pages/AdminOrdersPage/components/TimesRepeaterTable';
import { FieldWrapper } from 'forms/FieldWrapper';
import { FormMiddlewareProvider } from 'forms/FormMiddleware';
import {
  DEFAULT_TEMP_MAX,
  DEFAULT_TEMP_MIN,
  MIN_TABLE_ROWS,
  MIN_TABLE_VISIBLE_ROWS,
  TEMP_STEP,
} from 'forms/FormMiddleware/FormMiddleware.constants';
import {
  ordersFormFieldConfigs,
  type OrdersFormValues as MiddlewareOrdersFormValues,
} from 'forms/FormMiddleware/OrdersFormFieldConfigs';
import { SelectCustom } from 'forms/SelectCustom';
import { SelectSearchable } from 'forms/SelectSearchable/SelectSearchable';
import { useToast } from 'components/Toast';
import { Text } from '@radix-ui/themes';

import { EditIcon, BadgeCheckIcon } from 'styles/icons';

import { useAppConfig } from 'providers/AppConfigProvider';

import type { OrderReadableModel } from 'types/models/order-readable.model';
import { MIN_TEMP_DIFFERENCE } from 'config/app';
import { OrdersFormDevTools } from '../OrderFormDevTools/OrdersFormDevTools';
import {
  createFormSubmissionHandler,
  getSubmissionLoadingState,
  useFormSubmissionMutations,
} from './orders-form.submission';
import {
  createMockDataHandlers,
  createTempItemHandlers,
  PROFILE_ITEM_VALUES_EMPTY,
  type TempItems,
  useDropdownData,
} from './orders-form.utils';
import { styles } from './OrdersForm.styles';

import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';

// ============================================================================
// Form Schema & Types
// ============================================================================

interface OrdersFormProps {
  onSubmit: (formData: OrdersFormValues) => void;
  isLoading?: boolean;
  language?: string;
  orderData?: OrderReadableModel;
  isEditMode?: boolean;
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
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const { currentLanguage } = useAppConfig();

  // ========================================================================
  // Form Setup
  // ========================================================================

  console.log('orderData', orderData);

  const methods = useForm<OrdersFormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(ORDER_FORM_SCHEMA),
    defaultValues: {
      modeId: orderData?.mode || '',
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
    modeOptions: dropdownData.modeOptions,
  });

  const formSubmissionHandler = async (data: OrdersFormValues) => {
    try {
      await createFormSubmissionHandler(mutations, {
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
      })(data);
      // Show success message
      toast({
        variant: 'success',
        message: isEditMode ? 'Order updated successfully!' : 'Order added successfully!',
      });

      // Reset all form state
      methods.reset({
        modeId: '',
        drinkType: '',
        drinkSubtype: '',
        volume: '',
        containerType: '',
        defaultTempConsume: 5,
        defaultTempFreeze: -2,
        timeRows: Array.from({ length: MIN_TABLE_ROWS }, () => PROFILE_ITEM_VALUES_EMPTY),
      });

      // Reset temp items
      setTempItems({
        drinkTypes: [],
        drinkSubtypes: [],
        volumes: [],
        containerTypes: [],
      });

      // Navigate after a small delay to ensure state is cleared
      setTimeout(() => {
        navigate('/admin/items', { replace: true });
      }, 500);
    } catch (error) {
      toast({
        variant: 'error',
        message: 'Failed to submit order',
        subText: error instanceof Error ? error.message : 'An error occurred while submitting the order.',
      });
      throw error;
    }
  };

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

  // Calculate number of populated rows (rows with at least one non-empty field)
  const populatedRowsCount = useMemo(() => {
    return (
      formValues.timeRows?.filter((row) => {
        return (
          row.temperature !== undefined ||
          row.timeA !== undefined ||
          row.timeB !== undefined ||
          row.timeC !== undefined
        );
      }).length || 0
    );
  }, [formValues.timeRows]);

  const selectedModeId = useMemo(() => {
    if (dropdownData?.modeOptions) {
      const modeLabels = dropdownData.modeOptions.map((option) => option.label);
      if (modeLabels.includes(String(formValues?.modeId))) {
        const selectedModeId = dropdownData.modeOptions.find(
          (option) => option.label === String(formValues?.modeId),
        )?.value;

        return selectedModeId;
      }

      return formValues.modeId;
    }
  }, [formValues.modeId]);

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <section css={styles} className="admin-page-content form-container">
      <FormProvider {...methods}>
        <FormMiddlewareProvider<OrdersFormValues>
          formMethods={methods}
          fieldConfigs={ordersFormFieldConfigs as any}
          defaultLocale={language}
          onFieldChange={handleFieldChange}
        >
          <form id="order-form" onSubmit={handleSubmit(formSubmissionHandler)} noValidate>
            <Row className="row">
              <Col xs={12} md={12} className="col">
                <Row className="row">
                  <Col xs={2} md={2} className="col col-form-fields">
                    {/* Mode */}
                    <FieldWrapper name="mode" label="Mode" required>
                      <SelectCustom
                        {...register('modeId')}
                        className="mode-select"
                        options={dropdownData.modeOptions}
                        placeholder="Select mode"
                        value={selectedModeId}
                        onSelect={(value) => {
                          handleSimpleFieldChange('modeId', value);
                        }}
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
                      <Controller
                        name="defaultTempConsume"
                        control={control}
                        render={({ field }) => (
                          <div className="p-inputgroup">
                            <InputNumber
                              id={field.name}
                              value={field.value}
                              onValueChange={(e) => {
                                field.onChange(e.value);
                                // Manually trigger the dynamic constraint check
                                handleFieldChange(
                                  'defaultTempConsume',
                                  e.value,
                                  formValues as MiddlewareOrdersFormValues,
                                );
                              }}
                              locale={currentLanguage}
                              showButtons
                              buttonLayout="stacked"
                              step={TEMP_STEP}
                              min={DEFAULT_TEMP_MIN}
                              max={DEFAULT_TEMP_MAX}
                              minFractionDigits={1}
                              maxFractionDigits={1}
                              placeholder="Temperature"
                              style={{ width: '100%' }}
                            />
                            <span className="p-inputgroup-addon">°C</span>
                          </div>
                        )}
                      />
                    </FieldWrapper>
                  </Col>

                  <Col xs={2} md={2} className="col col-form-fields">
                    {/* Temperatura congelación */}
                    <FieldWrapper name="defaultTempFreeze" label="Temperatura congelación" required>
                      <Controller
                        name="defaultTempFreeze"
                        control={control}
                        render={({ field }) => {
                          // Dynamic max: must be at least MIN_TEMP_DIFFERENCE below consume temp
                          const dynamicMax = formValues.defaultTempConsume
                            ? formValues.defaultTempConsume - MIN_TEMP_DIFFERENCE
                            : DEFAULT_TEMP_MAX;

                          return (
                            <div className="p-inputgroup">
                              <InputNumber
                                id={field.name}
                                value={field.value}
                                onValueChange={(e) => field.onChange(e.value)}
                                locale={currentLanguage}
                                showButtons
                                buttonLayout="stacked"
                                step={TEMP_STEP}
                                min={DEFAULT_TEMP_MIN}
                                max={dynamicMax}
                                minFractionDigits={1}
                                maxFractionDigits={1}
                                placeholder="Temperature"
                                style={{ width: '100%' }}
                              />
                              <span className="p-inputgroup-addon">°C</span>
                            </div>
                          );
                        }}
                      />
                    </FieldWrapper>
                  </Col>
                </Row>

                <Col xs={12} md={12} className="col col-form-fields col-form-table">
                  {/* Panel with Temperature Profiles Table */}
                  <Panel
                    headerTemplate={(options) => {
                      const toggleIcon = isPanelCollapsed ? (
                        <EditIcon className="panel-toggle-icon" />
                      ) : (
                        <BadgeCheckIcon className="panel-toggle-icon" />
                      );

                      return (
                        <div className={options.className}>
                          <span className={options.titleClassName}>Temperature Profiles</span>
                          <button
                            className={options.togglerClassName}
                            onClick={options.onTogglerClick}
                            type="button"
                          >
                            {toggleIcon}
                          </button>
                        </div>
                      );
                    }}
                    className="temperature-profiles-panel"
                    toggleable
                    collapsed={isPanelCollapsed}
                    onToggle={(e) => setIsPanelCollapsed(e.value)}
                    transitionOptions={{ timeout: 300, easing: 'ease-in-out' }}
                    data-collapsed={isPanelCollapsed}
                    footer={
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}
                      >
                        <div className="total-rows-counter">
                          <Text size="3" weight="bold" color="gray">
                            Filas completas: {populatedRowsCount} / {MIN_TABLE_ROWS}
                          </Text>
                        </div>

                        {/* Mock/Dev Tools Buttons */}
                        <OrdersFormDevTools
                          formValues={formValues}
                          methods={methods}
                          mockDataHandlers={mockDataHandlers}
                          canAddRow={canAddRow}
                          onAddRow={handleAddRow}
                        />
                      </div>
                    }
                  >
                    <TimesRepeaterTable
                      name="timeRows"
                      emptyRowValues={PROFILE_ITEM_VALUES_EMPTY}
                      minRows={MIN_TABLE_ROWS}
                      // minVisibleRows={MIN_TABLE_VISIBLE_ROWS}
                      language={language}
                      onCanAddRowChange={handleCanAddRowChange}
                      onGenerateRandomValues={mockDataHandlers.generateRandomValuesForRow}
                    />
                  </Panel>
                </Col>
              </Col>
            </Row>
            {/* <pre>{JSON.stringify(formValues, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(dropdownData, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(tempItems, null, 2)}</pre> */}
            {/* <pre>canAddRow: {JSON.stringify(canAddRow, null, 2)}</pre>
            <pre>isSubmitLoading: {JSON.stringify(isSubmitLoading, null, 2)}</pre>
            <pre>isValid: {JSON.stringify(isValid, null, 2)}</pre>
            <pre>isDirty: {JSON.stringify(isDirty, null, 2)}</pre>
            <pre>isEditMode: {JSON.stringify(isEditMode, null, 2)}</pre> */}
          </form>
        </FormMiddlewareProvider>
      </FormProvider>
    </section>
  );
};
