import type { SlotMeta } from 'pages/MainPage/MainPage.types';
import type { SlotItemConfig } from 'utils/slot-config.utils';

import type { OrderFilters } from 'types/filters.types';
import { SlotType } from 'types/slots.types';

export const MOCK_ORDERS_DATA: OrderFilters = {
  mode: {
    id: 'cmi0ps0wn0002hslw3c3uh5p7',
    name: '3',
  },
  drinkType: {
    id: 'cmi0prxjs00019glwu3cf92hz',
    name: 'vino',
    hasSubtypes: true,
    defaultTempConsume: 15,
  },
  drinkSubtype: {
    id: 'cmi0prxju000a9glwva5pw5i5',
    name: 'blanco',
    defaultTempConsume: 12,
  },
  drinkVolume: {
    id: 'cmi0ps04i0005g7lwxfz5w8kq',
    name: '50cl',
  },
  containerType: {
    id: 'cmi0przbd0000d9lw99ksdmmf',
    name: 'plastico',
  },
};

/**
 * Template for mock slots - defines slotTypes to assign (A, B, C)
 * The actual slotNumbers will be randomly assigned based on availability
 */
export const MOCK_SELECTED_SLOTS_TEMPLATE: Omit<SlotMeta, 'slotNumber'>[] = [
  {
    slotType: SlotType.A,
    isChecked: true,
    status: 'idle',
  },
  {
    slotType: SlotType.B,
    isChecked: true,
    status: 'idle',
  },
  {
    slotType: SlotType.C,
    isChecked: true,
    status: 'idle',
  },
];

/**
 * Generate smart random slot assignments
 * - Excludes slots with active timers
 * - Prioritizes user-selected slots
 * - Tries to match slotType when possible, falls back to any available slot
 */
export function generateSmartMockSlots(
  orderItemsConfig: SlotItemConfig[],
  timersSlotNumbers: number[],
  userSelectedSlots: SlotMeta[],
): SlotMeta[] {
  // Get all available slots from config
  const allSlots = orderItemsConfig.map((config) => config.slotNumber);

  // Filter out slots with timers (blocked slots)
  const availableSlots = allSlots.filter((slotNum) => !timersSlotNumbers.includes(slotNum));

  // Get user-selected slot numbers (prioritized)
  const userSelectedSlotNumbers = userSelectedSlots.map((slot) => slot.slotNumber);

  // Create a map of slotNumber -> slotType for quick lookup
  const slotTypeMap = new Map<number, SlotType>();
  orderItemsConfig.forEach((config) => {
    slotTypeMap.set(config.slotNumber, config.slotType);
  });

  // Track which slots have been assigned to avoid duplicates
  const assignedSlotNumbers = new Set<number>();

  // Generate assignments for each template slotType
  const assignments: SlotMeta[] = MOCK_SELECTED_SLOTS_TEMPLATE.map((template) => {
    // First, prioritize user-selected slots that match the slotType
    const userSelectedMatching = userSelectedSlots.filter(
      (slot) => slot.slotType === template.slotType && !assignedSlotNumbers.has(slot.slotNumber),
    );

    let selectedSlotNumber: number | null = null;

    if (userSelectedMatching.length > 0) {
      // Randomly pick from user-selected matching slots
      const randomIndex = Math.floor(Math.random() * userSelectedMatching.length);
      selectedSlotNumber = userSelectedMatching[randomIndex].slotNumber;
    } else {
      // No user-selected matches, try to find available slots matching slotType
      const availableMatchingType = availableSlots.filter(
        (slotNum) => slotTypeMap.get(slotNum) === template.slotType && !assignedSlotNumbers.has(slotNum),
      );

      if (availableMatchingType.length > 0) {
        // Randomly pick from available slots matching the slotType
        const randomIndex = Math.floor(Math.random() * availableMatchingType.length);
        selectedSlotNumber = availableMatchingType[randomIndex];
      } else {
        // No matches for this slotType, use any available slot (but keep the slotType from template)
        const availableNotAssigned = availableSlots.filter((slotNum) => !assignedSlotNumbers.has(slotNum));

        if (availableNotAssigned.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableNotAssigned.length);
          selectedSlotNumber = availableNotAssigned[randomIndex];
        }
      }
    }

    // If we still don't have a slot, fall back to user-selected slots (any type)
    if (selectedSlotNumber === null) {
      const userSelectedNotAssigned = userSelectedSlots.filter(
        (slot) => !assignedSlotNumbers.has(slot.slotNumber),
      );

      if (userSelectedNotAssigned.length > 0) {
        const randomIndex = Math.floor(Math.random() * userSelectedNotAssigned.length);
        selectedSlotNumber = userSelectedNotAssigned[randomIndex].slotNumber;
      }
    }

    // Final fallback: use any available slot (shouldn't happen in normal operation)
    if (selectedSlotNumber === null && availableSlots.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableSlots.length);
      selectedSlotNumber = availableSlots[randomIndex];
    }

    // Mark as assigned
    if (selectedSlotNumber !== null) {
      assignedSlotNumbers.add(selectedSlotNumber);
    }

    return {
      ...template,
      slotNumber: selectedSlotNumber || 1, // Fallback to 1 if somehow no slot found
    };
  });

  return assignments;
}
