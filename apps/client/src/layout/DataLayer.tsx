import { useLoaderData, useMatches } from 'react-router-dom';
import type { FC, ReactNode } from 'react';
import type { DrinkType } from 'types/models/drink-type.model';
import { LayoutUiProvider } from 'providers/LayoutUiProvider/LayoutUiProvider';
import { NUM_SLOTS_TYPE_B, OrderFieldKeys } from 'constants/app.config';
import type { LayoutUiValues } from 'providers/LayoutUiProvider/LayoutUiContext.types';
import { initPadItems } from 'utils/ui.utils';
import { DevTools } from 'components/DevTools/DevTools';
import type { OrderFieldKey } from 'types/orders.types';

export const DataLayer: FC<{ children: ReactNode }> = ({ children }) => {
  // Get the current route match that has an ID
  const matches = useMatches();
  const routeMatch = matches.find(
    (match) => match.id && Object.values(OrderFieldKeys).includes(match.id as OrderField),
  );
  const currentFieldKey = routeMatch?.id as OrderField | undefined;

  // Get the loader data for the current route
  const loaderData = useLoaderData();
  const numPads = Array.isArray(loaderData) ? loaderData.length : 0;

  log('LOADER_DATA', 'hotpink', { loaderData });

  const initialValue: LayoutUiValues = {
    fieldKey: currentFieldKey,
    numSlots: NUM_SLOTS_TYPE_B,
    numPads,
    pads: initPadItems({ numPads, keys: [], type: 'radio' }),
  };

  return (
    <LayoutUiProvider initialValue={initialValue}>
      {children}
      <DevTools />
    </LayoutUiProvider>
  );
};
