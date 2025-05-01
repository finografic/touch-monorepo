import { Outlet, useLoaderData } from 'react-router-dom';
import type { FC } from 'react';
import type { DrinkType } from 'types/models/drink-type.model';
import { LayoutUiProvider } from 'providers/LayoutUiProvider/LayoutUiProvider';
import { NUM_SLOTS_TYPE_B, OrderFieldKeys } from 'constants/app.config';
import type { LayoutUiValues } from 'providers/LayoutUiProvider/LayoutUiContext.types';
import { initPadItems } from 'utils/ui.utils';
import { DevTools } from 'components/DevTools/DevTools';

export const DrinkTypeLayout: FC = () => {
  const drinkTypes = useLoaderData() as DrinkType[] | undefined;

  const initialValue: LayoutUiValues = {
    fieldKey: drinkTypes ? OrderFieldKeys.drinkType : undefined,
    numSlots: NUM_SLOTS_TYPE_B,
    numPads: drinkTypes ? drinkTypes.length : 0,
    pads: initPadItems({ numPads: drinkTypes ? drinkTypes.length : 0, keys: [], type: 'radio' }),
  };

  return (
    <LayoutUiProvider initialValue={initialValue}>
      <Outlet />
      <DevTools />
    </LayoutUiProvider>
  );
};
