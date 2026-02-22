import React, { memo, useCallback, useMemo } from 'react';

import { Box } from '@radix-ui/themes';

import { mapGridByColumns } from 'utils/grid.utils';
import { SlotType } from 'types/slots.types';
import { NUM_RELAYS } from 'config/app/slots.config';
import { SlotButton } from './SlotButton';
import { styles } from './SlotGrid.styles';

interface SlotConfig {
  slotNumber: number;
  slotType: SlotType;
  isActive: boolean;
}

interface SlotGridProps {
  configurations: SlotConfig[];
  columns: number;
  rows: number;
  onConfigurationChange: (slotNumber: number, newConfig: Partial<SlotConfig>) => void;
  /** When true, show the grid special slot (Slot 10, red, cycles type) in the special position. */
  showSpecialSlot?: boolean;
  /** When true, show the alt special slot (secondary, no click) in the same special position. */
  showSpecialAltSlot?: boolean;
  /** Slot number to display for the alt special slot. */
  altSlotNumber?: number;
}

const SlotGridComponent: React.FC<SlotGridProps> = ({
  configurations,
  columns,
  rows,
  onConfigurationChange,
  showSpecialSlot = false,
  showSpecialAltSlot = false,
  altSlotNumber = 15,
}) => {
  const activeSlots = useMemo(() => configurations.filter((s) => s.isActive), [configurations]);
  const gridMax = columns * rows;

  const overflowSlots = useMemo(
    () =>
      activeSlots
        .filter((s) => s.slotNumber > gridMax && s.slotNumber !== NUM_RELAYS)
        .sort((a, b) => a.slotNumber - b.slotNumber),
    [activeSlots, gridMax],
  );

  const chosenLastSlot = useMemo(() => {
    if (overflowSlots.length > 0) return overflowSlots[0];
    return activeSlots.find((s) => s.slotNumber === NUM_RELAYS) ?? null;
  }, [overflowSlots, activeSlots]);

  const regularSlots = useMemo(
    () => activeSlots.filter((config) => config !== chosenLastSlot && config.slotNumber !== NUM_RELAYS),
    [activeSlots, chosenLastSlot],
  );

  const lastSlot = chosenLastSlot;

  const getSlotColor = useCallback((slotType: SlotType) => {
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
  }, []);

  // Memoize label getter
  const getSlotLabel = useCallback((slotType: SlotType) => `Type ${slotType}`, []);

  // Memoize click handler to prevent unnecessary re-renders of SlotButton components
  const handleSlotClick = useCallback(
    (slotNumber: number) => {
      const currentConfig = activeSlots.find((config) => config.slotNumber === slotNumber);
      if (!currentConfig) return;

      const typeOrder = [SlotType.A, SlotType.B, SlotType.C];
      const currentIndex = typeOrder.indexOf(currentConfig.slotType);
      const nextIndex = (currentIndex + 1) % typeOrder.length;
      const newSlotType = typeOrder[nextIndex];

      onConfigurationChange(slotNumber, { slotType: newSlotType });
    },
    [activeSlots, onConfigurationChange],
  );

  // Compute grid width to keep consistent spacing across different column counts
  const columnWidth = 120; // px per column
  const gridWidth = `${columns * columnWidth}px`;

  return (
    <Box css={styles}>
      <div className="slot-grid-container">
        <div
          className="slot-grid"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            minWidth: gridWidth,
            maxWidth: gridWidth,
          }}
        >
          {mapGridByColumns({ rows, columns }, (slotNumber) => {
            const config = regularSlots.find((c) => c.slotNumber === slotNumber);
            if (!config) return null;
            return (
              <div key={config.slotNumber} className="slot-grid-item">
                <SlotButton
                  slotNumber={config.slotNumber}
                  slotType={config.slotType}
                  onClick={handleSlotClick}
                  label={getSlotLabel(config.slotType)}
                  color={getSlotColor(config.slotType)}
                />
              </div>
            );
          })}
        </div>
        {showSpecialSlot && lastSlot && (
          <div className="slot-item-special">
            <SlotButton
              slotNumber={lastSlot.slotNumber}
              slotType={lastSlot.slotType}
              onClick={handleSlotClick}
              label={getSlotLabel(lastSlot.slotType)}
              color={getSlotColor(lastSlot.slotType)}
            />
          </div>
        )}
        {showSpecialAltSlot && !showSpecialSlot && (
          <div className="slot-item-special">
            <SlotButton
              slotNumber={altSlotNumber}
              slotType="C"
              label="(alt)"
              color="secondary"
            />
          </div>
        )}
      </div>
    </Box>
  );
};

export const SlotGrid = memo(SlotGridComponent);
