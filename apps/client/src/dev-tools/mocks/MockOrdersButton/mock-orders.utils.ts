import type { SlotMeta } from 'pages/MainPage/MainPage.types';
import type { SlotItemConfig } from 'utils/slot-config.utils';

import { SlotType } from 'types/slots.types';
import { MOCK_SELECTED_SLOTS_TEMPLATE } from 'dev-tools/mocks/MockOrdersButton/mock-orders.data';

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
  const allSlots = orderItemsConfig.map((config) => config.slotNumber);
  const availableSlots = allSlots.filter((slotNum) => !timersSlotNumbers.includes(slotNum));

  // Create a map of slotNumber -> slotType for quick lookup
  const slotTypeMap = new Map<number, SlotType>();
  orderItemsConfig.forEach((config) => {
    slotTypeMap.set(config.slotNumber, config.slotType);
  });

  // Track which slots have been assigned to avoid duplicates
  const assignedSlotNumbers = new Set<number>();

  // Generate assignments for each template slotType
  const assignments: SlotMeta[] = MOCK_SELECTED_SLOTS_TEMPLATE.map((template) => {
    const userSelectedMatching = userSelectedSlots.filter(
      (slot) => slot.slotType === template.slotType && !assignedSlotNumbers.has(slot.slotNumber),
    );

    let selectedSlotNumber: number | null = null;

    if (userSelectedMatching.length > 0) {
      const randomIndex = Math.floor(Math.random() * userSelectedMatching.length);
      selectedSlotNumber = userSelectedMatching[randomIndex].slotNumber;
    } else {
      // No matches for this slotType - prioritize user-selected slots (any type) that are available
      // (not in timers and not already assigned)
      const userSelectedAvailable = userSelectedSlots.filter(
        (slot) => !timersSlotNumbers.includes(slot.slotNumber) && !assignedSlotNumbers.has(slot.slotNumber),
      );

      if (userSelectedAvailable.length > 0) {
        const randomIndex = Math.floor(Math.random() * userSelectedAvailable.length);
        selectedSlotNumber = userSelectedAvailable[randomIndex].slotNumber;
      } else {
        // No user-selected slots available, use any available slot (but keep the slotType from template)
        const availableNotAssigned = availableSlots.filter((slotNum) => !assignedSlotNumbers.has(slotNum));

        if (availableNotAssigned.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableNotAssigned.length);
          selectedSlotNumber = availableNotAssigned[randomIndex];
        }
      }
    }

    // Final fallback: if we still don't have a slot, try any user-selected slot (even if it has a timer)
    // This should rarely happen, but provides a last resort
    if (selectedSlotNumber === null) {
      const userSelectedNotAssigned = userSelectedSlots.filter(
        (slot) => !assignedSlotNumbers.has(slot.slotNumber),
      );

      if (userSelectedNotAssigned.length > 0) {
        const randomIndex = Math.floor(Math.random() * userSelectedNotAssigned.length);
        selectedSlotNumber = userSelectedNotAssigned[randomIndex].slotNumber;
      } else {
        // Absolute last resort: use any available slot (shouldn't happen in normal operation)
        const availableNotAssigned = availableSlots.filter((slotNum) => !assignedSlotNumbers.has(slotNum));
        if (availableNotAssigned.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableNotAssigned.length);
          selectedSlotNumber = availableNotAssigned[randomIndex];
        }
      }
    }

    if (selectedSlotNumber !== null) {
      assignedSlotNumbers.add(selectedSlotNumber);
    }

    return {
      ...template,
      slotNumber: selectedSlotNumber || 1,
    };
  });

  return assignments;
}
