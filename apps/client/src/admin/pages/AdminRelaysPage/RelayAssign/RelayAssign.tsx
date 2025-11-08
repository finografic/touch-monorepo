import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-grid-system';

import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { SelectCustom } from 'forms/SelectCustom';

import { useBulkUpdateSlotConfigurations } from 'queries/slot-configurations';

import type { SelectOption } from 'types/models/select-option.model';
import { SlotType } from 'types/orders.types';
import { NUM_RELAYS } from '../relays.config';
import { colors } from 'styles';
import { styles } from './RelayAssign.styles';

interface RelayConfig {
  id: string;
  slotNumber: number;
  slotType: SlotType;
  relayNumber: number | null;
  isOn: boolean;
}

interface RelayAssignProps {
  configurations: RelayConfig[];
  onRelayToggle?: (slotNumber: number, newState: boolean) => void;
  isLoading?: boolean;
}

// Map: rowNumber (1-8) -> selectedValue (1-8 | undefined)
type Assignments = Record<number, number | undefined>;

export const RelayAssign: React.FC<RelayAssignProps> = ({
  configurations,
  onRelayToggle,
  isLoading = false,
}) => {
  const bulkUpdateMutation = useBulkUpdateSlotConfigurations();

  // Filter configurations to only show relays (1 to NUM_RELAYS)
  // Sort by slotNumber ASC
  const relayConfigurations = useMemo(() => {
    return configurations
      .filter((config) => config.slotNumber <= NUM_RELAYS)
      .sort((a, b) => a.slotNumber - b.slotNumber);
  }, [configurations]);

  // Create a map of slotNumber -> slotType from slotConfigs for quick lookup
  const slotTypeMap = useMemo(() => {
    if (!configurations) return new Map<number, SlotType>();
    return new Map(configurations.map((config) => [config.slotNumber, config.slotType]));
  }, [configurations]);

  // State: each row (1-8) has a unique assigned value (1-8) or undefined
  // Initialize with relayNumber from configurations (null becomes undefined)
  const [assignments, setAssignments] = useState<Assignments>(() => {
    const initial: Assignments = {};
    configurations
      .filter((config) => config.slotNumber <= NUM_RELAYS)
      .forEach((config) => {
        initial[config.slotNumber] = config.relayNumber ?? undefined;
      });
    return initial;
  });

  // Synchronize assignments state with configurations prop changes
  // This ensures unique assignment logic works from the first change
  useEffect(() => {
    const initial: Assignments = {};
    configurations
      .filter((config) => config.slotNumber <= NUM_RELAYS)
      .forEach((config) => {
        initial[config.slotNumber] = config.relayNumber ?? undefined;
      });
    setAssignments(initial);
  }, [configurations]);

  // Base dropdown options (1-8)
  const baseOptions: SelectOption[] = useMemo(() => {
    return Array.from({ length: NUM_RELAYS }, (_, index) => {
      const value = index + 1;
      return { value: value.toString(), label: `Relay ${value}` };
    });
  }, []);

  // Helper function to update all configurations in bulk
  const updateAllConfigurations = useCallback(
    (newAssignments: Assignments) => {
      // Build updated configurations array with all slots
      const updatedConfigs = configurations.map((config) => {
        // Check if this slot number exists in newAssignments (even if value is undefined)
        const hasAssignment = config.slotNumber in newAssignments;
        const assignment = newAssignments[config.slotNumber];

        if (hasAssignment) {
          // Slot is explicitly in the assignments map - use its value (undefined -> null)
          return {
            slotNumber: config.slotNumber,
            slotType: config.slotType,
            relayNumber: assignment ?? null,
          };
        }
        // Slot not in assignments - keep existing value
        return {
          slotNumber: config.slotNumber,
          slotType: config.slotType,
          relayNumber: config.relayNumber,
        };
      });

      // Send bulk update with all configurations
      bulkUpdateMutation.mutate({
        configurations: updatedConfigs,
      });
    },
    [configurations, bulkUpdateMutation],
  );

  const handleSelectChange = useCallback(
    (slotNumber: number, selectedValue: string) => {
      const relayValue = selectedValue ? Number(selectedValue) : undefined;
      const config = relayConfigurations.find((c) => c.slotNumber === slotNumber);
      if (!config) return;

      setAssignments((prev) => {
        const currentAssignment = prev[slotNumber];

        // If deselecting (empty value), just clear this row
        if (!selectedValue) {
          const updated = { ...prev, [slotNumber]: undefined };
          // Update all affected configurations in bulk
          updateAllConfigurations(updated);
          return updated;
        }

        // If selecting the same value, deselect it
        if (currentAssignment === relayValue) {
          const updated = { ...prev, [slotNumber]: undefined };
          // Update all affected configurations in bulk
          updateAllConfigurations(updated);
          return updated;
        }

        // Find which row (if any) currently has this relayValue
        const conflictingSlotNumber = Object.keys(prev).find(
          (key) => Number(key) !== slotNumber && prev[Number(key)] === relayValue,
        );

        const updated: Assignments = { ...prev };

        // Clear the conflicting row if it exists
        if (conflictingSlotNumber) {
          updated[Number(conflictingSlotNumber)] = undefined;
        }

        // Assign this value to the current row
        updated[slotNumber] = relayValue;

        // Update all affected configurations in bulk
        updateAllConfigurations(updated);

        return updated;
      });
    },
    [relayConfigurations, updateAllConfigurations],
  );

  const getSlotColor = (slotType: SlotType, isOn = false) => {
    // If relay is ON, use success color regardless of slot type
    if (isOn) {
      return 'success';
    }

    switch (slotType) {
      case SlotType.A:
        return colors.defaultLight;
      case SlotType.B:
        return colors.infoLight;
      case SlotType.C:
        return colors.dangerLight;
      default:
        return colors.defaultLight;
    }
  };

  const handleSlotClick = useCallback(
    (slotNumber: number) => {
      const currentConfig = relayConfigurations.find((config) => config.slotNumber === slotNumber);
      if (!currentConfig || !currentConfig.relayNumber) return;

      // Toggle relay state (only if relayNumber is assigned)
      const newIsOn = !currentConfig.isOn;
      onRelayToggle?.(currentConfig.relayNumber, newIsOn);
    },
    [onRelayToggle, relayConfigurations],
  );

  return (
    <Box css={styles}>
      <div className="slot-grid-container">
        <div className="slot-list">
          {/* ====================================================================== */}

          {/* TODO: ORDER BY *SLOT NUMBER* */}
          {relayConfigurations.map((config) => {
            const configuredSlotType = slotTypeMap.get(config.slotNumber) || config.slotType;

            return (
              <Flex key={config.slotNumber} className="slot-grid-item">
                <Row>
                  <Col xs={2} className="col col-button">
                    {/* ------ RELAY SLOT NUMBER + BUTTON ------ */}
                    <Button
                      className="slot-button"
                      onClick={() => handleSlotClick(config.slotNumber)}
                      disabled={isLoading}
                      variant="outline"
                      style={{
                        boxShadow: `inset 0 0 1px 2px ${getSlotColor(configuredSlotType, config.isOn)}`,
                      }}
                    >
                      <Flex direction="column" align="center" gap="1">
                        <Text
                          size="3"
                          weight="bold"
                          style={{ color: getSlotColor(configuredSlotType, config.isOn) }}
                        >
                          {config.slotNumber}
                        </Text>
                      </Flex>
                    </Button>
                  </Col>
                  <Col xs={5} className="col col-select">
                    {/* ------ SELECT ASSIGNMENT ------ */}
                    <SelectCustom
                      className="relay-assign-select"
                      options={baseOptions}
                      placeholder="Please select..."
                      value={config.relayNumber?.toString() || undefined}
                      onSelect={(value) => handleSelectChange(config.slotNumber, value)}
                      disabled={isLoading || bulkUpdateMutation.isPending}
                    />
                  </Col>
                  <Col xs={5} className="col col-status">
                    {/* ------ RELAY TEST STATUS ------ */}
                    <Flex align="center" gap="3">
                      <div className={`relay-status-indicator ${config.isOn ? 'relay-on' : 'relay-off'}`}>
                        {config.slotNumber}
                      </div>
                      <Text size="3" className={config.isOn ? 'relay-status-on' : 'relay-status-off'}>
                        Relay {config.slotNumber}: {config.isOn ? 'ON' : 'OFF'}
                      </Text>
                    </Flex>
                  </Col>
                </Row>
              </Flex>
            );
          })}
        </div>
      </div>
    </Box>
  );
};
