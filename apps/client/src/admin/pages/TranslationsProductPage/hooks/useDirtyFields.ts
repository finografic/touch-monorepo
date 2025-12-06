import { useCallback, useMemo } from 'react';

// ============================================================================
// Types
// ============================================================================

interface TranslationItem {
  id: string;
  [key: string]: any;
}

interface UseDirtyFieldsOptions {
  items: TranslationItem[];
  initialItems: TranslationItem[];
  /**
   * Fields to exclude from dirty checking (e.g., 'id', 'drinkTypeId')
   */
  excludeFields?: string[];
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to track dirty fields by comparing current items with initial items
 * Returns a map of itemId -> Set of fieldNames that are dirty
 */
export const useDirtyFields = ({ items, initialItems, excludeFields = ['id'] }: UseDirtyFieldsOptions) => {
  // Create a map of dirty fields: itemId -> Set of fieldNames that are dirty
  const dirtyFieldsMap = useMemo(() => {
    const dirtyMap = new Map<string, Set<string>>();

    if (initialItems.length === 0) return dirtyMap;

    // Create a map of initial items by id for quick lookup
    const initialItemsMap = new Map<string, TranslationItem>();
    initialItems.forEach((item) => {
      initialItemsMap.set(item.id, item);
    });

    // Compare current items with initial items
    items.forEach((currentItem) => {
      const initialItem = initialItemsMap.get(currentItem.id);
      if (!initialItem) {
        // New item - all fields are considered dirty (except excluded fields)
        const dirtyFields = new Set<string>();
        Object.keys(currentItem).forEach((key) => {
          if (!excludeFields.includes(key)) {
            dirtyFields.add(key);
          }
        });
        dirtyMap.set(currentItem.id, dirtyFields);
        return;
      }

      // Compare each field
      const dirtyFields = new Set<string>();
      Object.keys(currentItem).forEach((fieldName) => {
        if (excludeFields.includes(fieldName)) return;
        const currentValue = currentItem[fieldName] || '';
        const initialValue = initialItem[fieldName] || '';
        if (currentValue !== initialValue) {
          dirtyFields.add(fieldName);
        }
      });

      if (dirtyFields.size > 0) {
        dirtyMap.set(currentItem.id, dirtyFields);
      }
    });

    return dirtyMap;
  }, [items, initialItems, excludeFields]);

  // Helper function to check if a field is dirty
  const isFieldDirty = useCallback(
    (itemId: string, fieldName: string): boolean => {
      return dirtyFieldsMap.get(itemId)?.has(fieldName) ?? false;
    },
    [dirtyFieldsMap],
  );

  return {
    dirtyFieldsMap,
    isFieldDirty,
  };
};

