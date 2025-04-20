import { stylesItemsGrid } from './grid.styles';
import type { DrinkVolume } from 'types/models/volume.model';
import { useOrderSelection, OrderFieldKeys } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect } from 'react';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { useGetDrinkVolumes } from 'queries/drink-volumes/useGetDrinkVolumes';
import { ErrorMessage } from 'components/ErrorMessage/ErrorMessage';
import { Loader } from 'components/Loader/Loader';
import { NoItems } from 'components/NoItems/NoItems';

const formatVolume = (volume: DrinkVolume) => {
  // Convert ml to L if volume is 1000ml or more
  if (volume.valueInMl >= 1000) {
    return `${volume.valueInMl / 1000}L`;
  }
  // For volumes less than 1L, show in cl
  return `${volume.valueInMl / 10}cl`;
};

export const DrinkVolumePage = () => {
  const {
    selectedValue: selectedVolume,
    handleSelection: handleVolumeSelection,
    hasValidSelection,
  } = useOrderSelection<DrinkVolume>({
    field: OrderFieldKeys.volume,
  });

  const { setIsNextDisabled } = usePagination();
  const { data, isLoading, error } = useGetDrinkVolumes();

  // Update next button state based on selection
  useEffect(() => {
    setIsNextDisabled(!hasValidSelection);
  }, [hasValidSelection, setIsNextDisabled]);

  if (isLoading) {
    return <Loader message="Loading drink volumes..." />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <section css={stylesItemsGrid}>
      {data?.length ? (
        <div className={getGridFlowClasses(data.length)}>
          {data.map((volume: DrinkVolume) => (
            <div
              key={volume.id}
              className={`item-button ${selectedVolume?.id === volume.id ? 'selected' : ''}`}
              onClick={() => handleVolumeSelection(volume)}
            >
              {formatVolume(volume)}
            </div>
          ))}
        </div>
      ) : (
        <NoItems message="No drink volumes available" />
      )}
    </section>
  );
};
