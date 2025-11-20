import React, { memo, useMemo } from 'react';

import { PadAction } from 'components/Pads/PadAction/PadAction';
import { PadSlot } from 'components/Pads/PadSlot';

import { mapGridByColumns } from 'utils/grid.utils';
import type { PadActionProps } from 'types/button.types';
import { SlotType } from 'types/slots.types';
import { styles } from './MainPageSlotGrid.styles';

interface SlotConfig {
  slotNumber: number;
  slotType: SlotType;
  isActive: boolean;
}

interface MainPageSlotGridProps {
  slots: SlotConfig[];
  columns: number;
  rows: number;
  contentButtons: PadActionProps[];
}

const NUM_ROWS = 3; // Always 3 rows

const MainPageSlotGridComponent: React.FC<MainPageSlotGridProps> = ({
  slots,
  columns,
  rows = NUM_ROWS,
  contentButtons,
}) => {
  const activeSlots = useMemo(() => slots.filter((s) => s.isActive), [slots]);
  const totalSlots = activeSlots.length;
  const mainGridSlots = activeSlots.slice(0, totalSlots - 1); // All except the last
  const lastSlot = activeSlots[totalSlots - 1]; // The last slot

  // Calculate dynamic width based on columns
  // Each pad is ~110px, gap is 2.5rem (40px), so: (columns * 110) + ((columns - 1) * 40)
  const padWidth = 110;
  const gapSize = 40; // 2.5rem
  const gridWidth = columns * padWidth + (columns - 1) * gapSize;

  return (
    <div css={styles} className="main-page-slot-grid">
      <div className="grid-container" data-columns={columns}>
        {/* Left side: Grid + Special slot */}
        <div className="grid-left-group">
          {/* Main grid */}
          <div
            className="slot-grid"
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              width: `${gridWidth}px`,
            }}
          >
            {mapGridByColumns({ rows, columns }, (slotNumber) => {
              const slot = mainGridSlots.find((s) => s.slotNumber === slotNumber);
              return slot ? (
                <PadSlot key={slot.slotNumber} slotType={slot.slotType} slotNumber={slot.slotNumber} />
              ) : null;
            })}
          </div>

          {/* Special slot (last slot) */}
          <div className="special-slot-container">
            {lastSlot && (
              <PadSlot
                key={lastSlot.slotNumber}
                slotType={SlotType.C}
                slotNumber={lastSlot.slotNumber}
                variant="large"
              />
            )}
            <div className="pad-special power" />
          </div>
        </div>

        {/* Right side: Content buttons (RED and GREEN buttons) */}
        <div className="content-buttons">
          {contentButtons.map((buttonProps) => (
            <PadAction key={buttonProps.id} {...buttonProps} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const MainPageSlotGrid = memo(MainPageSlotGridComponent);
