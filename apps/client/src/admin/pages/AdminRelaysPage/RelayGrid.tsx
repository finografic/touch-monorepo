import React from 'react';

import { Box, Button, Flex, Text } from '@radix-ui/themes';

import { SlotType } from 'types/orders.types';

import { NUM_RELAYS } from './relays.config';

import { styles } from './RelayGrid.styles';

interface RelayConfig {
  slotNumber: number;
  slotType: SlotType;
  isOn: boolean;
}

interface RelayGridProps {
  configurations: RelayConfig[];
  onRelayToggle: (slotNumber: number, newState: boolean) => void;
  isLoading?: boolean;
}

export const RelayGrid: React.FC<RelayGridProps> = ({ configurations, onRelayToggle, isLoading = false }) => {
  // Filter configurations to only show relays (1 to NUM_RELAYS)
  const relayConfigurations = configurations.filter((config) => config.slotNumber <= NUM_RELAYS);

  const getSlotColor = (slotType: SlotType, isOn?: boolean) => {
    // If relay is ON, use success color regardless of slot type
    if (isOn) {
      return 'success';
    }

    // Otherwise use the original slot type colors
    switch (slotType) {
      case SlotType.B:
        return 'info';
      case SlotType.C:
        return 'danger';
      case SlotType.A:
      default:
        return 'default';
    }
  };

  const getSlotLabel = (slotType: SlotType, isOn?: boolean) => {
    if (isOn) {
      return 'ON';
    }
    return `Type ${slotType}`;
  };

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
        <div
          className="slot-grid"
          style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            minWidth: '360px',
            columnGap: '4px',
            rowGap: '24px',
          }}
        >
          {relayConfigurations.map((config) => (
            <Flex key={config.slotNumber} className="slot-grid-item">
              <Button
                className={`slot-button slot-${getSlotColor(config.slotType, config.isOn)}`}
                onClick={() => handleSlotClick(config.slotNumber)}
                disabled={isLoading}
                variant="outline"
                size="3"
              >
                <Flex direction="column" align="center" gap="1">
                  <Text size="4" weight="bold">
                    {config.slotNumber}
                  </Text>
                  <Text size="2">{getSlotLabel(config.slotType, config.isOn)}</Text>
                </Flex>
              </Button>
            </Flex>
          ))}
        </div>
      </div>
    </Box>
  );
};
