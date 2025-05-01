import { stylesItemsGrid } from './grid.styles';
import type { ContainerType } from 'types/orders.types';
import { useOrderSelection } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect } from 'react';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { useGetContainerTypes } from 'queries/container-types';
import { OrderFieldKeys } from 'constants/app.config';

export const ContainerTypePage = () => {
  const {
    selectedValue: selectedContainer,
    handleSelection: handleContainerSelection,
    hasValidSelection,
  } = useOrderSelection<ContainerType>({
    field: OrderFieldKeys.containerType,
  });

  const { setIsNextDisabled } = usePagination();
  const { data: containerTypes, isLoading, error } = useGetContainerTypes();

  // Update next button state based on selection
  useEffect(() => {
    setIsNextDisabled(!hasValidSelection);
  }, [hasValidSelection, setIsNextDisabled]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !containerTypes) {
    return <div>Error loading container types</div>;
  }

  return (
    <section css={stylesItemsGrid}>
      <div className={getGridFlowClasses(containerTypes.length)}>
        {containerTypes.map((containerType: ContainerType) => (
          <div
            key={containerType.id}
            className={`item-button ${selectedContainer?.id === containerType.id ? 'selected' : ''}`}
            onClick={() => handleContainerSelection(containerType)}
          >
            {containerType.displayName}
          </div>
        ))}
      </div>
    </section>
  );
};
