import type { DevLayerProviderProps, DevLayerStore } from './DevLayer.types';
import { DevLayer } from './DevLayerContext';

export const DevLayerProvider = ({ initialValue, children }: DevLayerProviderProps) => {
  return (
    <DevLayer.Provider initialValue={{ ...initialValue } as DevLayerStore}>{children}</DevLayer.Provider>
  );
};
