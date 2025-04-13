import { stylesItemsGrid } from './items-grid.styles';
import type { ContainerType } from 'types/orders.types';
import { CONTAINER_TYPES } from './container-type.data';
import { useOrderSelection, OrderFieldKeys } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect } from 'react';

export const ContainerTypePage = () => {
  const {
    selectedValue: selectedContainer,
    handleSelection: handleContainerSelection,
    hasValidSelection,
  } = useOrderSelection<ContainerType>({
    field: OrderFieldKeys.containerType,
  });

  const { setIsNextDisabled } = usePagination();

  // Update next button state based on selection
  useEffect(() => {
    setIsNextDisabled(!hasValidSelection);
  }, [hasValidSelection, setIsNextDisabled]);

  return (
    <section css={stylesItemsGrid}>
      <div className="items-grid">
        {CONTAINER_TYPES.map((containerType) => (
          <div
            key={containerType.id}
            className={`item-button ${selectedContainer?.id === containerType.id ? 'selected' : ''}`}
            onClick={() => handleContainerSelection(containerType)}
          >
            {containerType.name}
          </div>
        ))}
      </div>
    </section>
  );
};
