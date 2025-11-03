import React, { useCallback, useState } from 'react';
import { Col, Row } from 'react-grid-system';

import { Box, Button, Flex, Text } from '@radix-ui/themes';
import clsx from 'clsx';

import type { SlotType } from 'types/orders.types';

import { NUM_RELAYS } from '../relays.config';
import { styles } from './RelayAssign.styles';

interface RelayConfig {
  slotNumber: number;
  slotType: SlotType;
  isOn: boolean;
}

interface RelayAssignProps {
  configurations: RelayConfig[];
  onRelayToggle: (slotNumber: number, newState: boolean) => void;
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

  // State: each row (1-8) has a unique assigned value (1-8) or undefined
  const [assignments, setAssignments] = useState<Assignments>(() => {
    const initial: Assignments = {};
    for (let i = 1; i <= NUM_RELAYS; i++) {
      initial[i] = undefined;
    }
    return initial;
  });

  const handleButtonClick = useCallback((rowNumber: number, buttonValue: number) => {
    setAssignments((prev) => {
      const currentAssignment = prev[rowNumber];

      // If clicking the already-selected button, deselect it
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

  const handleSlotClick = (slotNumber: number) => {
    const currentConfig = relayConfigurations.find((config) => config.slotNumber === slotNumber);
    if (!currentConfig) return;

    // Toggle relay state
    const newIsOn = !currentConfig.isOn;
    onRelayToggle(slotNumber, newIsOn);
  };

  return (
    <Box css={styles}>
      <div className="slot-grid-container">
        {/* Simple 3x3 grid layout for 8 relays */}
        <div className="slot-list">
          {relayConfigurations.map((config) => {
            return (
              <Flex key={config.slotNumber} className="slot-grid-item">
                <Row>
                  <Col xs={2}>
                    <Button className="slot-number" disabled={true} variant="outline" size="3">
                      <Flex direction="column" align="center" gap="1">
                        <Text size="4" weight="bold">
                          {config.slotNumber}
                        </Text>
                      </Flex>
                    </Button>
                  </Col>
                  <Col xs={10}>
                    <Flex direction="row" align="center" gap="3">
                      {Array.from({ length: 8 }).map((_, index) => {
                        const buttonValue = index + 1;
                        const isSelected = assignments[config.slotNumber] === buttonValue;
                        const isUsedByAnotherRow = Object.entries(assignments).some(
                          ([row, value]) => Number(row) !== config.slotNumber && value === buttonValue,
                        );

                        return (
                          <Button
                            key={index}
                            className={clsx(
                              'slot-number',
                              isSelected && 'slot-selected',
                              isUsedByAnotherRow && 'slot-used',
                            )}
                            disabled={isLoading}
                            variant={isSelected ? 'solid' : 'outline'}
                            size="3"
                            onClick={() => handleButtonClick(config.slotNumber, buttonValue)}
                          >
                            <Flex direction="column" align="center" gap="1">
                              <Text size="4" weight="bold">
                                {buttonValue}
                              </Text>
                            </Flex>
                          </Button>
                        );
                      })}
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
