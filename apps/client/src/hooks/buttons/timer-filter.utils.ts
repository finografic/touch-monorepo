import type { SlotMeta } from 'pages/MainPage/MainPage.types';

import type { TimerItem } from 'providers/TimersProvider/timer.types';

/**
 * Filters slots to exclude those with timers that have status "processing" or "completed"
 * This ensures we don't create duplicate timers for slots that already have active or completed timers
 *
 * @param slots - Array of slots to filter (can be SlotMeta[] or slot numbers)
 * @param timers - Array of existing timers
 * @returns Filtered array of slots that don't have "processing" or "completed" timers
 */
export function filterSlotsAvailable<T extends SlotMeta | number>(slots: T[], timers: TimerItem[]): T[] {
  return slots.filter((slot) => {
    const slotNumber = typeof slot === 'number' ? slot : slot.slotNumber;
    const existingTimer = timers.find((t) => t.slotNumber === slotNumber);
    // Only include slots that don't have a timer, or have a timer with status other than "processing" or "completed"
    return !existingTimer || (existingTimer.status !== 'processing' && existingTimer.status !== 'completed');
  });
}
