export type DateValue = Date | string | number | undefined;

export interface DateRange<T extends DateValue> {
  startDate: T;
  endDate: T;
}
