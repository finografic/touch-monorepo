import { stylesItemsGrid } from './items-grid.styles';
import type { Volume } from 'types/orders.types';
import { VOLUMES } from './data/volume.data';
import { useOrderSelection, OrderFieldKeys } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect } from 'react';
import { getGridFlowClasses } from './utils/getGridFlowClasses';

const formatVolume = (volume: Volume): string => {
  if (volume.unit === 'L') {
    return `${volume.amount}L`;
  }
  // For centiliters, check if we need to format with a comma
  if (volume.unit === 'cl') {
    return `${volume.amount}cl`;
  }
  return `${volume.amount}${volume.unit}`;
};

export const DrinkVolumePage = () => {
  const {
    selectedValue: selectedVolume,
    handleSelection: handleVolumeSelection,
    hasValidSelection,
  } = useOrderSelection<Volume>({
    field: OrderFieldKeys.volume,
  });

  const { setIsNextDisabled } = usePagination();

  // Update next button state based on selection
  useEffect(() => {
    setIsNextDisabled(!hasValidSelection);
  }, [hasValidSelection, setIsNextDisabled]);

  return (
    <section css={stylesItemsGrid}>
      <div className={getGridFlowClasses(VOLUMES.length)}>
        {VOLUMES.map((volume) => (
          <div
            key={`${volume.amount}${volume.unit}`}
            className={`item-button ${selectedVolume?.amount === volume.amount && selectedVolume?.unit === volume.unit ? 'selected' : ''}`}
            onClick={() => handleVolumeSelection(volume)}
          >
            {formatVolume(volume)}
          </div>
        ))}
      </div>
    </section>
  );
};
