/* eslint-disable simple-import-sort/imports -- import order fixed manually; run eslint --fix to re-sort */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Badge, Flex, Switch, Text } from '@radix-ui/themes';
import clsx from 'clsx';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from 'components/Button';
import { useToast } from 'components/Toast';
import { useGetSlotSpecialConfig, useUpdateSlotSpecialConfig } from 'queries/app-configuration';
import { useBulkUpdateSlotConfigurations, useGetSlotConfigurations } from 'queries/slot-configurations';
import type { SlotSpecialParam } from 'types/app-configuration.types';
import type { SlotType } from 'types/slots.types';
import { calculateColumns } from 'utils/slots.utils';
import { getEffectiveRows, MAX_COLUMNS, MIN_COLUMNS, NUM_RELAYS } from 'config/app/slots.config';

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

export const AdminSlotsConfigPage: React.FC = () => {
  const { data: slotConfigs, isLoading, error } = useGetSlotConfigurations();
  const bulkUpdateMutation = useBulkUpdateSlotConfigurations();
  const { toast } = useToast();

  const gridSpecialConfig = useGetSlotSpecialConfig('special_grid');
  const powerSpecialConfig = useGetSlotSpecialConfig('special_power');
  const altSpecialConfig = useGetSlotSpecialConfig('special_alt');
  const updateSlotSpecialMutation = useUpdateSlotSpecialConfig();

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

  /** Sync data.is_visible for BOTH slot_special_grid and slot_special_alt when crossing the 3-column threshold. */
  const syncGridAndAltVisibility = useCallback(
    async (newColumns: number) => {
      const isVisible = newColumns >= 3;
      const gridConfig = gridSpecialConfig?.data;
      const altConfig = altSpecialConfig?.data;
      const updates: Array<{
        param: 'special_grid' | 'special_alt';
        id: string;
        data: { is_visible: boolean; slot_number: number; relay_number: number };
      }> = [];
      if (gridConfig?.id && gridConfig.data && gridConfig.data.is_visible !== isVisible) {
        updates.push({
          param: 'special_grid',
          id: gridConfig.id,
          data: { ...gridConfig.data, is_visible: isVisible },
        });
      }
      if (altConfig?.id && altConfig.data && altConfig.data.is_visible !== isVisible) {
        updates.push({
          param: 'special_alt',
          id: altConfig.id,
          data: { ...altConfig.data, is_visible: isVisible },
        });
      }
      if (updates.length === 0) return;
      try {
        for (const u of updates) {
          await updateSlotSpecialMutation.mutateAsync({
            param: u.param,
            id: u.id,
            data: { data: u.data },
          });
        }
        toast({
          variant: 'success',
          message: `Special grid/alt visibility ${isVisible ? 'shown' : 'hidden'} (${newColumns} columns)`,
        });
      } catch (err) {
        console.error('Failed to update special grid/alt visibility', err);
        toast({ variant: 'error', message: 'Failed to update special slot visibility' });
      }
    },
    [gridSpecialConfig?.data, altSpecialConfig?.data, updateSlotSpecialMutation, toast],
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
      const prevRows = getEffectiveRows(prevColumns);
      const newRows = getEffectiveRows(newColumns);

      const prevLastIndex = prevColumns * prevRows; // last grid slot (1-indexed)
      const newLastIndex = newColumns * newRows + 1; // grid slots + 1 special

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

      setValue('columns', newColumns, { shouldDirty: true });
      setValue('slots', updatedSlots, { shouldDirty: true });
      await saveConfiguration(updatedSlots);
      await syncGridAndAltVisibility(newColumns);
    }
  };

  const handleRemoveColumn = async () => {
    if (numActiveColumns > MIN_COLUMNS) {
      const prevColumns = numActiveColumns;
      const newColumns = Math.max(MIN_COLUMNS, prevColumns - 1);
      const newRows = getEffectiveRows(newColumns);

      const newLastIndex = newColumns * newRows + 1; // grid slots + 1 special

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
      await syncGridAndAltVisibility(newColumns);
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

  const effectiveRows = getEffectiveRows(numActiveColumns);
  const gridSlotsCount = numActiveColumns * effectiveRows;

  // Match main app: special slot only when columns >= 3 AND Special grid switch ON
  const showSpecialSlotInPreview = numActiveColumns >= 3 && gridSpecialConfig?.data?.isActive === true;

  const showSpecialAltSlotInPreview = numActiveColumns >= 3 && altSpecialConfig?.data?.isActive === true;
  const altSlotNumber = altSpecialConfig?.data?.data.slot_number ?? 15;

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
            subtitle={`${numActiveColumns} columns × ${effectiveRows} rows`}
            description={
              numActiveColumns < 3
                ? `Small layout: ${gridSlotsCount} grid slots + 1 special (rows auto-set to 2).`
                : `Click on slots to change their type. Slot ${gridSlotsCount + 1} is positioned separately.`
            }
            className={clsx('admin-slot-config')}
            isLoading={isLoading}
            variant="border-solid"
          >
            <Flex gap="4" justify="between">
              <Flex direction="column" gap="6" px="1">
                <SlotGrid
                  configurations={slots}
                  columns={numActiveColumns}
                  rows={effectiveRows}
                  onConfigurationChange={handleGridConfigChange}
                  showSpecialSlot={showSpecialSlotInPreview}
                  showSpecialAltSlot={showSpecialAltSlotInPreview}
                  altSlotNumber={altSlotNumber}
                />
                <Flex gap="4" align="center" mt="-4" pb="4">
                  <Badge size="3" variant="soft" color="blue" className="dimesions-badge">
                    {numActiveColumns} columns × {effectiveRows} rows = {gridSlotsCount} grid slots + 1
                    special slot
                  </Badge>
                </Flex>
              </Flex>
              <Flex direction="column" justify="between" gap="4">
                <div className="layout-mode-container">
                  <Flex direction="column" gap="2" pt="2">
                    <Text size="3" weight="bold" mb="2">
                      Special slot buttons
                    </Text>
                    {(
                      [
                        { param: 'special_grid' as SlotSpecialParam, label: 'Special grid' },
                        { param: 'special_alt' as SlotSpecialParam, label: 'Special alt' },
                        { param: 'special_power' as SlotSpecialParam, label: 'Special power' },
                      ] as const
                    ).map(({ param, label }) => {
                      const fullConfig =
                        param === 'special_grid'
                          ? gridSpecialConfig?.data
                          : param === 'special_power'
                            ? powerSpecialConfig?.data
                            : altSpecialConfig?.data;
                      const isActive = fullConfig?.isActive ?? false;
                      const isLoading = fullConfig === undefined;
                      return (
                        <Flex key={param} align="center" gap="2">
                          <Switch
                            checked={isActive}
                            onCheckedChange={async (checked) => {
                              if (!fullConfig?.id) return;
                              try {
                                if (checked) {
                                  if (param === 'special_alt' && gridSpecialConfig?.data?.isActive === true) {
                                    await updateSlotSpecialMutation.mutateAsync({
                                      param: 'special_grid',
                                      id: gridSpecialConfig.data.id,
                                      data: { isActive: false },
                                    });
                                  }
                                  if (param === 'special_grid' && altSpecialConfig?.data?.isActive === true) {
                                    await updateSlotSpecialMutation.mutateAsync({
                                      param: 'special_alt',
                                      id: altSpecialConfig.data.id,
                                      data: { isActive: false },
                                    });
                                  }
                                }
                                await updateSlotSpecialMutation.mutateAsync({
                                  param,
                                  id: fullConfig.id,
                                  data: { isActive: checked },
                                });
                                toast({
                                  variant: 'success',
                                  message: `${label} button ${checked ? 'enabled' : 'disabled'}`,
                                });
                              } catch (err) {
                                console.error(`Failed to update ${param}`, err);
                                toast({ variant: 'error', message: `Failed to update ${label}` });
                              }
                            }}
                            disabled={updateSlotSpecialMutation.isPending || isLoading}
                          />
                          <Text size="2" weight="medium">
                            {label}
                          </Text>
                        </Flex>
                      );
                    })}
                  </Flex>
                </div>
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
                  disabled={numActiveColumns <= MIN_COLUMNS}
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
                  disabled={numActiveColumns >= MAX_COLUMNS}
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
