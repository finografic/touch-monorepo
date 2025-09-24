import React from 'react';
import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { SlotType } from 'types/orders.types';
import type { GridConfig } from 'types/slot-config.types';
import { styles } from './RelayGrid.styles';
import { NUM_RELAYS } from './relays.config';

interface SlotConfig {
  slotNumber: number;
  slotType: SlotType;
  isOn?: boolean; // New: relay state
}

interface SlotGridProps {
  configurations: SlotConfig[];
  gridConfig: GridConfig;
  onConfigurationChange: (slotNumber: number, newConfig: Partial<SlotConfig>) => void;
}

export const RelayGrid: React.FC<SlotGridProps> = ({ configurations, gridConfig, onConfigurationChange }) => {
  const { columns, rows } = gridConfig;
  const totalSlots = gridConfig.totalSlots;

  // Filter configurations to only show relays (1 to NUM_RELAYS)
  const relayConfigurations = configurations.filter((config) => config.slotNumber <= NUM_RELAYS);
  const regularSlots = relayConfigurations.filter((config) => config.slotNumber < totalSlots);
  const lastSlot = relayConfigurations.find((config) => config.slotNumber === totalSlots);

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

    // Toggle relay state instead of cycling through slot types
    const newIsOn = !currentConfig.isOn;
    onConfigurationChange(slotNumber, { isOn: newIsOn });
  };

  return (
    <Box css={styles}>
      <div className="slot-grid-container">
        {/* Main grid */}
        <div
          className="slot-grid"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            minWidth: columns <= 3 ? '360px' : columns === 4 ? '480px' : '600px',
          }}
        >
          {regularSlots.map((config) => (
            <Flex key={config.slotNumber} className="slot-grid-item">
              <Button
                className={`slot-button slot-${getSlotColor(config.slotType, config.isOn)}`}
                onClick={() => handleSlotClick(config.slotNumber)}
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

        {/* Last slot positioned separately */}
        {lastSlot && (
          <div className="slot-item-special">
            <Button
              className={`slot-button slot-${getSlotColor(lastSlot.slotType, lastSlot.isOn)}`}
              onClick={() => handleSlotClick(lastSlot.slotNumber)}
              variant="outline"
              size="3"
            >
              <Flex direction="column" align="center" gap="1">
                <Text size="4" weight="bold">
                  {lastSlot.slotNumber}
                </Text>
                <Text size="2">{getSlotLabel(lastSlot.slotType, lastSlot.isOn)}</Text>
              </Flex>
            </Button>
          </div>
        )}
      </div>
    </Box>
  );
};
