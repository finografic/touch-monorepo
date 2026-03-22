import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Badge } from '@finografic/design-system/components';
import { SwitchDS } from '@finografic/design-system/forms';
import { MinusIcon, PlusIcon } from '@finografic/icons';

import { getQueryErrorMessage } from '@workspace/core/api';
import clsx from 'clsx';
import { Flex } from 'styled-system/jsx';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from 'components/Button';
import { useToast } from 'components/Toast';

import { useGetSlotSpecialConfig, useUpdateSlotSpecialConfig } from 'queries/app-configuration';
import {
  useBulkUpdateSlotConfigurations,
  useGetSlotConfigurations,
} from 'queries/slot-configurations';

import type { SlotSpecialParam } from 'types/app-configuration.types';
import type { SlotSpecial, SlotType } from 'types/slots.types';
import {
  ALT_SLOT_NUMBER,
  getGridDimensions,
  getGridLevelFromSlotCount,
  GRID_LEVEL_NAMES,
  type GridLevel,
  NUM_RELAYS,
} from 'config/app/slots.config';
import { AdminPageLayout } from '../..';
import { AdminSection } from '../../components/AdminSection/AdminSection';
import { SlotGrid } from './SlotGrid/SlotGrid';
import { styles } from './AdminSlotsConfigPage.styles';
import { getSpecialSlotSwitchPalette, relayConfigForSpecialSlot } from 'utils/slots.utils';

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

  const getGridLevelFromConfigs = (configs: SlotConfigFormValue[]): GridLevel => {
    const activeCount = configs.filter((c) => c.isActive).length;
    return getGridLevelFromSlotCount(activeCount);
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
  const gridLevel = activeSlots.length > 0 ? getGridLevelFromSlotCount(activeSlots.length) : 0;
  const { columns: numActiveColumns, rows: effectiveRows } = getGridDimensions(gridLevel);

  const prevSlotConfigs = useRef<SlotConfigFormValue[] | undefined>(undefined);

  useEffect(() => {
    if (slotConfigs && slotConfigs.length === NUM_RELAYS) {
      const configsString = JSON.stringify(slotConfigs);
      const prevConfigsString = JSON.stringify(prevSlotConfigs.current);

      if (configsString !== prevConfigsString) {
        const level = getGridLevelFromConfigs(slotConfigs);
        reset({
          columns: level,
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

  /**
   * Sync data.is_visible for BOTH slot_special_grid and slot_special_alt.
   * Special slots are visible only at level 2 (Large 3×3).
   */
  const syncGridAndAltVisibility = useCallback(
    async (newLevel: GridLevel) => {
      const isVisible = newLevel >= 3;
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
          message: `Special slot visibility updated (${GRID_LEVEL_NAMES[newLevel]})`,
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
    if (gridLevel < 4) {
      const prevLevel = gridLevel;
      const newLevel = (prevLevel + 1) as GridLevel;
      const { columns: prevCols, rows: prevRows } = getGridDimensions(prevLevel);
      const { columns: newCols, rows: newRows } = getGridDimensions(newLevel);

      const prevLastIndex = prevCols * prevRows; // last grid slot at current level
      const newLastIndex = newCols * newRows + 1; // last grid slot at new level + special

      const updatedSlots = slots.map((slot) => {
        const n = slot.slotNumber;
        if (n <= prevLastIndex) return { ...slot };
        if (n > prevLastIndex && n < newLastIndex) {
          return { ...slot, isActive: true, slotType: 'B' as SlotType };
        }
        if (n === newLastIndex) return { ...slot, isActive: true, slotType: 'C' as SlotType };
        return { ...slot, isActive: false, slotType: 'B' as SlotType };
      });

      setValue('slots', updatedSlots, { shouldDirty: true });
      await saveConfiguration(updatedSlots);
      await syncGridAndAltVisibility(newLevel);
    }
  };

  const handleRemoveColumn = async () => {
    if (gridLevel > 0) {
      const newLevel = (gridLevel - 1) as GridLevel;
      const { columns: newCols, rows: newRows } = getGridDimensions(newLevel);

      const newLastIndex = newCols * newRows + 1; // last grid slot at new level + special

      const updatedSlots = slots.map((slot) => {
        const n = slot.slotNumber;
        if (n < newLastIndex) return { ...slot };
        if (n === newLastIndex) return { ...slot, isActive: true, slotType: 'C' as SlotType };
        return { ...slot, isActive: false, slotType: 'B' as SlotType };
      });

      setValue('slots', updatedSlots, { shouldDirty: true });
      await saveConfiguration(updatedSlots);
      await syncGridAndAltVisibility(newLevel);
    }
  };

  // SlotGrid change handler - uses debouncing for rapid slot clicks
  const handleGridConfigChange = (slotNumber: number, newConfig: Partial<SlotConfigFormValue>) => {
    const updatedSlots = slots.map((slot) =>
      slot.slotNumber === slotNumber ? { ...slot, ...newConfig } : slot
    );
    setValue('slots', updatedSlots, { shouldDirty: true });
    debouncedSave(updatedSlots);
  };

  const gridSlotsCount = numActiveColumns * effectiveRows;

  // Match main app: special slots visible at levels 2–3 (≥3 columns) AND switch ON
  const showSpecialSlotInPreview = gridLevel >= 3 && gridSpecialConfig?.data?.isActive === true;

  const showSpecialAltSlotInPreview = gridLevel >= 3 && altSpecialConfig?.data?.isActive === true;
  const altSlotNumber = altSpecialConfig?.data?.data.slot_number ?? ALT_SLOT_NUMBER;

  const showPowerSlotInPreview = powerSpecialConfig?.data?.isActive === true;

  return (
    <>
      <FormProvider {...methods}>
        <AdminPageLayout
          title="Slot Configuration"
          subtitle="Main page grid layout"
          isLoading={isLoading}
          error={getQueryErrorMessage(error)}
          styles={styles}
        >
          <AdminSection
            title="Slot Grid Layout Preview"
            subtitle={`${
              GRID_LEVEL_NAMES[gridLevel]
            } — ${numActiveColumns} columns × ${effectiveRows} rows`}
            className={clsx('admin-slot-config')}
            isLoading={isLoading}
            variant="border-solid"
          >
            <Flex gap={4} justify="space-between">
              <Flex direction="column" gap={6} px={1}>
                <SlotGrid
                  configurations={slots}
                  columns={numActiveColumns}
                  rows={effectiveRows}
                  onConfigurationChange={handleGridConfigChange}
                  showSpecialSlot={showSpecialSlotInPreview}
                  showSpecialAltSlot={showSpecialAltSlotInPreview}
                  altSlotNumber={altSlotNumber}
                  showPowerSlot={showPowerSlotInPreview}
                />
                <Flex gap={4} align="center" mt="-4" pb={4}>
                  <Badge variant="soft" palette="info" size="lg" className="dimesions-badge">
                    {numActiveColumns} columns × {effectiveRows} rows = {gridSlotsCount}{' '}
                    grid slots + 1 special slot
                  </Badge>
                </Flex>
              </Flex>
              <Flex direction="column" justify="space-between" gap={4}>
                <div className="layout-mode-container">
                  <Flex direction="column" align="start" gap={3} pt={3}>
                    <span>Special slot buttons</span>
                    {(
                      [
                        {
                          param: 'special_grid' as SlotSpecialParam,
                          label: 'Special grid',
                          className: 'switch-special-grid',
                        },
                        {
                          param: 'special_alt' as SlotSpecialParam,
                          label: 'Special alt',
                          className: 'switch-special-alt',
                        },
                        {
                          param: 'special_power' as SlotSpecialParam,
                          label: 'Special power',
                          className: 'switch-special-power',
                        },
                      ] as const
                    ).map(({ param, label, className }) => {
                      const fullConfig = param === 'special_grid'
                        ? gridSpecialConfig?.data
                        : param === 'special_power'
                        ? powerSpecialConfig?.data
                        : altSpecialConfig?.data;
                      const isActive = fullConfig?.isActive ?? false;
                      const isLoading = fullConfig === undefined;
                      /** Same synthetic relay row as main preview / {@link getSlotColor}. */
                      const relayPreview = relayConfigForSpecialSlot(param);

                      return (
                        <Flex
                          key={param}
                          align="center"
                          gap={2}
                          mt={2}
                          title={`Relay slot ${relayPreview.slotNumber} (type ${relayPreview.slotType})`}
                        >
                          <SwitchDS
                            size="md"
                            palette={getSpecialSlotSwitchPalette(param)}
                            label={label}
                            checked={isActive}
                            onChange={async (checked) => {
                              if (!fullConfig?.id) return;
                              try {
                                await updateSlotSpecialMutation.mutateAsync({
                                  param,
                                  id: fullConfig.id,
                                  data: { isActive: checked },
                                });
                              } catch (err) {
                                console.error(`Failed to update ${param}`, err);
                                toast({ variant: 'error', message: `Failed to update ${label}` });
                              }
                            }}
                            disabled={updateSlotSpecialMutation.isPending || isLoading}
                            className={className}
                          />
                        </Flex>
                      );
                    })}
                  </Flex>
                </div>
                <div className="slot-types-container">
                  <div className="slot-legend">
                    <Flex direction="column" gap={4} pt={2}>
                      <Flex align="center" gap={4}>
                        <div className="legend-circle legend-type-a">A</div>
                        <span>Type A</span>
                      </Flex>
                      <Flex align="center" gap={4}>
                        <div className="legend-circle legend-type-b">B</div>
                        <span>Type B</span>
                      </Flex>
                      <Flex align="center" gap={4}>
                        <div className="legend-circle legend-type-c">C</div>
                        <span>Type C</span>
                      </Flex>
                      <Flex align="center" gap={4}>
                        <div className="legend-circle legend-type-alt">C</div>
                        <span>Type Alt</span>
                      </Flex>
                      <Flex align="center" gap={4}>
                        <div className="legend-circle legend-type-power">C</div>
                        <span>Power</span>
                      </Flex>
                    </Flex>
                  </div>
                </div>
              </Flex>
            </Flex>

            <Flex justify="space-between" gap={4} pr={3}>
              <Flex gap={4}>
                <Button
                  variant="outline"
                  color="warning"
                  onClick={handleRemoveColumn}
                  disabled={gridLevel === 0}
                >
                  <Flex justify="start" align="center" width="180px" gap={4} ml={4}>
                    <MinusIcon />
                    Remove Column
                  </Flex>
                </Button>
                <Button
                  variant="outline"
                  color="success"
                  onClick={handleAddColumn}
                  disabled={gridLevel === 4}
                >
                  <Flex justify="start" align="center" width="180px" gap={4} ml={4}>
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
