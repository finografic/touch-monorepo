import { useCalculateTemperature } from 'queries/temperature';
import type { DrinkVolume } from 'types/models/volume.model';
import type { ErrorResponse } from '@workspace/types';
import type { OrderItem } from 'types/orders.types';

export const useTemperatureCalculation = (
  options: {
    onSuccess?: (data: { estimatedDurationSeconds: number }) => void;
    onError?: (error: ErrorResponse) => void;
  } = {},
) => {
  const { mutate: calculateTemp, isPending } = useCalculateTemperature();

  // ======================================================================== //

  /*
  const {
    status,
    data: todos,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  return status === 'pending' ? (
    <span>Loading...</span>
  ) : status === 'error' ? (
    <span>Error: {error.message}</span>
  ) : (
    <>
      {isFetching ? <div>Refreshing...</div> : null}

      <div>
        {todos.map((todo) => (
          <Todo todo={todo} />
        ))}
      </div>
    </>
  )
*/

  // ======================================================================== //

  const calculateForOrder = (order: OrderItem) => {
    if (
      !order?.drinkType ||
      !order?.volume ||
      !order?.containerType ||
      !order?.initialTemperature ||
      !order?.finalTemperature
    ) {
      console.error('Missing required selections');
      return;
    }

    const volume = order.volume as unknown as DrinkVolume;

    calculateTemp(
      {
        drinkTypeId: order.drinkType.id,
        drinkSubtypeId: order.drinkSubtype?.id,
        containerTypeId: order.containerType.id,
        volumeId: volume.id,
        initialTemp: order.initialTemperature.value,
        targetTemp: order.finalTemperature.value,
      },
      {
        onSuccess: (data) => {
          // Store the calculation results in local storage or state management
          localStorage.setItem(`temperatureCalculation_${order.itemNumber}`, JSON.stringify(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          console.error('Failed to calculate temperature:', error);
          options.onError?.(error);
        },
      },
    );
  };

  return {
    calculateForOrder,
    isPending,
  };
};
