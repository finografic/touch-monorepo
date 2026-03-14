import { RadioGroup as ArkRadioGroup } from '@ark-ui/react';
import { createStyleContext } from '@styled-system/jsx';

import { radioGroupRecipe } from './radio-group.recipe';

const { withProvider, withContext } = createStyleContext(radioGroupRecipe);

export const RadioGroup = {
  Root: withProvider(ArkRadioGroup.Root, 'root'),
  Label: withContext(ArkRadioGroup.Label, 'label'),
  Item: withContext(ArkRadioGroup.Item, 'item'),
  ItemControl: withContext(ArkRadioGroup.ItemControl, 'itemControl'),
  Indicator: withContext(ArkRadioGroup.Indicator, 'indicator'),
  ItemText: withContext(ArkRadioGroup.ItemText, 'itemText'),
};

export type { RadioGroupRootProps } from '@ark-ui/react';
