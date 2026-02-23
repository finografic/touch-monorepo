import React, { memo } from 'react';

import { Button, Flex, Text } from '@radix-ui/themes';

interface SlotButtonProps {
  slotNumber: number;
  slotType: string;
  onClick?: (slotNumber: number) => void;
  label: string;
  color: string;
  style?: React.CSSProperties;
}

export const SlotButton: React.FC<SlotButtonProps> = memo(
  ({ slotNumber, slotType, onClick, label, color, style }) => {
    return (
      <Button
        className={`slot-button slot-${color}`}
        onClick={onClick ? () => onClick(slotNumber) : undefined}
        variant="outline"
        size="3"
        style={style}
      >
        <Flex direction="column" align="center" gap="1">
          <Text size="4" weight="bold">
            {slotNumber}
          </Text>
          <Text size="2">{label}</Text>
        </Flex>
      </Button>
    );
  },
);

SlotButton.displayName = 'SlotButton';
