import React from 'react';
import { Col, Row } from 'react-grid-system';

import { Box, Button, Flex, SegmentedControl, Text } from '@radix-ui/themes';

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

export const RelayAssign: React.FC<RelayAssignProps> = ({
  configurations,
  onRelayToggle,
  isLoading = false,
}) => {
  // Filter configurations to only show relays (1 to NUM_RELAYS)
  const relayConfigurations = configurations.filter((config) => config.slotNumber <= NUM_RELAYS);

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
                      {Array.from({ length: 8 }).map((_, index) => (
                        <Button
                          key={index}
                          className="slot-number"
                          disabled={true}
                          variant="outline"
                          size="3"
                        >
                          <Flex direction="column" align="center" gap="1">
                            <Text size="4" weight="bold">
                              {index + 1}
                            </Text>
                          </Flex>
                        </Button>
                      ))}
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
