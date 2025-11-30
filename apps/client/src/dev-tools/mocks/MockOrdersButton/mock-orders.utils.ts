import type { SlotMeta } from 'pages/MainPage/MainPage.types';
import type { SlotItem } from 'types/slot-config.types';

import { SlotType } from 'types/slots.types';
import { MOCK_SELECTED_SLOTS_TEMPLATE } from 'dev-tools/mocks/MockOrdersButton/mock-orders.data';

/**
 * Generate smart random slot assignments
 * - Excludes slots with active timers
 * - Excludes slots that are not active (isActive: false)
 * - Prioritizes user-selected slots
 * - Ensures exactly ONE slot per type (A, B, C) - ONLY if that slot type is available
 * - If a slot type is not available, it is skipped (not replaced with a different type)
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

  // Get available slots (not in timers) with their slotTypes
  const availableSlots = configsToUse
    .filter((config) => !timersSlotNumbers.includes(config.slotNumber))
    .map((config) => config.slotNumber);

  // Create a map of slotNumber -> slotType for quick lookup (only for active slots)
  const slotTypeMap = new Map<number, SlotType>();
  configsToUse.forEach((config) => {
    slotTypeMap.set(config.slotNumber, config.slotType);
  });

  // Track which slots have been assigned to avoid duplicates
  const assignedSlotNumbers = new Set<number>();

  // Generate assignments for each template slotType - ONLY if that type is available
  const assignments: SlotMeta[] = MOCK_SELECTED_SLOTS_TEMPLATE.map((template) => {
    // Find available slots of the exact slotType (not assigned, not in timers)
    const availableSlotsOfType = availableSlots.filter(
      (slotNum) => slotTypeMap.get(slotNum) === template.slotType && !assignedSlotNumbers.has(slotNum),
    );

    // If no slots of this type are available, skip it (return null to filter out later)
    if (availableSlotsOfType.length === 0) {
      return null;
    }

    // Prioritize user-selected slots of this type
    const userSelectedMatching = activeUserSelectedSlots.filter(
      (slot) =>
        slot.slotType === template.slotType &&
        availableSlotsOfType.includes(slot.slotNumber) &&
        !assignedSlotNumbers.has(slot.slotNumber),
    );

    let selectedSlotNumber: number;

    if (userSelectedMatching.length > 0) {
      // Use a user-selected slot of the matching type
      const randomIndex = Math.floor(Math.random() * userSelectedMatching.length);
      selectedSlotNumber = userSelectedMatching[randomIndex].slotNumber;
    } else {
      // No user-selected slots of this type, pick randomly from available slots of this type
      const randomIndex = Math.floor(Math.random() * availableSlotsOfType.length);
      selectedSlotNumber = availableSlotsOfType[randomIndex];
    }

    // Mark as assigned
    assignedSlotNumbers.add(selectedSlotNumber);

    return {
      ...template,
      slotNumber: selectedSlotNumber,
    };
  }).filter((assignment): assignment is SlotMeta => assignment !== null);

  return assignments;
}
