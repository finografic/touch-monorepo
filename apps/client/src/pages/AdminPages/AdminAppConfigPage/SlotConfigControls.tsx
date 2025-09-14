import React from 'react';
import { Box, Button, Flex, Heading, Text } from '@radix-ui/themes';
import type { ItemType } from 'types/orders.types';
import { SelectSimple } from 'forms/SelectSimple';
import { styles } from './SlotConfigControls.styles';

interface SlotConfig {
  slotNumber: number;
  itemType: ItemType;
}

interface SlotConfigControlsProps {
  configurations: SlotConfig[];
  onSave: () => void;
  isSaving: boolean;
  onTypeChange?: (slotNumber: number, newType: ItemType) => void;
}

export const SlotConfigControls: React.FC<SlotConfigControlsProps> = ({
  configurations,
  onSave,
  isSaving,
  onTypeChange,
}) => {
  const getTypeCounts = () => {
    const counts = { A: 0, B: 0, C: 0 };
    configurations.forEach((config) => {
      counts[config.itemType]++;
    });
    return counts;
  };

  const typeCounts = getTypeCounts();

  return (
    <Box css={styles}>
      <Flex direction="column" gap="4">
        <Heading size="4">Configuration Summary</Heading>

        {/* Type distribution */}
        <Box>
          <Text size="2" weight="bold" mb="2">
            Slot Type Distribution:
          </Text>
          <Flex gap="4" wrap="wrap">
            <Text size="2">
              Type A: <strong>{typeCounts.A}</strong>
            </Text>
            <Text size="2">
              Type B: <strong>{typeCounts.B}</strong>
            </Text>
            <Text size="2">
              Type C: <strong>{typeCounts.C}</strong>
            </Text>
          </Flex>
        </Box>

        {/* Configuration grid */}
        <Box>
          <Text size="2" weight="bold" mb="2">
            Current Configuration:
          </Text>
          <div className="config-grid">
            {configurations.map((config) => (
              <div key={config.slotNumber} className="config-grid-item">
                <Text size="2" weight="bold" mb="1">
                  Slot {config.slotNumber}
                </Text>
                <SelectSimple
                  className="slot-select"
                  options={[
                    { value: 'A', label: 'A' },
                    { value: 'B', label: 'B' },
                    { value: 'C', label: 'C' },
                  ]}
                  value={config.itemType}
                  onSelect={(val) => onTypeChange?.(config.slotNumber, val as ItemType)}
                />
              </div>
            ))}
          </div>
        </Box>

        {/* Save button */}
        <Flex justify="end">
          <Button onClick={onSave} disabled={isSaving} loading={isSaving} size="3">
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
