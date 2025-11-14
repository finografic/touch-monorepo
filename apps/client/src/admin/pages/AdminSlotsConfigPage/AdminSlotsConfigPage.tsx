import React, { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { Badge, Box, Button, Flex, Text } from '@radix-ui/themes';
import clsx from 'clsx';
import { useToast } from 'components/Toast';

import { useBulkUpdateSlotConfigurations, useGetSlotConfigurations } from 'queries/slot-configurations';

import type { SlotType } from 'types/orders.types';
import { calculateColumns, MAX_COLUMNS, MIN_COLUMNS, NUM_ROWS, NUM_SLOTS } from 'types/slot-config.types';
import { AdminPageLayout } from '../..';
import { AdminSection } from '../../components/AdminSection';
import { SlotGrid } from './SlotGrid';
import { styles } from './AdminSlotsConfigPage.styles';

// Types for form values
interface SlotConfigFormValue {
  slotNumber: number;
  slotType: SlotType;
  isActive: boolean;
  relayNumber: number;
}
interface SlotConfigForm {
  columns: number;
  slots: SlotConfigFormValue[];
}

export const AdminSlotsConfigPage: React.FC = () => {
  const { data: slotConfigs, isLoading, error } = useGetSlotConfigurations();
  const bulkUpdateMutation = useBulkUpdateSlotConfigurations();
  const { toast } = useToast();

  // Calculate columns dynamically from active slots
  const getColumnsFromConfigs = (configs: SlotConfigFormValue[]): number => {
    const activeCount = configs.filter((c) => c.isActive).length;
    return calculateColumns(activeCount);
  };

  // Setup RHF
  const methods = useForm<SlotConfigForm>({
    defaultValues: {
      columns: 3,
      slots: [],
    },
    mode: 'onChange',
  });
  const { control, reset, watch, setValue } = methods;
  const slots = watch('slots');

  // Calculate columns dynamically from active slots
  const activeSlots = slots.filter((s) => s.isActive);
  const calculatedColumns = activeSlots.length > 0 ? calculateColumns(activeSlots.length) : 3;

  // Update form when API data changes (e.g., after save/reset or page refresh)
  const prevSlotConfigs = useRef<SlotConfigFormValue[] | undefined>(undefined);
  useEffect(() => {
    // Only update if slotConfigs actually changed and we have data (expecting 16 slots)
    if (slotConfigs && slotConfigs.length === NUM_SLOTS) {
      const configsString = JSON.stringify(slotConfigs);
      const prevConfigsString = JSON.stringify(prevSlotConfigs.current);

      if (configsString !== prevConfigsString) {
        const calculatedColumns = getColumnsFromConfigs(slotConfigs);

        console.log('Updating form with new slot configs:', slotConfigs);
        console.log('Calculated columns:', calculatedColumns);

        reset({
          columns: calculatedColumns,
          slots: slotConfigs,
        });
        prevSlotConfigs.current = slotConfigs;
      }
    }
  }, [slotConfigs, reset]);

  // Save configuration helper
  const saveConfiguration = async (updatedSlots: SlotConfigFormValue[]) => {
    try {
      await bulkUpdateMutation.mutateAsync({ configurations: updatedSlots });
      toast({
        variant: 'success',
        message: 'Slot configuration saved',
      });
    } catch (error) {
      console.error('Failed to save configurations:', error);
      toast({
        variant: 'error',
        message: 'Failed to save slot configuration',
      });
    }
  };

  const handleAddColumn = async () => {
    if (calculatedColumns < MAX_COLUMNS) {
      // Activate the next 3 slots (next column) and reset type to default Type B
      const nextInactiveSlots = slots
        .filter((s) => !s.isActive)
        .sort((a, b) => a.slotNumber - b.slotNumber)
        .slice(0, NUM_ROWS);

      if (nextInactiveSlots.length > 0) {
        const updatedSlots = slots.map((slot) =>
          nextInactiveSlots.some((s) => s.slotNumber === slot.slotNumber)
            ? { ...slot, isActive: true, slotType: 'B' as SlotType }
            : slot,
        );
        setValue('slots', updatedSlots, { shouldDirty: true });
        await saveConfiguration(updatedSlots);
      }
    }
  };

  const handleRemoveColumn = async () => {
    if (calculatedColumns > MIN_COLUMNS) {
      // Deactivate the last 3 active slots (last column, excluding special slot) and reset type to default Type B
      const activeGridSlots = slots
        .filter((s) => s.isActive && s.slotNumber !== NUM_SLOTS)
        .sort((a, b) => b.slotNumber - a.slotNumber)
        .slice(0, NUM_ROWS);

      if (activeGridSlots.length > 0) {
        const updatedSlots = slots.map((slot) =>
          activeGridSlots.some((s) => s.slotNumber === slot.slotNumber)
            ? { ...slot, isActive: false, slotType: 'B' as SlotType }
            : slot,
        );
        setValue('slots', updatedSlots, { shouldDirty: true });
        await saveConfiguration(updatedSlots);
      }
    }
  };

  // SlotGrid change handler
  const handleGridConfigChange = async (slotNumber: number, newConfig: Partial<SlotConfigFormValue>) => {
    const updatedSlots = slots.map((slot) =>
      slot.slotNumber === slotNumber ? { ...slot, ...newConfig } : slot,
    );
    setValue('slots', updatedSlots, { shouldDirty: true });
    await saveConfiguration(updatedSlots);
  };

  if (isLoading) {
    return (
      <AdminPageLayout title="Slot Configuration" subtitle="Loading...">
        <Box className="loading">Loading slot configurations...</Box>
      </AdminPageLayout>
    );
  }
  if (error) {
    return (
      <AdminPageLayout title="Slot Configuration" subtitle="Error">
        <Box className="error">
          <Text color="red">Error loading slot configurations: {error.message}</Text>
        </Box>
      </AdminPageLayout>
    );
  }

  return (
    <>
      <FormProvider {...methods}>
        <AdminPageLayout
          title="Slot Configuration"
          subtitle="Configure the MainPage grid layout and slot types"
          // description={`COLUMNS: ${calculatedColumns} | ROWS: ${NUM_ROWS} | ACTIVE SLOTS: ${activeSlots.length} / ${NUM_SLOTS}`}
          // description={`Click on slots to change their type. Slot ${NUM_SLOTS} is positioned separately`}
          styles={styles}
        >
          <AdminSection
            title="Slot Grid Layout Preview"
            subtitle={`${calculatedColumns} columns`}
            description={`Click on slots to change their type. Slot ${NUM_SLOTS} is positioned separately`}
            className={clsx('admin-slot-config')}
            isLoading={isLoading}
            variant="border-solid"
          >
            <Flex gap="4" justify="between">
              {/* ====================================================================== */}

              <Flex direction="column" gap="6" px="1">
                <SlotGrid
                  configurations={activeSlots}
                  columns={calculatedColumns}
                  rows={NUM_ROWS}
                  onConfigurationChange={handleGridConfigChange}
                />

                <Flex gap="4" align="center" mt="-4" pb="4">
                  <Badge size="3" variant="soft" color="blue" className="dimesions-badge">
                    {calculatedColumns} columns × {NUM_ROWS} rows = {activeSlots.length - 1} grid slots + 1
                    special slot
                  </Badge>
                </Flex>
              </Flex>

              {/* ====================================================================== */}

              <Flex direction="column" gap="4">
                <div className="slot-types-container">
                  {/* <Heading size="4" ml="1">
                    Slot Types
                  </Heading> */}
                  <div className="slot-legend">
                    <Flex direction="column" gap="4" pt="2">
                      <Flex align="center" gap="4">
                        <div className="legend-circle legend-type-a">A</div>
                        <Text size="3">Type A</Text>
                      </Flex>
                      <Flex align="center" gap="4">
                        <div className="legend-circle legend-type-b">B</div>
                        <Text size="3">Type B</Text>
                      </Flex>
                      <Flex align="center" gap="4">
                        <div className="legend-circle legend-type-c">C</div>
                        <Text size="3">Type C</Text>
                      </Flex>
                    </Flex>
                  </div>
                </div>
              </Flex>
            </Flex>

            <Flex justify="between" gap="4" pr="3">
              <Flex gap="2">
                <Button
                  variant="outline"
                  color="orange"
                  size="3"
                  onClick={handleRemoveColumn}
                  disabled={calculatedColumns <= MIN_COLUMNS}
                >
                  <Flex justify="start" align="center" width="180px" gap="4" ml="4">
                    <MinusIcon />
                    Remove Column
                  </Flex>
                </Button>
                <Button
                  variant="outline"
                  color="green"
                  size="3"
                  onClick={handleAddColumn}
                  disabled={calculatedColumns >= MAX_COLUMNS}
                >
                  <Flex justify="start" align="center" width="180px" gap="4" ml="4">
                    <PlusIcon />
                    Add Column
                  </Flex>
                </Button>
              </Flex>

              {/* <pre>{JSON.stringify({ slots, columns }, null, 2)}</pre> */}
            </Flex>
          </AdminSection>
        </AdminPageLayout>
      </FormProvider>
    </>
  );
};
