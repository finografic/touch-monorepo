import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@radix-ui/themes';
import { FormMiddlewareProvider } from 'forms/FormMiddleware/FormMiddleware.simple';
import { InputTemperatureMiddleware } from 'forms/InputTemperatureMiddleware';
import { FieldWrapper } from 'forms/FieldWrapper';
import { SelectSimple } from 'forms/SelectSimple';
import { SelectSearchable } from 'forms/SelectSearchable/SelectSearchable';
import { ordersFormFieldConfigs, type OrdersFormValues } from 'forms/FormMiddleware/OrdersFormFieldConfigs';
import { MIN_TEMP_DIFFERENCE } from 'constants/temperature.config';
import { Col, Row } from 'react-grid-system';

// Simplified schema for POC
const ordersSchema = z
  .object({
    mode: z.coerce.number().int().min(1).max(5),
    drinkType: z.string().min(1, 'Drink type is required'),
    drinkSubtype: z.string().optional(),
    volume: z.string().min(1, 'Volume is required'),
    containerType: z.string().min(1, 'Container type is required'),
    defaultTempConsume: z.coerce.number().min(-40).max(40),
    defaultTempFreeze: z.coerce.number().min(-50).max(40),
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

interface OrdersFormPOCProps {
  onSubmit: (formData: OrdersFormValues) => void;
  isLoading?: boolean;
}

export const OrdersFormPOC: React.FC<OrdersFormPOCProps> = ({ onSubmit, isLoading = false }) => {
  // RHF setup
  const methods = useForm<OrdersFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(ordersSchema),
    defaultValues: {
      mode: 4,
      drinkType: '',
      drinkSubtype: '',
      volume: '',
      containerType: '',
      defaultTempConsume: 5,
      defaultTempFreeze: -2,
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;
  const formValues = methods.watch();

  // Handle form submission
  const onFormSubmit = (data: OrdersFormValues) => {
    onSubmit(data);
    methods.reset();
  };

  // Handle field changes (for dependency management)
  const handleFieldChange = (fieldName: string, value: any, allFormValues: OrdersFormValues) => {
    console.log(`Field ${fieldName} changed to:`, value);

    // Example of centralized dependency logic
    if (fieldName === 'defaultTempConsume') {
      const currentFreezeTemp = allFormValues.defaultTempFreeze;
      const maxFreezeTemp = value - MIN_TEMP_DIFFERENCE;

      if (currentFreezeTemp > maxFreezeTemp) {
        methods.setValue('defaultTempFreeze', maxFreezeTemp, { shouldValidate: true });
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <FormMiddlewareProvider
        formMethods={methods}
        fieldConfigs={ordersFormFieldConfigs}
        defaultLocale="es-ES"
        onFieldChange={handleFieldChange}
      >
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <Row className="row">
            <Col xs={10} md={10} className="col col-form-fields">
              <h2>OrdersForm POC - Middleware System Demo</h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                This demonstrates the form middleware system with centralized logic for field dependencies,
                validation, and localization.
              </p>

              <Row className="row">
                <Col xs={2} md={2} className="col col-form-fields">
                  {/* Mode */}
                  <FieldWrapper name="mode" label="Mode" required>
                    <SelectSimple
                      options={[1, 2, 3, 4, 5]}
                      placeholder="Select mode"
                      value={formValues.mode}
                      onSelect={(value) => methods.setValue('mode', Number(value))}
                    />
                  </FieldWrapper>
                </Col>

                <Col xs={5} md={5} className="col col-form-fields">
                  {/* Drink Type */}
                  <FieldWrapper name="drinkType" label="Drink Type" required>
                    <SelectSearchable
                      value={formValues.drinkType}
                      onSelect={(value) => methods.setValue('drinkType', value)}
                      options={[
                        { value: 'coffee', label: 'Coffee', description: 'Hot coffee', category: 'Hot' },
                        { value: 'tea', label: 'Tea', description: 'Hot tea', category: 'Hot' },
                        { value: 'juice', label: 'Juice', description: 'Fresh juice', category: 'Cold' },
                      ]}
                      placeholder="e.g., Coffee, Tea, Juice"
                      windowSize={15}
                    />
                  </FieldWrapper>
                </Col>

                <Col xs={5} md={5} className="col col-form-fields">
                  {/* Volume */}
                  <FieldWrapper name="volume" label="Volume" required>
                    <SelectSearchable
                      value={formValues.volume}
                      onSelect={(value) => methods.setValue('volume', value)}
                      options={[
                        { value: '250ml', label: '250ml', description: 'Small', category: 'Volume' },
                        { value: '500ml', label: '500ml', description: 'Medium', category: 'Volume' },
                        { value: '1L', label: '1L', description: 'Large', category: 'Volume' },
                      ]}
                      placeholder="e.g., 250ml, 500ml, 1L"
                      windowSize={15}
                    />
                  </FieldWrapper>
                </Col>
              </Row>

              <Row className="row">
                <Col xs={4} md={4} className="col col-form-fields">
                  {/* Container Type */}
                  <FieldWrapper name="containerType" label="Container" required>
                    <SelectSearchable
                      value={formValues.containerType}
                      onSelect={(value) => methods.setValue('containerType', value)}
                      options={[
                        { value: 'cup', label: 'Cup', description: 'Ceramic cup', category: 'Container' },
                        {
                          value: 'bottle',
                          label: 'Bottle',
                          description: 'Glass bottle',
                          category: 'Container',
                        },
                        { value: 'can', label: 'Can', description: 'Aluminum can', category: 'Container' },
                      ]}
                      placeholder="e.g., Cup, Bottle, Can"
                      windowSize={15}
                    />
                  </FieldWrapper>
                </Col>

                <Col xs={4} md={4} className="col col-form-fields">
                  {/* Temperature Consume - MIDDLEWARE MAGIC! */}
                  <FieldWrapper name="defaultTempConsume" label="Temperatura consumo" required>
                    <InputTemperatureMiddleware name="defaultTempConsume" />
                  </FieldWrapper>
                </Col>

                <Col xs={4} md={4} className="col col-form-fields">
                  {/* Temperature Freeze - MIDDLEWARE MAGIC WITH DYNAMIC CONSTRAINTS! */}
                  <FieldWrapper name="defaultTempFreeze" label="Temperatura congelación" required>
                    <InputTemperatureMiddleware name="defaultTempFreeze" />
                  </FieldWrapper>
                </Col>
              </Row>

              {/* Show middleware benefits */}
              <div
                style={{
                  background: '#f0f9ff',
                  padding: '1rem',
                  margin: '2rem 0',
                  borderRadius: '8px',
                  border: '1px solid #0ea5e9',
                }}
              >
                <h3 style={{ color: '#0c4a6e', margin: '0 0 0.5rem 0' }}>🚀 Middleware Benefits Demo</h3>
                <ul style={{ color: '#0c4a6e', margin: 0 }}>
                  <li>
                    <strong>Spanish Localization:</strong> Type "8,5" in temperature fields → displays as
                    "8,5", stores as 8.5
                  </li>
                  <li>
                    <strong>Dynamic Constraints:</strong> Freeze temp max automatically updates based on
                    consume temp
                  </li>
                  <li>
                    <strong>Arrow Keys:</strong> Use ↑↓ keys to step temperature values
                  </li>
                  <li>
                    <strong>Clean Components:</strong> All complex logic handled by middleware
                  </li>
                  <li>
                    <strong>Automatic Dependencies:</strong> Change consume temp → freeze temp constraint
                    updates
                  </li>
                </ul>
              </div>
            </Col>

            <Col xs={2} md={2} className="col col-form-buttons">
              <pre style={{ overflow: 'visible', fontSize: '10px', transform: 'translateX(-30%)' }}>
                {JSON.stringify(formValues, null, 2)}
              </pre>
              <Button type="submit" style={{ padding: '1rem 2rem' }} loading={isLoading} size="3">
                SAVE POC
              </Button>
            </Col>
          </Row>
        </form>
      </FormMiddlewareProvider>
    </FormProvider>
  );
};
