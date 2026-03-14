import { Slider as ArkSlider } from '@ark-ui/react';
import { createStyleContext } from '@styled-system/jsx';

import { sliderRecipe } from './slider.recipe';

const { withProvider, withContext } = createStyleContext(sliderRecipe);

export const Slider = {
  Root: withProvider(ArkSlider.Root, 'root'),
  Label: withContext(ArkSlider.Label, 'label'),
  ValueText: withContext(ArkSlider.ValueText, 'valueText'),
  Control: withContext(ArkSlider.Control, 'control'),
  Track: withContext(ArkSlider.Track, 'track'),
  Range: withContext(ArkSlider.Range, 'range'),
  Thumb: withContext(ArkSlider.Thumb, 'thumb'),
  MarkerGroup: withContext(ArkSlider.MarkerGroup, 'markerGroup'),
  Marker: withContext(ArkSlider.Marker, 'marker'),
  HiddenInput: ArkSlider.HiddenInput,
};

export type { SliderRootProps, SliderValueChangeDetails } from '@ark-ui/react';
