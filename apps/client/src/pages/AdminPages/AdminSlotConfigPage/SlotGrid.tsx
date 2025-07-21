import React from 'react';
import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { ItemType } from 'types/orders.types';
import type { GridConfig } from 'types/slot-config.types';
import { styles } from './SlotGrid.styles';

interface SlotConfig {
  slotNumber: number;
  itemType: ItemType;
  isSpecialPad: boolean;
}

interface SlotGridProps {
  configurations: SlotConfig[];
  gridConfig: GridConfig;
  onConfigurationChange: (slotNumber: number, newConfig: Partial<SlotConfig>) => void;
}

export const SlotGrid: React.FC<SlotGridProps> = ({ configurations, gridConfig, onConfigurationChange }) => {
  const { columns, rows } = gridConfig;
  const regularSlots = configurations.filter((config) => !config.isSpecialPad);
  const specialPad = configurations.find((config) => config.isSpecialPad);

  const getSlotColor = (itemType: ItemType, isSpecialPad: boolean) => {
    if (isSpecialPad) return 'red';
    switch (itemType) {
      case ItemType.A:
        return 'gray';
      case ItemType.B:
        return 'blue';
      case ItemType.C:
        return 'green';
      default:
        return 'gray';
    }
  };

  const getSlotLabel = (itemType: ItemType, isSpecialPad: boolean) => {
    if (isSpecialPad) return 'Special';
    return `Type ${itemType}`;
  };

  const handleSlotClick = (slotNumber: number) => {
    const currentConfig = configurations.find((config) => config.slotNumber === slotNumber);
    if (!currentConfig) return;

    // For special pad, don't allow type changes
    if (currentConfig.isSpecialPad) return;

    // Cycle through item types: A -> B -> C -> A
    const typeOrder = [ItemType.A, ItemType.B, ItemType.C];
    const currentIndex = typeOrder.indexOf(currentConfig.itemType);
    const nextIndex = (currentIndex + 1) % typeOrder.length;
    const newItemType = typeOrder[nextIndex];

    onConfigurationChange(slotNumber, { itemType: newItemType });
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
          }}
        >
          {regularSlots.map((config) => (
            <Button
              key={config.slotNumber}
              className={`slot-button slot-${getSlotColor(config.itemType, config.isSpecialPad)}`}
              onClick={() => handleSlotClick(config.slotNumber)}
              variant="outline"
              size="3"
              color={getSlotColor(config.itemType, config.isSpecialPad)}
              style={{
                borderColor: getSlotColor(config.itemType, config.isSpecialPad),
              }}
            >
              <Flex direction="column" align="center" gap="1">
                <Text size="4" weight="bold">
                  {config.slotNumber}
                </Text>
                <Text size="2">{getSlotLabel(config.itemType, config.isSpecialPad)}</Text>
              </Flex>
            </Button>
          ))}
        </div>

        {/* Special pad */}
        {specialPad && (
          <div className="special-pad-container">
            <Button
              className={`slot-button slot-${getSlotColor(specialPad.itemType, specialPad.isSpecialPad)}`}
              onClick={() => handleSlotClick(specialPad.slotNumber)}
              variant="outline"
              size="3"
              color="red"
              style={{
                borderColor: 'red',
              }}
            >
              <Flex direction="column" align="center" gap="1">
                <Text size="4" weight="bold">
                  {specialPad.slotNumber}
                </Text>
                <Text size="2">{getSlotLabel(specialPad.itemType, specialPad.isSpecialPad)}</Text>
              </Flex>
            </Button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="slot-legend">
        <Text size="2" weight="bold">
          Slot Types:
        </Text>
        <Flex gap="5" wrap="wrap" mt="3">
          <Flex align="center" gap="2">
            <div className="legend-item legend-type-a">A</div>
            <Text size="2">Type A</Text>
          </Flex>
          <Flex align="center" gap="2">
            <div className="legend-item legend-type-b">B</div>
            <Text size="2">Type B</Text>
          </Flex>
          <Flex align="center" gap="2">
            <div className="legend-item legend-type-c">C</div>
            <Text size="2">Type C</Text>
          </Flex>
          <Flex align="center" gap="2">
            <div className="legend-item legend-special">S</div>
            <Text size="2">Special Pad</Text>
          </Flex>
        </Flex>
      </div>

      <hr />
    </Box>
  );
};
