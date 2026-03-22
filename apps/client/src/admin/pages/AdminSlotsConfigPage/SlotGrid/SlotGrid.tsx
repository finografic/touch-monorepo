import React, { memo, useCallback, useMemo } from 'react';

import { mapGridByColumns } from 'utils/grid.utils';
import { SlotType } from 'types/slots.types';
import { ALT_SLOT_NUMBER, NUM_RELAYS } from 'config/app/slots.config';
import { SlotButton } from './SlotButton';
import { styles } from './SlotGrid.styles';

export interface SlotConfig {
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
  /** When true, show the power placeholder (same position as MainPage power button). */
  showPowerSlot?: boolean;
}

const SlotGridComponent: React.FC<SlotGridProps> = ({
  configurations,
  columns,
  rows,
  onConfigurationChange,
  showSpecialSlot = false,
  showSpecialAltSlot = false,
  altSlotNumber = ALT_SLOT_NUMBER,
  showPowerSlot = false,
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
    () =>
      activeSlots.filter((config) => config !== chosenLastSlot && config.slotNumber !== NUM_RELAYS),
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

      onConfigurationChange(slotNumber, {
        slotType: typeOrder[nextIndex],
      });
    },
    [activeSlots, onConfigurationChange],
  );

  // Compute grid width to keep consistent spacing across different column counts
  const columnWidth = 120; // px per column
  const gridWidth = `${columns * columnWidth}px`;

  /**
   * ------------------------------------------------------------------
   * Special row rendering logic (moved OUT of JSX)
   * ------------------------------------------------------------------
   */

  const primarySpecialSlot = useMemo(() => {
    if (showSpecialSlot && lastSlot) {
      return (
        <SlotButton
          slotNumber={lastSlot.slotNumber}
          slotType={lastSlot.slotType}
          onClick={handleSlotClick}
          label={getSlotLabel(lastSlot.slotType)}
          color={getSlotColor(lastSlot.slotType)}
        />
      );
    }

    if (!showSpecialSlot && showSpecialAltSlot) {
      return (
        <SlotButton slotNumber={ALT_SLOT_NUMBER} slotType="C" label="(alt)" color="secondary" />
      );
    }

    return null;
  }, [
    showSpecialSlot,
    showSpecialAltSlot,
    lastSlot,
    altSlotNumber,
    handleSlotClick,
    getSlotLabel,
    getSlotColor,
  ]);

  const secondarySpecialSlot = useMemo(() => {
    if (!(showSpecialSlot && showSpecialAltSlot)) return null;

    return <SlotButton slotNumber={ALT_SLOT_NUMBER} slotType="C" label="(alt)" color="secondary" />;
  }, [showSpecialSlot, showSpecialAltSlot, altSlotNumber]);

  return (
    <div css={styles}>
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

        <div className="slot-special-row">
          <div className="slot-item-special">
            {primarySpecialSlot}

            {showPowerSlot && (
              <SlotButton
                slotNumber={0}
                slotType="C"
                label="power"
                color="power"
                style={{ maxHeight: columns <= 2 ? '202px' : 'auto' }}
              />
            )}
          </div>

          {columns <= 3 && secondarySpecialSlot && (
            <div className="slot-item-special">{secondarySpecialSlot}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export const SlotGrid = memo(SlotGridComponent);
