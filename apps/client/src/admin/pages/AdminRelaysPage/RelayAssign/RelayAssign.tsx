import React, { useCallback, useMemo, useState } from 'react';
import { Col, Row } from 'react-grid-system';

import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { SelectCustom } from 'forms/SelectCustom';

import type { SelectOption } from 'types/models/select-option.model';
import { SlotType } from 'types/orders.types';

import { NUM_RELAYS } from '../relays.config';
import { colors } from 'styles';
import { styles } from './RelayAssign.styles';

interface RelayConfig {
  slotNumber: number;
  slotType: SlotType;
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
  // Filter configurations to only show relays (1 to NUM_RELAYS)
  const relayConfigurations = configurations.filter((config) => config.slotNumber <= NUM_RELAYS);

  // Create a map of slotNumber -> slotType from slotConfigs for quick lookup
  const slotTypeMap = useMemo(() => {
    if (!configurations) return new Map<number, SlotType>();
    return new Map(configurations.map((config) => [config.slotNumber, config.slotType]));
  }, [configurations]);

  // State: each row (1-8) has a unique assigned value (1-8) or undefined
  // Initialize with each row having its own row number selected
  const [assignments, setAssignments] = useState<Assignments>(() => {
    const initial: Assignments = {};
    for (let i = 1; i <= NUM_RELAYS; i++) {
      initial[i] = i; // Row 1 = value 1, Row 2 = value 2, etc.
    }
    return initial;
  });

  // Generate dropdown options (1-8)
  const dropdownOptions: SelectOption[] = useMemo(() => {
    return Array.from({ length: NUM_RELAYS }, (_, index) => {
      const value = index + 1;
      return {
        value: value.toString(),
        label: `Relay ${value.toString()}`,
      };
    });
  }, []);

  const handleSelectChange = useCallback((rowNumber: number, selectedValue: string) => {
    const buttonValue = selectedValue ? Number(selectedValue) : undefined;

    setAssignments((prev) => {
      const currentAssignment = prev[rowNumber];

      // If deselecting (empty value), just clear this row
      if (!selectedValue) {
        return { ...prev, [rowNumber]: undefined };
      }

      // If selecting the same value, deselect it
      if (currentAssignment === buttonValue) {
        return { ...prev, [rowNumber]: undefined };
      }

      // Find which row (if any) currently has this buttonValue
      const conflictingRow = Object.entries(prev).find(
        ([row, value]) => Number(row) !== rowNumber && value === buttonValue,
      )?.[0];

      const updated: Assignments = { ...prev };

      // Clear the conflicting row if it exists
      if (conflictingRow) {
        updated[Number(conflictingRow)] = undefined;
      }

      // Assign this value to the current row
      updated[rowNumber] = buttonValue;

      return updated;
    });
  }, []);

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
      // TODO: MUST ASSIGN *RELAY NUMBER* -- NOT, REASSIGN SLOT NUMBER !!!!
      const currentConfig = relayConfigurations.find((config) => config.slotNumber === slotNumber);
      if (!currentConfig) return;

      // Toggle relay state
      const newIsOn = !currentConfig.isOn;
      onRelayToggle(slotNumber, newIsOn);
    },
    [onRelayToggle, relayConfigurations],
  );

  return (
    <Box css={styles}>
      <div className="slot-grid-container">
        <div className="slot-list">
          {/* ====================================================================== */}

          <Flex className="slot-grid-item header">
            <Row>
              <Col xs={2} className="col col-button">
                <Flex direction="column" align="start" gap="1" pl="4">
                  #
                </Flex>
              </Col>
              <Col xs={5} className="col col-select">
                Select Assignment
              </Col>
              <Col xs={5} className="col col-status">
                <Flex align="center" gap="3">
                  Relay Test Status
                </Flex>
              </Col>
            </Row>
          </Flex>

          {/* ====================================================================== */}

          {/* TODO: ORDER BY *SLOT NUMBER* */}
          {relayConfigurations.map((config, i) => {
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
                      options={dropdownOptions}
                      placeholder="Select value..."
                      value={assignments[config.slotNumber]?.toString() || ''}
                      onSelect={(value) => handleSelectChange(config.slotNumber, value)}
                      disabled={isLoading}
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
