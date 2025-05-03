import type { PadItem } from 'types/ui.types';
import type { DataEntry } from 'types/data.types';

interface TransformedPad {
  id: string;
  type: PadItem['type'];
  isChecked: boolean;
  // name: string;
  // displayName: string;
  hasSubtypes: boolean;
}

/**
 * Transforms pad items into a flattened structure with specific props.
 * Maintains reactivity by creating new objects only for transformed properties.
 */
export const transformPadData = (pads: PadItem[]): TransformedPad[] => {
  if (!pads?.length) return [];

  return pads.map((pad) => {
    // Keep reference to original metadata to maintain reactivity
    const metadata = pad.metadata as DataEntry & {
      name: string;
      displayName: string;
      hasSubtypes: boolean;
    };

    return {
      // Core pad properties - maintain references
      id: pad.id,
      type: pad.type,
      isChecked: pad.isChecked,
      hasSubtypes: !!metadata?.hasSubtypes,
    };

    /*
    return {
      // Core pad properties - maintain references
      id: pad.id,
      type: pad.type,
      isChecked: pad.isChecked,
      // Flattened metadata properties
      name: metadata?.name || '',
      displayName: metadata?.displayName || '',
      hasSubtypes: !!metadata?.hasSubtypes,
    };
    */
  });
};

/**
 * Type guard to check if an object is a TransformedPad
 */
export const isTransformedPad = (obj: unknown): obj is TransformedPad => {
  if (!obj || typeof obj !== 'object') return false;

  const pad = obj as Partial<TransformedPad>;
  return (
    typeof pad.id === 'string' &&
    typeof pad.type === 'string' &&
    typeof pad.isChecked === 'boolean' &&
    // typeof pad.name === 'string' &&
    // typeof pad.displayName === 'string' &&
    typeof pad.hasSubtypes === 'boolean'
  );
};
