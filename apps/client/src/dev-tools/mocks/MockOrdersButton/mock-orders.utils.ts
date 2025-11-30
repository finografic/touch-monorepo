import type { SlotMeta } from 'pages/MainPage/MainPage.types';
import type { SlotItem } from 'apps/client/src/utils/slots.utils';

import { SlotType } from 'types/slots.types';
import { MOCK_SELECTED_SLOTS_TEMPLATE } from 'dev-tools/mocks/MockOrdersButton/mock-orders.data';

/**
 * Generate smart random slot assignments
 * - Excludes slots with active timers
 * - Excludes slots that are not active (isActive: false)
 * - Prioritizes user-selected slots
 * - Tries to match slotType when possible, falls back to any available slot
 */
export function generateSmartMockSlots(
  orderItemsConfig: SlotItem[],
  timersSlotNumbers: number[],
  userSelectedSlots: SlotMeta[],
  activeSlotNumbers?: number[],
): SlotMeta[] {
  // Filter to only include active slots if activeSlotNumbers is provided
  const configsToUse = activeSlotNumbers
    ? orderItemsConfig.filter((config) => activeSlotNumbers.includes(config.slotNumber))
    : orderItemsConfig;

  // Filter user-selected slots to only include active ones
  const activeUserSelectedSlots = activeSlotNumbers
    ? userSelectedSlots.filter((slot) => activeSlotNumbers.includes(slot.slotNumber))
    : userSelectedSlots;

  const allSlots = configsToUse.map((config) => config.slotNumber);
  const availableSlots = allSlots.filter((slotNum) => !timersSlotNumbers.includes(slotNum));

  // Create a map of slotNumber -> slotType for quick lookup (only for active slots)
  const slotTypeMap = new Map<number, SlotType>();
  configsToUse.forEach((config) => {
    slotTypeMap.set(config.slotNumber, config.slotType);
  });

  // Track which slots have been assigned to avoid duplicates
  const assignedSlotNumbers = new Set<number>();

  // Generate assignments for each template slotType
  const assignments: SlotMeta[] = MOCK_SELECTED_SLOTS_TEMPLATE.map((template) => {
    const userSelectedMatching = activeUserSelectedSlots.filter(
      (slot) => slot.slotType === template.slotType && !assignedSlotNumbers.has(slot.slotNumber),
    );

    let selectedSlotNumber: number | null = null;

    if (userSelectedMatching.length > 0) {
      const randomIndex = Math.floor(Math.random() * userSelectedMatching.length);
      selectedSlotNumber = userSelectedMatching[randomIndex].slotNumber;
    } else {
      // No matches for this slotType - prioritize user-selected slots (any type) that are available
      // (not in timers and not already assigned)
      const userSelectedAvailable = activeUserSelectedSlots.filter(
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
      const userSelectedNotAssigned = activeUserSelectedSlots.filter(
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
