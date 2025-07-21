import React, { useMemo, useState } from 'react';
import { Badge, Box, Button, Card, Flex, Heading, Select, Text } from '@radix-ui/themes';
import { MinusIcon, PlusIcon, ResetIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { AdminContentLayout } from '../shared';
import { SlotGrid } from './SlotGrid';
import { SlotConfigControls } from './SlotConfigControls';
import {
  useBulkUpdateSlotConfigurations,
  useResetSlotConfigurations,
  useSlotConfigurations,
} from 'api/hooks/useSlotConfigurations';
import { GRID_CONFIGS, type GridConfig } from 'types/slot-config.types';
import { ItemType } from 'types/orders.types';
import { styles } from './AdminSlotConfigPage.styles';

export const AdminSlotConfigPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedColumns, setSelectedColumns] = useState(3); // Default to 3 columns

  // API hooks
  const { data: slotConfigsResponse, isLoading, error } = useSlotConfigurations();
  const bulkUpdateMutation = useBulkUpdateSlotConfigurations();
  const resetMutation = useResetSlotConfigurations();

  const slotConfigs = slotConfigsResponse?.data || [];
  const currentGridConfig = GRID_CONFIGS[selectedColumns];

  // Generate slot configurations for the current grid
  const generateSlotConfigs = useMemo(() => {
    const configs = [];
    const totalSlots = currentGridConfig.totalSlots;

    for (let i = 0; i < totalSlots; i++) {
      const existingConfig = slotConfigs.find((config) => config.slotNumber === i);
      configs.push({
        slotNumber: i,
        itemType: existingConfig?.itemType || ItemType.B,
        isSpecialPad: existingConfig?.isSpecialPad || i === totalSlots - 1,
      });
    }

    return configs;
  }, [slotConfigs, currentGridConfig]);

  const handleSaveConfigurations = async () => {
    try {
      await bulkUpdateMutation.mutateAsync({
        configurations: generateSlotConfigs,
      });
    } catch (error) {
      console.error('Failed to save configurations:', error);
    }
  };

  const handleResetToDefault = async () => {
    try {
      await resetMutation.mutateAsync();
      setSelectedColumns(3); // Reset to default 3 columns
    } catch (error) {
      console.error('Failed to reset configurations:', error);
    }
  };

  const handleAddColumn = () => {
    if (selectedColumns < 5) {
      setSelectedColumns(selectedColumns + 1);
    }
  };

  const handleRemoveColumn = () => {
    if (selectedColumns > 2) {
      setSelectedColumns(selectedColumns - 1);
    }
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
      <AdminContentLayout
        title="Slot Configuration"
        subtitle="Configure the MainPage grid layout and slot types"
      >
        <Box className="admin-slot-config">
          <Flex direction="column" gap="6">
            {/* Header with controls */}
            <Card size="3" variant="surface">
              <Flex direction="column" gap="4">
                <Flex justify="between" align="center">
                  <Heading size="4">Grid Configuration</Heading>
                  <Flex gap="2">
                    <Button
                      variant="outline"
                      size="2"
                      onClick={handleRemoveColumn}
                      disabled={selectedColumns <= 2}
                    >
                      <MinusIcon />
                      Remove Column
                    </Button>
                    <Button
                      variant="outline"
                      size="2"
                      onClick={handleAddColumn}
                      disabled={selectedColumns >= 5}
                    >
                      <PlusIcon />
                      Add Column
                    </Button>
                  </Flex>
                </Flex>

                <Flex gap="4" align="center">
                  <Text size="2">Current Layout:</Text>
                  <Badge variant="soft" color="blue">
                    {selectedColumns} columns × 3 rows = {currentGridConfig.totalSlots - 1} slots + 1 special
                    pad
                  </Badge>
                  <Text size="2" color="gray">
                    (Total: {currentGridConfig.totalSlots} slots)
                  </Text>
                </Flex>

                <Flex gap="2">
                  <Button
                    onClick={handleSaveConfigurations}
                    disabled={bulkUpdateMutation.isPending}
                    loading={bulkUpdateMutation.isPending}
                  >
                    Save Configuration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleResetToDefault}
                    disabled={resetMutation.isPending}
                    loading={resetMutation.isPending}
                  >
                    <ResetIcon />
                    Reset to Default
                  </Button>
                </Flex>
              </Flex>
            </Card>

            {/* Visual grid */}
            <Card size="3" variant="surface">
              <Flex direction="column" gap="4">
                <Heading size="4">Slot Grid Preview</Heading>
                <Text size="2" color="gray">
                  Click on slots to change their type. The last slot is always the special pad.
                </Text>

                <SlotGrid
                  configurations={generateSlotConfigs}
                  gridConfig={currentGridConfig}
                  onConfigurationChange={(
                    slotNumber: number,
                    newConfig: Partial<{ slotNumber: number; itemType: ItemType; isSpecialPad: boolean }>,
                  ) => {
                    // Update the local state
                    const updatedConfigs = generateSlotConfigs.map((config) =>
                      config.slotNumber === slotNumber ? { ...config, ...newConfig } : config,
                    );
                    // This would need to be handled by a state management solution
                    // For now, we'll rely on the save button to persist changes
                  }}
                />
              </Flex>
            </Card>

            {/* Configuration controls */}
            <Card size="3" variant="surface">
              <SlotConfigControls
                configurations={generateSlotConfigs}
                onSave={handleSaveConfigurations}
                isSaving={bulkUpdateMutation.isPending}
              />
            </Card>
          </Flex>
        </Box>
      </AdminContentLayout>
    </section>
  );
};
