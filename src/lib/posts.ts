/** Extracts the post slug from a glob-loader entry ID like "honeymoon/003-xxx/index" */
export function postSlugFromId(id: string): string {
  const parts = id.split('/');
  // ID format: [trip-slug]/[post-slug]/index
  return parts[1] ?? parts[0];
}

/** Formats a single date or a start+end range in Australian locale.
 *  Same month:  "3–5 June 2025"  (or "3–5 Jun 2025" with monthStyle:'short')
 *  Same year:   "30 June – 2 July 2025"
 *  Diff year:   "30 December 2024 – 2 January 2025"
 */
export function formatDateRange(start: Date, end?: Date, monthStyle: 'long' | 'short' = 'long'): string {
  if (!end) {
    return start.toLocaleDateString('en-AU', { day: 'numeric', month: monthStyle, year: 'numeric' });
  }

  const sDay = start.toLocaleDateString('en-AU', { day: 'numeric' });
  const eDay = end.toLocaleDateString('en-AU', { day: 'numeric' });
  const sMonth = start.toLocaleDateString('en-AU', { month: monthStyle });
  const eMonth = end.toLocaleDateString('en-AU', { month: monthStyle });
  const sYear = start.getFullYear();
  const eYear = end.getFullYear();

  if (sYear !== eYear) {
    return `${sDay} ${sMonth} ${sYear} – ${eDay} ${eMonth} ${eYear}`;
  }
  if (sMonth !== eMonth) {
    return `${sDay} ${sMonth} – ${eDay} ${eMonth} ${sYear}`;
  }
  return `${sDay}–${eDay} ${eMonth} ${sYear}`;
}
