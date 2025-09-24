import React, { useEffect, useRef } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { Badge, Box, Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { MinusIcon, PlusIcon, ResetIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { AdminContentLayout } from '../shared';
import { RelayGrid } from './RelayGrid';
import {
  useBulkUpdateSlotConfigurations,
  useGetSlotConfigurations,
  useResetSlotConfigurations,
} from 'queries/slot-configurations';
import { GRID_CONFIGS } from 'types/slot-config.types';
import { SlotType } from 'types/orders.types';
import { styles } from './AdminRelaysPage.styles';
import { useToast } from 'components/Toast';
import { NUM_RELAYS } from './relays.config';

// Types for form values
interface SlotConfigFormValue {
  slotNumber: number;
  slotType: SlotType;
  isOn?: boolean; // New: relay state
}
interface SlotConfigForm {
  columns: number;
  slots: SlotConfigFormValue[];
}

export const AdminRelaysPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: slotConfigs, isLoading, error } = useGetSlotConfigurations();
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
        slotType: existing?.slotType || SlotType.B, // All slots can be any type
        isOn: false, // Initialize all relays as OFF
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

  const handleGridConfigChange = (slotNumber: number, newConfig: Partial<SlotConfigFormValue>) => {
    setValue(
      'slots',
      slots.map((slot) => (slot.slotNumber === slotNumber ? { ...slot, ...newConfig } : slot)),
      { shouldDirty: true },
    );
  };

  if (isLoading) {
    return (
      <AdminContentLayout title="Relay Control" subtitle="Loading...">
        <Box className="loading">Loading relay configurations...</Box>
      </AdminContentLayout>
    );
  }
  if (error) {
    return (
      <AdminContentLayout title="Relay Control" subtitle="Error">
        <Box className="error">
          <Text color="red">Error loading relay configurations: {error.message}</Text>
        </Box>
      </AdminContentLayout>
    );
  }

  return (
    <section css={styles} id="admin-slot-config">
      <FormProvider {...methods}>
        <AdminContentLayout
          title="Relay Control"
          subtitle={`Test and control the ${NUM_RELAYS}-channel relay board`}
        >
          <Box className="admin-slot-config">
            <Flex direction="column" gap="6">
              <Card size="3" variant="surface">
                <Flex gap="4" justify="between">
                  <Flex direction="column" gap="4">
                    <Heading size="4">Relay Control Grid</Heading>
                    <Text size="2" color="gray">
                      Click on relays to toggle them ON/OFF. Green indicates relay is ON.
                    </Text>
                    <RelayGrid
                      configurations={slots}
                      gridConfig={GRID_CONFIGS[columns]}
                      onConfigurationChange={handleGridConfigChange}
                    />
                  </Flex>
                  <Flex direction="column" gap="4">
                    <div className="slot-types-container">
                      <Heading size="4">Relay Status</Heading>
                      <div className="slot-legend">
                        <Flex direction="column" gap="3">
                          {slots
                            .filter((slot) => slot.slotNumber <= NUM_RELAYS)
                            .map((slot) => (
                              <Flex
                                key={slot.slotNumber}
                                align="center"
                                gap="4"
                                className={`legend-item ${slot.isOn ? 'legend-relay-on' : 'legend-relay-off'}`}
                              >
                                <div>{slot.slotNumber}</div>
                                <Text size="3">
                                  Relay {slot.slotNumber}: {slot.isOn ? 'ON' : 'OFF'}
                                </Text>
                              </Flex>
                            ))}
                        </Flex>
                      </div>
                    </div>
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
