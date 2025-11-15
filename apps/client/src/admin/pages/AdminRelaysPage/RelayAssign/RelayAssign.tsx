import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-grid-system';

import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { SelectCustom } from 'forms/SelectCustom';

import { useBulkUpdateSlotConfigurations } from 'queries/slot-configurations';

import type { SelectOption } from 'types/models/select-option.model';
import { SlotType } from 'types/slots.types';
import { NUM_RELAYS } from '../relays.config';
import { useColors } from 'styles';
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

// Map: rowNumber (1-16) -> selectedValue (1-16 | undefined)
type Assignments = Record<number, number | undefined>;

export const RelayAssign: React.FC<RelayAssignProps> = ({
  configurations,
  onRelayToggle,
  isLoading = false,
}) => {
  const bulkUpdateMutation = useBulkUpdateSlotConfigurations();

  const relayConfigurations = useMemo(() => {
    return configurations
      .filter((config) => config.slotNumber <= NUM_RELAYS)
      .sort((a, b) => a.slotNumber - b.slotNumber);
  }, [configurations]);

  const slotTypeMap = useMemo(() => {
    if (!configurations) return new Map<number, SlotType>();
    return new Map(configurations.map((config) => [config.slotNumber, config.slotType]));
  }, [configurations]);

  // Each slot has a unique relay assignment (1-16 or undefined)
  // Null values from DB are converted to undefined for UI state
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
  useEffect(
    function synchronizeAssignments() {
      const initial: Assignments = {};
      configurations
        .filter((config) => config.slotNumber <= NUM_RELAYS)
        .forEach((config) => {
          initial[config.slotNumber] = config.relayNumber ?? undefined;
        });
      setAssignments(initial);
    },
    [configurations],
  );

  const baseOptions: SelectOption[] = useMemo(() => {
    return Array.from({ length: NUM_RELAYS }, (_, index) => {
      const value = index + 1;
      return { value: value.toString(), label: `Relay ${value}` };
    });
  }, []);

  const updateAllConfigurations = useCallback(
    (newAssignments: Assignments) => {
      const updatedConfigs = configurations.map((config) => {
        // Check if slot is in newAssignments (even if value is undefined)
        const hasAssignment = config.slotNumber in newAssignments;
        const assignment = newAssignments[config.slotNumber];

        if (hasAssignment) {
          // Convert undefined back to null for DB
          return {
            slotNumber: config.slotNumber,
            slotType: config.slotType,
            relayNumber: assignment ?? null,
          };
        }

        return {
          slotNumber: config.slotNumber,
          slotType: config.slotType,
          relayNumber: config.relayNumber,
        };
      });

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

        // Deselect if empty or clicking the same value (toggle behavior)
        if (!selectedValue || currentAssignment === relayValue) {
          const updated = { ...prev, [slotNumber]: undefined };
          updateAllConfigurations(updated);
          return updated;
        }

        // Find any conflicting slot that already has this relay assigned
        const conflictingSlotNumber = Object.keys(prev).find(
          (key) => Number(key) !== slotNumber && prev[Number(key)] === relayValue,
        );

        const updated: Assignments = { ...prev };

        // Swap: clear the conflict and assign to current slot
        if (conflictingSlotNumber) {
          updated[Number(conflictingSlotNumber)] = undefined;
        }
        updated[slotNumber] = relayValue;

        updateAllConfigurations(updated);
        return updated;
      });
    },
    [relayConfigurations, updateAllConfigurations],
  );

  const colors = useColors();

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
      // Can only toggle if relay is assigned
      if (!currentConfig || !currentConfig.relayNumber) return;

      const newIsOn = !currentConfig.isOn;
      onRelayToggle?.(currentConfig.relayNumber, newIsOn);
    },
    [onRelayToggle, relayConfigurations],
  );

  return (
    <Box css={styles}>
      <div className="slot-grid-container">
        <div className="slot-list">
          {/* TODO: ORDER BY *SLOT NUMBER* */}
          {relayConfigurations.map((config) => {
            const configuredSlotType = slotTypeMap.get(config.slotNumber) || config.slotType;

            return (
              <Flex key={config.slotNumber} className="slot-grid-item">
                <Row>
                  <Col xs={1} className="col col-button">
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
                  <Col xs={1} className="col col-type">
                    --
                  </Col>
                  <Col xs={5} className="col col-select">
                    <SelectCustom
                      className="relay-assign-select"
                      options={baseOptions}
                      placeholder="Please select..."
                      value={assignments[config.slotNumber]?.toString() || undefined}
                      onSelect={(value) => handleSelectChange(config.slotNumber, value)}
                      disabled={isLoading || bulkUpdateMutation.isPending}
                      allowEmpty={true}
                    />
                  </Col>
                  <Col xs={5} className="col col-status">
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
