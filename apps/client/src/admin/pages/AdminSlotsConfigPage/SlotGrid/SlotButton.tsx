import React, { memo } from 'react';

import { Flex } from 'styled-system/jsx';
import { Button } from 'components/Button';
import clsx from 'clsx';
interface SlotButtonProps {
  slotNumber: number;
  slotType: string;
  onClick?: (slotNumber: number) => void;
  label: string;
  color: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SlotButton: React.FC<SlotButtonProps> = memo(
  ({ slotNumber, slotType, onClick, label, color, style, className }) => {
    return (
      <Button
        className={clsx(`slot-button slot-${color}`, className)}
        onClick={onClick ? () => onClick(slotNumber) : undefined}
        variant="outline"
        size="md"
        style={style}
      >
        <Flex direction="column" align="center" gap={1}>
          <span>{slotNumber}</span>
          <span>{label}</span>
        </Flex>
      </Button>
    );
  },
);

SlotButton.displayName = 'SlotButton';
