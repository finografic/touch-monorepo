import React from 'react';

import { Box, Button, Flex, Text } from '@radix-ui/themes';

import { mapGridByColumns } from 'utils/grid.utils';
import { SlotType } from 'types/orders.types';
import { NUM_SLOTS } from 'types/slot-config.types';
import { styles } from './SlotGrid.styles';

interface SlotConfig {
  slotNumber: number;
  slotType: SlotType;
  isActive: boolean;
}

interface SlotGridProps {
  configurations: SlotConfig[]; // Only active slots
  columns: number;
  rows: number;
  onConfigurationChange: (slotNumber: number, newConfig: Partial<SlotConfig>) => void;
}

export const SlotGrid: React.FC<SlotGridProps> = ({
  configurations,
  columns,
  rows,
  onConfigurationChange,
}) => {
  // Separate grid slots from the special slot (#16)
  const regularSlots = configurations.filter((config) => config.slotNumber !== NUM_SLOTS);
  const lastSlot = configurations.find((config) => config.slotNumber === NUM_SLOTS);

  const getSlotColor = (slotType: SlotType) => {
    switch (slotType) {
      case SlotType.A:
        return 'default';
      case SlotType.B:
        return 'info';
      case SlotType.C:
        return 'danger';
      default:
        return 'default';
    }
  };

  const getSlotLabel = (slotType: SlotType) => {
    return `Type ${slotType}`;
  };

  const handleSlotClick = (slotNumber: number) => {
    const currentConfig = configurations.find((config) => config.slotNumber === slotNumber);
    if (!currentConfig) return;

    // Cycle through item types: A -> B -> C -> A
    const typeOrder = [SlotType.A, SlotType.B, SlotType.C];
    const currentIndex = typeOrder.indexOf(currentConfig.slotType);
    const nextIndex = (currentIndex + 1) % typeOrder.length;
    const newSlotType = typeOrder[nextIndex];

    onConfigurationChange(slotNumber, { slotType: newSlotType });
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
          {mapGridByColumns({ rows, columns }, (slotNumber) => {
            const config = regularSlots.find((c) => c.slotNumber === slotNumber);
            if (!config) return null;
            return (
              <Flex key={config.slotNumber} className="slot-grid-item">
                <Button
                  className={`slot-button slot-${getSlotColor(config.slotType)}`}
                  onClick={() => handleSlotClick(config.slotNumber)}
                  variant="outline"
                  size="3"
                >
                  <Flex direction="column" align="center" gap="1">
                    <Text size="4" weight="bold">
                      {config.slotNumber}
                    </Text>
                    <Text size="2">{getSlotLabel(config.slotType)}</Text>
                  </Flex>
                </Button>
              </Flex>
            );
          })}
        </div>

        {/* Last slot positioned separately */}
        {lastSlot && (
          <div className="slot-item-special">
            <Button
              className={`slot-button slot-${getSlotColor(lastSlot.slotType)}`}
              onClick={() => {}}
              variant="outline"
              size="3"
            >
              <Flex direction="column" align="center" gap="1">
                <Text size="4" weight="bold">
                  13
                </Text>
                <Text size="2">{getSlotLabel(lastSlot.slotType)}</Text>
              </Flex>
            </Button>
          </div>
        )}
      </div>
    </Box>
  );
};
