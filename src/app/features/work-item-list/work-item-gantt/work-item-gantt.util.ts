import { getDbDateStr } from '../../../util/get-db-date-str';
import { WorkItemVm } from '../work-item-list.model';
import { workItemDayStr } from '../work-item-calendar/work-item-calendar.util';
import { GanttBarVm, GanttDayVm, GanttDragMode } from './work-item-gantt.model';

/** Parses YYYY-MM-DD as a local date (never UTC — the whole app is local-day based). */
export const parseDayStr = (dayStr: string): Date => {
  const [y, m, d] = dayStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (dayStr: string, days: number): string => {
  const d = parseDayStr(dayStr);
  d.setDate(d.getDate() + days);
  return getDbDateStr(d);
};

export const diffDays = (fromDayStr: string, toDayStr: string): number => {
  const a = parseDayStr(fromDayStr);
  const b = parseDayStr(toDayStr);
  // Normalise to midday so a DST shift inside the range can't round the
  // division down to the previous day.
  a.setHours(12, 0, 0, 0);
  b.setHours(12, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / 86400000);
};

/** The span a work item occupies: `startDay`..`dueDay`, or a single day. */
export const itemSpan = (
  item: WorkItemVm,
): { startDay: string; endDay: string } | null => {
  const end = workItemDayStr(item);
  if (!end) {
    return null;
  }
  const start = item.task.startDay ?? end;
  // A start after the end would render a negative bar — clamp to a single day.
  return diffDays(start, end) < 0
    ? { startDay: end, endDay: end }
    : { startDay: start, endDay: end };
};

/**
 * The window the timeline covers: every dated item, padded so bars never touch
 * the edges, and always including today.
 */
export const timelineRange = (
  items: readonly WorkItemVm[],
  todayStr: string,
  padDays = 7,
): { startDay: string; endDay: string } => {
  const spans = items.map(itemSpan).filter((s): s is NonNullable<typeof s> => !!s);

  let min = todayStr;
  let max = todayStr;
  for (const s of spans) {
    if (diffDays(min, s.startDay) < 0) min = s.startDay;
    if (diffDays(max, s.endDay) > 0) max = s.endDay;
  }
  return { startDay: addDays(min, -padDays), endDay: addDays(max, padDays) };
};

export const buildDayColumns = (
  startDay: string,
  endDay: string,
  todayStr: string,
  // Passed in (not read from navigator) so month labels follow the app's UI
  // language rather than the browser's.
  locale = 'en',
): GanttDayVm[] => {
  const total = diffDays(startDay, endDay) + 1;
  const days: GanttDayVm[] = [];
  let lastMonth = -1;

  for (let i = 0; i < total; i++) {
    const dayStr = addDays(startDay, i);
    const date = parseDayStr(dayStr);
    const month = date.getMonth();
    const dow = date.getDay();
    days.push({
      dayStr,
      dayOfMonth: date.getDate(),
      isToday: dayStr === todayStr,
      isWeekend: dow === 0 || dow === 6,
      monthLabel:
        month !== lastMonth
          ? date.toLocaleDateString(locale, { month: 'short', year: 'numeric' })
          : undefined,
    });
    lastMonth = month;
  }
  return days;
};

export const buildBars = (
  items: readonly WorkItemVm[],
  timelineStart: string,
): GanttBarVm[] =>
  items
    .map((item) => {
      const span = itemSpan(item);
      if (!span) {
        return null;
      }
      return {
        item,
        startOffset: diffDays(timelineStart, span.startDay),
        lengthDays: diffDays(span.startDay, span.endDay) + 1,
      };
    })
    .filter((b): b is GanttBarVm => !!b);

/**
 * Applies a drag of `deltaDays` to a bar.
 *
 * `move` shifts both ends; the resize handles move one end and refuse to cross
 * the other, so a bar can never invert or shrink below a single day.
 */
export const applyGanttDrag = (
  span: { startDay: string; endDay: string },
  mode: GanttDragMode,
  deltaDays: number,
): { startDay: string; endDay: string } => {
  if (deltaDays === 0) {
    return span;
  }

  if (mode === 'move') {
    return {
      startDay: addDays(span.startDay, deltaDays),
      endDay: addDays(span.endDay, deltaDays),
    };
  }

  if (mode === 'resize-start') {
    const nextStart = addDays(span.startDay, deltaDays);
    return diffDays(nextStart, span.endDay) < 0
      ? { startDay: span.endDay, endDay: span.endDay }
      : { startDay: nextStart, endDay: span.endDay };
  }

  const nextEnd = addDays(span.endDay, deltaDays);
  return diffDays(span.startDay, nextEnd) < 0
    ? { startDay: span.startDay, endDay: span.startDay }
    : { startDay: span.startDay, endDay: nextEnd };
};
