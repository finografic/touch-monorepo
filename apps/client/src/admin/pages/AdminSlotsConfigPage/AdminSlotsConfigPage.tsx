import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Badge, Flex, Switch, Text } from '@radix-ui/themes';
import clsx from 'clsx';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from 'components/Button';
import { useToast } from 'components/Toast';

import { useGetAppConfigurationByKey, useUpdateAppConfiguration } from 'queries/app-configuration';
import { useBulkUpdateSlotConfigurations, useGetSlotConfigurations } from 'queries/slot-configurations';

import { calculateColumns } from 'utils/slots.utils';
import type { SlotType } from 'types/slots.types';
import { MAX_COLUMNS, MIN_COLUMNS, NUM_RELAYS, NUM_ROWS_DEFAULT } from 'config/app/slots.config';
import { AdminPageLayout } from '../..';
import { AdminSection } from '../../components/AdminSection/AdminSection';
import { SlotGrid } from './SlotGrid/SlotGrid';
import { MinusIcon, PlusIcon } from 'styles/icons';
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

const GRID_LAYOUT_CONFIG_KEY = 'grid_layout';

export const AdminSlotsConfigPage: React.FC = () => {
  const { data: slotConfigs, isLoading, error } = useGetSlotConfigurations();
  const { data: gridLayoutConfig, isLoading: isGridLayoutLoading } =
    useGetAppConfigurationByKey(GRID_LAYOUT_CONFIG_KEY);
  const updateAppConfigMutation = useUpdateAppConfiguration();
  const bulkUpdateMutation = useBulkUpdateSlotConfigurations();
  const { toast } = useToast();

  const isMinimalLayout = gridLayoutConfig?.isActive ?? false;

  const getColumnsFromConfigs = (configs: SlotConfigFormValue[]): number => {
    const activeCount = configs.filter((c) => c.isActive).length;
    return calculateColumns(activeCount);
  };

  const methods = useForm<SlotConfigForm>({
    defaultValues: { columns: 3, slots: [] },
    mode: 'onChange',
  });
  const { reset, watch, setValue } = methods;

  // Watch the slots field but avoid mutating the watched value directly.
  const watchedSlots = watch('slots');
  const slots = useMemo(() => {
    if (!watchedSlots) return [] as SlotConfigFormValue[];
    return [...watchedSlots].sort((a, b) => a.slotNumber - b.slotNumber);
  }, [watchedSlots]);

  const activeSlots = slots.filter((s) => s.isActive);
  const numActiveColumns = activeSlots.length > 0 ? calculateColumns(activeSlots.length) : 3;

  const prevSlotConfigs = useRef<SlotConfigFormValue[] | undefined>(undefined);

  useEffect(() => {
    if (slotConfigs && slotConfigs.length === NUM_RELAYS) {
      const configsString = JSON.stringify(slotConfigs);
      const prevConfigsString = JSON.stringify(prevSlotConfigs.current);

      if (configsString !== prevConfigsString) {
        const numActiveColumns = getColumnsFromConfigs(slotConfigs);
        reset({
          columns: numActiveColumns,
          slots: slotConfigs,
        });
        prevSlotConfigs.current = slotConfigs;
      }
    }
  }, [slotConfigs, reset]);

  // Save configuration helper
  const saveConfiguration = useCallback(
    async (updatedSlots: SlotConfigFormValue[]) => {
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
    },
    [bulkUpdateMutation, toast],
  );

  const debouncedSave = useDebouncedCallback(
    (updatedSlots: SlotConfigFormValue[]) => saveConfiguration(updatedSlots),
    700,
    { maxWait: 1000 },
  );

  const handleAddColumn = async () => {
    if (numActiveColumns < MAX_COLUMNS) {
      const prevColumns = numActiveColumns;
      const newColumns = Math.min(MAX_COLUMNS, prevColumns + 1);

      const prevLastIndex = prevColumns * NUM_ROWS_DEFAULT; // inclusive, 1-indexed slotNumber
      const newLastIndex = newColumns * NUM_ROWS_DEFAULT + 1;

      const updatedSlots = slots.map((slot) => {
        const n = slot.slotNumber;
        if (n <= prevLastIndex) {
          return { ...slot };
        }
        if (n > prevLastIndex && n < newLastIndex) {
          return { ...slot, isActive: true, slotType: 'B' as SlotType };
        }
        if (n === newLastIndex) {
          return { ...slot, isActive: true, slotType: 'C' as SlotType };
        }
        return { ...slot, isActive: false, slotType: 'B' as SlotType };
      });

      // update form columns and slots
      setValue('columns', newColumns, { shouldDirty: true });
      setValue('slots', updatedSlots, { shouldDirty: true });
      await saveConfiguration(updatedSlots);
    }
  };

  const handleRemoveColumn = async () => {
    if (numActiveColumns > MIN_COLUMNS) {
      const prevColumns = numActiveColumns;
      const newColumns = Math.max(MIN_COLUMNS, prevColumns - 1);

      const newLastIndex = newColumns * NUM_ROWS_DEFAULT + 1;

      const updatedSlots = slots.map((slot) => {
        const n = slot.slotNumber;
        if (n < newLastIndex) {
          return { ...slot };
        }
        if (n === newLastIndex) {
          return { ...slot, isActive: true, slotType: 'C' as SlotType };
        }
        return { ...slot, isActive: false, slotType: 'B' as SlotType };
      });

      setValue('columns', newColumns, { shouldDirty: true });
      setValue('slots', updatedSlots, { shouldDirty: true });
      await saveConfiguration(updatedSlots);
    }
  };

  // SlotGrid change handler - uses debouncing for rapid slot clicks
  const handleGridConfigChange = (slotNumber: number, newConfig: Partial<SlotConfigFormValue>) => {
    const updatedSlots = slots.map((slot) =>
      slot.slotNumber === slotNumber ? { ...slot, ...newConfig } : slot,
    );
    setValue('slots', updatedSlots, { shouldDirty: true });
    debouncedSave(updatedSlots);
  };

  const handleMinimalLayoutToggle = async (checked: boolean) => {
    if (!gridLayoutConfig) return;
    try {
      await updateAppConfigMutation.mutateAsync({
        id: gridLayoutConfig.id,
        data: { isActive: checked },
      });
      toast({
        variant: 'success',
        message: checked ? 'Minimal layout (4 slots, 2×2) enabled' : 'Standard grid layout enabled',
      });
    } catch (err) {
      console.error('Failed to update grid layout config', err);
      toast({
        variant: 'error',
        message: 'Failed to update grid layout',
      });
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <AdminPageLayout
          title="Slot Configuration"
          subtitle="Main page grid layout"
          isLoading={isLoading}
          error={error ? error.message : undefined}
          styles={styles}
        >
          <AdminSection
            title="Slot Grid Layout Preview"
            subtitle={isMinimalLayout ? '2×2 minimal' : `${numActiveColumns} columns`}
            description={
              isMinimalLayout
                ? 'Minimal layout: 4 slots, 2 columns × 2 rows, no separate slot.'
                : `Click on slots to change their type. Slot ${numActiveColumns * NUM_ROWS_DEFAULT + 1} is positioned separately`
            }
            className={clsx('admin-slot-config')}
            isLoading={isLoading || isGridLayoutLoading}
            variant="border-solid"
          >
            <Flex gap="4" justify="between">
              <Flex direction="column" gap="6" px="1">
                <SlotGrid
                  configurations={
                    isMinimalLayout
                      ? slots.filter((s) => s.slotNumber <= 4).map((s) => ({ ...s, isActive: true }))
                      : slots
                  }
                  columns={isMinimalLayout ? 2 : numActiveColumns}
                  rows={isMinimalLayout ? 2 : NUM_ROWS_DEFAULT}
                  onConfigurationChange={handleGridConfigChange}
                />
                <Flex gap="4" align="center" mt="-4" pb="4">
                  <Badge size="3" variant="soft" color="blue" className="dimesions-badge">
                    {isMinimalLayout
                      ? '2 columns × 2 rows = 4 slots (minimal)'
                      : `${numActiveColumns} columns × ${NUM_ROWS_DEFAULT} rows = ${activeSlots.length - 1} grid slots + 1 special slot`}
                  </Badge>
                </Flex>
              </Flex>
              <Flex direction="column" justify="between" gap="4">
                {gridLayoutConfig && (
                  <div className="layout-mode-container">
                    <Flex direction="column" gap="2" pt="2">
                      <Text size="3" weight="bold" mb="2">
                        Layout mode
                      </Text>
                      <Flex align="center" gap="2">
                        <Switch
                          checked={isMinimalLayout}
                          onCheckedChange={handleMinimalLayoutToggle}
                          disabled={updateAppConfigMutation.isPending}
                        />
                        <Text size="2" weight="medium">
                          Minimal (4 slots, 2×2)
                        </Text>
                      </Flex>
                    </Flex>
                  </div>
                )}
                <div className="slot-types-container">
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
              <Flex gap="4">
                <Button
                  variant="outline"
                  color="warning"
                  onClick={handleRemoveColumn}
                  disabled={numActiveColumns <= MIN_COLUMNS || isMinimalLayout}
                >
                  <Flex justify="start" align="center" width="180px" gap="4" ml="4">
                    <MinusIcon />
                    Remove Column
                  </Flex>
                </Button>
                <Button
                  variant="outline"
                  color="success"
                  onClick={handleAddColumn}
                  disabled={numActiveColumns >= MAX_COLUMNS || isMinimalLayout}
                >
                  <Flex justify="start" align="center" width="180px" gap="4" ml="4">
                    <PlusIcon />
                    Add Column
                  </Flex>
                </Button>
              </Flex>
            </Flex>
          </AdminSection>
        </AdminPageLayout>
      </FormProvider>
    </>
  );
};
