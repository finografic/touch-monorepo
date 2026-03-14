import { Select as ArkSelect } from '@ark-ui/react';
import { createStyleContext } from '@styled-system/jsx';

import { selectRecipe } from './select.recipe';

const { withProvider, withContext } = createStyleContext(selectRecipe);

export const Select = {
  Root: withProvider(ArkSelect.Root, 'root'),
  Label: withContext(ArkSelect.Label, 'label'),
  Control: withContext(ArkSelect.Control, 'control'),
  Trigger: withContext(ArkSelect.Trigger, 'trigger'),
  ValueText: withContext(ArkSelect.ValueText, 'valueText'),
  Indicator: withContext(ArkSelect.Indicator, 'indicator'),
  Positioner: withContext(ArkSelect.Positioner, 'positioner'),
  Content: withContext(ArkSelect.Content, 'content'),
  List: withContext(ArkSelect.List, 'list'),
  Item: withContext(ArkSelect.Item, 'item'),
  ItemText: withContext(ArkSelect.ItemText, 'itemText'),
  ItemIndicator: withContext(ArkSelect.ItemIndicator, 'itemIndicator'),
  ItemGroup: withContext(ArkSelect.ItemGroup, 'itemGroup'),
  ItemGroupLabel: withContext(ArkSelect.ItemGroupLabel, 'itemGroupLabel'),
  ClearTrigger: withContext(ArkSelect.ClearTrigger, 'clearTrigger'),
  HiddenSelect: ArkSelect.HiddenSelect,
};

export type { CollectionItem, ListCollection, SelectValueChangeDetails } from '@ark-ui/react';
export { createListCollection, useListCollection } from '@ark-ui/react';
