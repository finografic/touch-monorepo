import React, { useEffect, useRef } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { Badge, Box, Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { MinusIcon, PlusIcon, ResetIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { AdminContentLayout } from '../shared';
import { SlotGrid } from './SlotGrid';
import {
  useBulkUpdateSlotConfigurations,
  useGetSlotConfigurations,
  useResetSlotConfigurations,
} from 'queries/slot-configurations';
import { useGetModes, useUpdateMode } from 'queries/modes';
import { SelectSimple } from 'forms/SelectSimple';
import { GRID_CONFIGS } from 'types/slot-config.types';
import { ItemType } from 'types/orders.types';
import { styles } from './AdminAppConfigPage.styles';
import { useToast } from 'components/Toast';

// Types for form values
interface SlotConfigFormValue {
  slotNumber: number;
  itemType: ItemType;
}
interface SlotConfigForm {
  columns: number;
  slots: SlotConfigFormValue[];
}

export const AdminAppConfigPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: slotConfigs, isLoading, error } = useGetSlotConfigurations();
  const { data: modes, isLoading: modesLoading } = useGetModes();
  const bulkUpdateMutation = useBulkUpdateSlotConfigurations();
  const resetMutation = useResetSlotConfigurations();
  const updateModeMutation = useUpdateMode();
  const { toast } = useToast();
  const initialColumns = 3;
  const minColumns = 2;
  const maxColumns = 5;
  const defaultGridConfig = GRID_CONFIGS[initialColumns];

  // Helper to generate slots for a given column count
  const generateSlots = (columns: number, fromConfigs?: SlotConfigFormValue[]): SlotConfigFormValue[] => {
    const gridConfig = GRID_CONFIGS[columns];
    const totalSlots = gridConfig.totalSlots;
    const slots: SlotConfigFormValue[] = [];

    // 1-based slot numbers: 1 to totalSlots
    for (let i = 1; i <= totalSlots; i++) {
      const existing = fromConfigs?.find((c) => c.slotNumber === i);
      slots.push({
        slotNumber: i,
        itemType: existing?.itemType || ItemType.B, // All slots can be any type
      });
    }
    return slots;
  };

  // Helper to determine columns from slot configs
  const getColumnsFromConfigs = (configs: SlotConfigFormValue[]): number => {
    const totalSlots = configs.length;
    // Find the grid config that matches this total slots
    for (let cols = minColumns; cols <= maxColumns; cols++) {
      if (GRID_CONFIGS[cols].totalSlots === totalSlots) {
        return cols;
      }
    }
    return initialColumns; // fallback
  };

  // Setup RHF
  const methods = useForm<SlotConfigForm>({
    defaultValues: {
      columns: initialColumns,
      slots: generateSlots(initialColumns),
    },
    mode: 'onChange',
  });
  const { control, handleSubmit, reset, watch, setValue } = methods;
  const { replace } = useFieldArray({ control, name: 'slots' });
  const columns = watch('columns');
  const slots = watch('slots');

  // Keep slots in sync with columns
  const prevColumns = useRef(columns);
  useEffect(() => {
    if (columns !== prevColumns.current) {
      replace(generateSlots(columns, slots));
      prevColumns.current = columns;
    }
  }, [columns, replace, slots]);

  // Update form when API data changes (e.g., after save/reset or page refresh)
  const prevSlotConfigs = useRef<SlotConfigFormValue[] | undefined>(undefined);
  useEffect(() => {
    // Only update if slotConfigs actually changed and we have data
    if (slotConfigs && slotConfigs.length > 0) {
      const configsString = JSON.stringify(slotConfigs);
      const prevConfigsString = JSON.stringify(prevSlotConfigs.current);

      if (configsString !== prevConfigsString) {
        const columns = getColumnsFromConfigs(slotConfigs);
        const newSlots = generateSlots(columns, slotConfigs);

        console.log('Updating form with new slot configs:', slotConfigs);
        console.log('New form values:', { columns, slots: newSlots });

        reset({
          columns,
          slots: newSlots,
        });
        prevSlotConfigs.current = slotConfigs;
      }
    }
  }, [slotConfigs, reset]);

  // Save handler
  const onSave = async (data: SlotConfigForm) => {
    try {
      await bulkUpdateMutation.mutateAsync({ configurations: data.slots });
      // After successful save, the API will refetch and update slotConfigs
      // which will trigger the useEffect above to reset the form
    } catch (error) {
      console.error('Failed to save configurations:', error);
    }
  };

  // Reset handler
  const onReset = async () => {
    try {
      await resetMutation.mutateAsync();
      // After successful reset, the API will refetch and update slotConfigs
      // which will trigger the useEffect above to reset the form
    } catch (error) {
      console.error('Failed to reset configurations:', error);
    }
  };

  const handleAddColumn = () => {
    if (columns < maxColumns) {
      setValue('columns', columns + 1);
    }
  };
  const handleRemoveColumn = () => {
    if (columns > minColumns) {
      setValue('columns', columns - 1);
    }
  };

  // SlotGrid change handler
  const handleGridConfigChange = (slotNumber: number, newConfig: Partial<SlotConfigFormValue>) => {
    setValue(
      'slots',
      slots.map((slot) => (slot.slotNumber === slotNumber ? { ...slot, ...newConfig } : slot)),
      { shouldDirty: true },
    );
  };

  // Table dropdown change handler
  const handleTypeChange = (slotNumber: number, newType: ItemType) => {
    setValue(
      'slots',
      slots.map((slot) => (slot.slotNumber === slotNumber ? { ...slot, itemType: newType } : slot)),
      { shouldDirty: true },
    );
  };

  // Mode selection handler
  const handleModeChange = async (modeId: string) => {
    try {
      // First, set all modes to not default
      const updatePromises = modes?.map((mode) => {
        if (mode.id !== modeId && mode.isDefault) {
          return updateModeMutation.mutateAsync({
            id: mode.id,
            updates: { isDefault: false },
          });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);

      // Then set the selected mode as default
      await updateModeMutation.mutateAsync({
        id: modeId,
        updates: { isDefault: true },
      });

      toast({ variant: 'success', message: 'Mode updated successfully!' });
    } catch (error) {
      console.error('Failed to update mode:', error);
      toast({ variant: 'error', message: 'Failed to update mode. Please try again.' });
    }
  };

  // Get current default mode
  const defaultMode = modes?.find((mode) => mode.isDefault);
  const modeOptions = modes?.map((mode) => ({ value: mode.id, label: mode.name })) || [];

  // Create options array for SelectSimple (using labels as display values)
  const selectOptions = modeOptions.map((opt) => opt.label);
  const getModeIdFromLabel = (label: string) => {
    const mode = modeOptions.find((opt) => opt.label === label);
    return mode?.value;
  };

  if (isLoading) {
    return (
      <AdminContentLayout title="Slot Configuration" subtitle="Loading...">
        <Box className="loading">Loading slot configurations...</Box>
      </AdminContentLayout>
    );
  }
  if (error) {
    return (
      <AdminContentLayout title="Slot Configuration" subtitle="Error">
        <Box className="error">
          <Text color="red">Error loading slot configurations: {error.message}</Text>
        </Box>
      </AdminContentLayout>
    );
  }

  return (
    <section css={styles} id="admin-slot-config">
      <FormProvider {...methods}>
        <AdminContentLayout
          title="Slot Configuration"
          subtitle="Configure the MainPage grid layout and slot types"
        >
          <Box className="admin-slot-config">
            <Flex direction="column" gap="6">
              <Card size="3" variant="surface">
                <Flex gap="4" justify="between">
                  <Flex direction="column" gap="4">
                    <Heading size="4">Slot Grid Layout Preview</Heading>
                    <Text size="2" color="gray">
                      Click on slots to change their type. The last slot is positioned separately.
                    </Text>
                    <SlotGrid
                      configurations={slots}
                      gridConfig={GRID_CONFIGS[columns]}
                      onConfigurationChange={handleGridConfigChange}
                    />
                  </Flex>
                  <Flex direction="column" gap="4">
                    <div className="slot-types-container">
                      <Heading size="4">Slot Types</Heading>
                      <div className="slot-legend">
                        <Flex direction="column" gap="5">
                          <Flex align="center" gap="4">
                            <div className="legend-item legend-type-a">A</div>
                            <Text size="3">Type A</Text>
                          </Flex>
                          <Flex align="center" gap="4">
                            <div className="legend-item legend-type-b">B</div>
                            <Text size="3">Type B</Text>
                          </Flex>
                          <Flex align="center" gap="4">
                            <div className="legend-item legend-type-c">C</div>
                            <Text size="3">Type C</Text>
                          </Flex>
                        </Flex>
                      </div>
                    </div>
                    <div className="slot-types-container">
                      <Heading size="4">Dimensiones de Cuadrícula</Heading>
                      <div className="slot-legend">
                        <Flex direction="column" align="stretch" gap="4">
                          <Button
                            variant="outline"
                            color="green"
                            size="3"
                            onClick={handleAddColumn}
                            disabled={columns >= maxColumns}
                          >
                            <Flex justify="start" align="center" width="100%" gap="4" ml="6">
                              <PlusIcon />
                              Add Column
                            </Flex>
                          </Button>
                          <Button
                            variant="outline"
                            color="orange"
                            size="3"
                            onClick={handleRemoveColumn}
                            disabled={columns <= minColumns}
                          >
                            <Flex justify="start" align="center" width="100%" gap="4" ml="6">
                              <MinusIcon />
                              Remove Column
                            </Flex>
                          </Button>
                        </Flex>
                      </div>
                    </div>
                  </Flex>
                </Flex>

                <Flex justify="between" gap="4" pr="3">
                  <Flex gap="4" align="center" pt="4" pb="2">
                    <Badge variant="soft" color="blue">
                      {columns} columns × 3 rows = {GRID_CONFIGS[columns].totalSlots - 1} slots + 1 separate
                      slot
                    </Badge>
                  </Flex>
                  <Flex justify="between" gap="2">
                    <Flex gap="2">
                      <Button
                        size="3"
                        color="green"
                        onClick={handleSubmit(onSave)}
                        disabled={bulkUpdateMutation.isPending}
                        loading={bulkUpdateMutation.isPending}
                      >
                        Save Configuration
                      </Button>
                      <Button
                        size="3"
                        variant="outline"
                        color="gray"
                        onClick={onReset}
                        disabled={resetMutation.isPending}
                        loading={resetMutation.isPending}
                      >
                        <ResetIcon />
                        Reset to Default
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>

              {/* App mode selection */}
              <Heading size="8" mb="0">
                Mode Selection
              </Heading>
              <Card size="3" variant="surface">
                <Flex gap="1" justify="start">
                  <Flex direction="column" gap="4" className="mode-select-container">
                    <Text size="2" color="gray">
                      Default cooling mode
                    </Text>
                    {modesLoading ? (
                      <Text size="2">Loading modes...</Text>
                    ) : (
                      <SelectSimple
                        className="mode-select"
                        options={selectOptions}
                        value={defaultMode ? defaultMode.name : ''}
                        onSelect={(label) => {
                          const modeId = getModeIdFromLabel(label as string);
                          if (modeId) {
                            handleModeChange(modeId);
                          }
                        }}
                      />
                    )}
                  </Flex>
                  <Flex align="center" justify="start" gap="1" className="mode-value">
                    {defaultMode && (
                      <Text size="2" color="sky" mt="6">
                        Modo actual: <strong>{defaultMode.name}</strong>
                      </Text>
                    )}
                  </Flex>
                </Flex>
              </Card>
            </Flex>
          </Box>
        </AdminContentLayout>
      </FormProvider>
    </section>
  );
};
