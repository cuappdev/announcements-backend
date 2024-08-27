/**
 * Checks if a date is before another date.
 *
 * @param startDate The starting date to compare with.
 * @param endDate The ending date to compare to.
 * @returns True if the starting date is before the ending date.
 */
export const isDateBefore = (startDate: Date, endDate: Date): boolean => {
  return startDate < endDate;
};
