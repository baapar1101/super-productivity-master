import {
  buildMonthGrid,
  buildWeekdayLabels,
  groupItemsByDay,
  workItemDayStr,
} from './work-item-calendar.util';
import { WorkItemVm } from '../work-item-list.model';
import { Task } from '../../tasks/task.model';
import { DEFAULT_WORKFLOW_STATES } from '../../workflow-state/workflow-state.const';

const mkItem = (id: string, taskOverrides: Partial<Task> = {}): WorkItemVm => ({
  task: { id, title: id, isDone: false, subTaskIds: [], ...taskOverrides } as Task,
  state: DEFAULT_WORKFLOW_STATES[1],
  priority: 'none',
  labels: [],
  subTaskCount: 0,
});

describe('workItemDayStr', () => {
  it('prefers the timed due date over the all-day one', () => {
    // 2026-03-04T10:00 local
    const ts = new Date(2026, 2, 4, 10, 0).getTime();
    const item = mkItem('a', { dueWithTime: ts, dueDay: '2026-01-01' });
    expect(workItemDayStr(item)).toBe('2026-03-04');
  });

  it('falls back to the all-day due date', () => {
    expect(workItemDayStr(mkItem('b', { dueDay: '2026-05-09' }))).toBe('2026-05-09');
  });

  it('returns null when the item has no due date', () => {
    expect(workItemDayStr(mkItem('c'))).toBeNull();
  });
});

describe('groupItemsByDay', () => {
  it('buckets by day and skips undated items', () => {
    const items = [
      mkItem('a', { dueDay: '2026-03-04' }),
      mkItem('b', { dueDay: '2026-03-04' }),
      mkItem('c', { dueDay: '2026-03-05' }),
      mkItem('d'),
    ];
    const byDay = groupItemsByDay(items);
    expect(Object.keys(byDay).sort()).toEqual(['2026-03-04', '2026-03-05']);
    expect(byDay['2026-03-04'].length).toBe(2);
  });
});

describe('buildMonthGrid', () => {
  // March 2026 starts on a Sunday and has 31 days.
  const anchor = new Date(2026, 2, 15);

  it('starts every week on the configured first day', () => {
    const weeks = buildMonthGrid(anchor, {}, '2026-03-15', 1);
    // Monday-start: the grid opens on Mon 2026-02-23.
    expect(weeks[0].days[0].dayStr).toBe('2026-02-23');
    expect(weeks[0].days.length).toBe(7);
  });

  it('marks days outside the anchor month', () => {
    const weeks = buildMonthGrid(anchor, {}, '2026-03-15', 1);
    expect(weeks[0].days[0].isOtherMonth).toBe(true);
    const mar1 = weeks.flatMap((w) => w.days).find((d) => d.dayStr === '2026-03-01');
    expect(mar1?.isOtherMonth).toBe(false);
  });

  it('covers the whole month', () => {
    const days = buildMonthGrid(anchor, {}, '2026-03-15', 1).flatMap((w) => w.days);
    expect(days.some((d) => d.dayStr === '2026-03-01')).toBe(true);
    expect(days.some((d) => d.dayStr === '2026-03-31')).toBe(true);
  });

  it('flags today', () => {
    const days = buildMonthGrid(anchor, {}, '2026-03-15', 1).flatMap((w) => w.days);
    expect(days.filter((d) => d.isToday).map((d) => d.dayStr)).toEqual(['2026-03-15']);
  });

  it('places items into their day cell', () => {
    const byDay: Record<string, WorkItemVm[]> = {};
    byDay['2026-03-04'] = [mkItem('a', { dueDay: '2026-03-04' })];
    const days = buildMonthGrid(anchor, byDay, '2026-03-15', 1).flatMap((w) => w.days);
    expect(days.find((d) => d.dayStr === '2026-03-04')?.items.length).toBe(1);
    expect(days.find((d) => d.dayStr === '2026-03-05')?.items.length).toBe(0);
  });
});

describe('buildWeekdayLabels', () => {
  it('returns seven labels rotated to the first day of the week', () => {
    const mon = buildWeekdayLabels('en-US', 1);
    const sun = buildWeekdayLabels('en-US', 0);
    expect(mon.length).toBe(7);
    expect(mon[0]).toBe('Mon');
    expect(sun[0]).toBe('Sun');
  });
});
