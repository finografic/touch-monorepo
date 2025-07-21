import React from 'react';
import { Box, Button, Flex, Heading, Table, Text } from '@radix-ui/themes';
import type { ItemType } from 'types/orders.types';
import { styles } from './SlotConfigControls.styles';

interface SlotConfig {
  slotNumber: number;
  itemType: ItemType;
  isSpecialPad: boolean;
}

interface SlotConfigControlsProps {
  configurations: SlotConfig[];
  onSave: () => void;
  isSaving: boolean;
}

export const SlotConfigControls: React.FC<SlotConfigControlsProps> = ({
  configurations,
  onSave,
  isSaving,
}) => {
  const regularSlots = configurations.filter((config) => !config.isSpecialPad);
  const specialPad = configurations.find((config) => config.isSpecialPad);

  const getTypeCounts = () => {
    const counts = { A: 0, B: 0, C: 0, Special: 0 };
    configurations.forEach((config) => {
      if (config.isSpecialPad) {
        counts.Special++;
      } else {
        counts[config.itemType]++;
      }
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
            <Text size="2">
              Special: <strong>{typeCounts.Special}</strong>
            </Text>
          </Flex>
        </Box>

        {/* Configuration table */}
        <Box>
          <Text size="2" weight="bold" mb="2">
            Current Configuration:
          </Text>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Slot #</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Special Pad</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {regularSlots.map((config) => (
                <Table.Row key={config.slotNumber}>
                  <Table.Cell>{config.slotNumber}</Table.Cell>
                  <Table.Cell>Type {config.itemType}</Table.Cell>
                  <Table.Cell>No</Table.Cell>
                </Table.Row>
              ))}
              {specialPad && (
                <Table.Row>
                  <Table.Cell>{specialPad.slotNumber}</Table.Cell>
                  <Table.Cell>Type {specialPad.itemType}</Table.Cell>
                  <Table.Cell>Yes</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
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
