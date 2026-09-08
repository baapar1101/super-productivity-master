import { getDbDateStr } from '../../../util/get-db-date-str';
import { WorkItemVm } from '../work-item-list.model';
import { CalendarDayVm, CalendarWeekVm } from './work-item-calendar.model';

/** The day a work item sits on: timed due date wins over the all-day one. */
export const workItemDayStr = (item: WorkItemVm): string | null => {
  const { dueWithTime, dueDay } = item.task;
  if (dueWithTime) {
    return getDbDateStr(dueWithTime);
  }
  return dueDay ?? null;
};

/**
 * Builds the month grid: always whole weeks, so the first row can start in the
 * previous month and the last can spill into the next — the shape every
 * month-calendar UI expects.
 *
 * `weekStartsOn` follows the app's locale setting (0 = Sunday … 6 = Saturday).
 */
export const buildMonthGrid = (
  anchor: Date,
  itemsByDay: Record<string, WorkItemVm[]>,
  todayStr: string,
  weekStartsOn = 1,
): CalendarWeekVm[] => {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  // How many days to step back so the grid starts on `weekStartsOn`.
  const lead = (firstOfMonth.getDay() - weekStartsOn + 7) % 7;

  const gridStart = new Date(year, month, 1 - lead);
  const weeks: CalendarWeekVm[] = [];

  // Six rows covers every possible month/offset combination.
  for (let w = 0; w < 6; w++) {
    const days: CalendarDayVm[] = [];
    const weekOffset = w * 7;
    for (let d = 0; d < 7; d++) {
      const dayOffset = weekOffset + d;
      const date = new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + dayOffset,
      );
      const dayStr = getDbDateStr(date);
      days.push({
        dayStr,
        dayOfMonth: date.getDate(),
        isToday: dayStr === todayStr,
        isOtherMonth: date.getMonth() !== month,
        items: itemsByDay[dayStr] ?? [],
      });
    }
    weeks.push({ key: days[0].dayStr, days });

    // Stop once the grid has covered the month and completed the week — a
    // trailing all-next-month row adds nothing.
    const lastDayOffset = weekOffset + 6;
    const lastDay = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + lastDayOffset,
    );
    if (lastDay.getMonth() !== month && lastDay.getDate() >= 7) {
      break;
    }
  }

  return weeks;
};

export const groupItemsByDay = (
  items: readonly WorkItemVm[],
): Record<string, WorkItemVm[]> => {
  const byDay: Record<string, WorkItemVm[]> = {};
  for (const item of items) {
    const day = workItemDayStr(item);
    if (!day) {
      continue;
    }
    (byDay[day] ??= []).push(item);
  }
  return byDay;
};

/** Weekday header labels, rotated to the configured first day of the week. */
export const buildWeekdayLabels = (locale: string, weekStartsOn = 1): string[] => {
  // 2024-01-01 was a Monday, giving a stable reference week.
  const monday = new Date(2024, 0, 1);
  return Array.from({ length: 7 }, (_, i) => {
    const rotation = (i + weekStartsOn + 6) % 7;
    const d = new Date(2024, 0, monday.getDate() + rotation);
    return d.toLocaleDateString(locale, { weekday: 'short' });
  });
};
