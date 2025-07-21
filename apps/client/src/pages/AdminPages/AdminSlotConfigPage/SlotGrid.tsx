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
    if (isSpecialPad) return 'danger';
    switch (itemType) {
      case ItemType.A:
        return 'default';
      case ItemType.B:
        return 'info';
      case ItemType.C:
        return 'danger';
      default:
        return 'default';
    }
  };

  const getSlotLabel = (itemType: ItemType, isSpecialPad: boolean) => {
    if (isSpecialPad) return 'Special'; // Keep "Special" label for special pad
    return `Type ${itemType}`;
  };

  const handleSlotClick = (slotNumber: number) => {
    const currentConfig = configurations.find((config) => config.slotNumber === slotNumber);
    if (!currentConfig) return;

    // For special pad, don't allow type changes (it's always Type C)
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
              style={{ pointerEvents: 'auto' }}
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
              style={{ pointerEvents: 'auto' }}
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
        </Flex>
      </div>

      <hr />
    </Box>
  );
};
