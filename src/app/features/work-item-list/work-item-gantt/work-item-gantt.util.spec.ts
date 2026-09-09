import {
  addDays,
  applyGanttDrag,
  buildBars,
  buildDayColumns,
  diffDays,
  itemSpan,
  timelineRange,
} from './work-item-gantt.util';
import { WorkItemVm } from '../work-item-list.model';
import { Task } from '../../tasks/task.model';
import { DEFAULT_WORKFLOW_STATES } from '../../workflow-state/workflow-state.const';

const mkItem = (
  id: string,
  opts: { dueDay?: string; startDay?: string } = {},
): WorkItemVm => ({
  task: {
    id,
    title: id,
    isDone: false,
    subTaskIds: [],
    dueDay: opts.dueDay,
    startDay: opts.startDay,
  } as unknown as Task,
  state: DEFAULT_WORKFLOW_STATES[1],
  priority: 'none',
  labels: [],
  subTaskCount: 0,
});

describe('date helpers', () => {
  it('adds and subtracts days across a month boundary', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01');
  });

  it('counts whole days between dates', () => {
    expect(diffDays('2026-03-01', '2026-03-05')).toBe(4);
    expect(diffDays('2026-03-05', '2026-03-01')).toBe(-4);
    expect(diffDays('2026-03-01', '2026-03-01')).toBe(0);
  });

  it('is DST-safe across a spring-forward boundary', () => {
    // Europe/Berlin springs forward on 2026-03-29.
    expect(diffDays('2026-03-28', '2026-03-30')).toBe(2);
  });
});

describe('itemSpan', () => {
  it('returns null for an item with no due date', () => {
    expect(itemSpan(mkItem('a'))).toBeNull();
  });

  it('treats a due date with no start as a single day', () => {
    expect(itemSpan(mkItem('a', { dueDay: '2026-03-04' }))).toEqual({
      startDay: '2026-03-04',
      endDay: '2026-03-04',
    });
  });

  it('spans start → due when both are set', () => {
    expect(
      itemSpan(mkItem('a', { startDay: '2026-03-01', dueDay: '2026-03-04' })),
    ).toEqual({ startDay: '2026-03-01', endDay: '2026-03-04' });
  });

  it('clamps an inverted span to a single day', () => {
    expect(
      itemSpan(mkItem('a', { startDay: '2026-03-09', dueDay: '2026-03-04' })),
    ).toEqual({ startDay: '2026-03-04', endDay: '2026-03-04' });
  });
});

describe('timelineRange', () => {
  it('always covers today even with no items', () => {
    const r = timelineRange([], '2026-03-15', 7);
    expect(r.startDay).toBe('2026-03-08');
    expect(r.endDay).toBe('2026-03-22');
  });

  it('stretches to cover every dated item, padded', () => {
    const items = [
      mkItem('a', { dueDay: '2026-04-10' }),
      mkItem('b', { startDay: '2026-02-01', dueDay: '2026-02-05' }),
    ];
    const r = timelineRange(items, '2026-03-15', 7);
    expect(r.startDay).toBe('2026-01-25');
    expect(r.endDay).toBe('2026-04-17');
  });
});

describe('buildDayColumns', () => {
  it('emits one column per day, inclusive', () => {
    const days = buildDayColumns('2026-03-01', '2026-03-05', '2026-03-03');
    expect(days.length).toBe(5);
    expect(days.filter((d) => d.isToday).map((d) => d.dayStr)).toEqual(['2026-03-03']);
  });

  it('labels only the first day of each month', () => {
    const days = buildDayColumns('2026-02-27', '2026-03-02', '2026-03-01');
    expect(days.filter((d) => d.monthLabel).map((d) => d.dayStr)).toEqual([
      '2026-02-27',
      '2026-03-01',
    ]);
  });

  it('flags weekends', () => {
    // 2026-03-07 is a Saturday.
    const days = buildDayColumns('2026-03-07', '2026-03-09', '2026-03-07');
    expect(days.map((d) => d.isWeekend)).toEqual([true, true, false]);
  });
});

describe('buildBars', () => {
  it('offsets and sizes bars relative to the timeline start', () => {
    const items = [mkItem('a', { startDay: '2026-03-03', dueDay: '2026-03-05' })];
    const [bar] = buildBars(items, '2026-03-01');
    expect(bar.startOffset).toBe(2);
    expect(bar.lengthDays).toBe(3);
  });

  it('skips undated items', () => {
    expect(buildBars([mkItem('a')], '2026-03-01').length).toBe(0);
  });
});

describe('applyGanttDrag', () => {
  const span = { startDay: '2026-03-03', endDay: '2026-03-06' };

  it('shifts both ends on a move', () => {
    expect(applyGanttDrag(span, 'move', 2)).toEqual({
      startDay: '2026-03-05',
      endDay: '2026-03-08',
    });
  });

  it('moves only the dragged edge on a resize', () => {
    expect(applyGanttDrag(span, 'resize-start', 1).startDay).toBe('2026-03-04');
    expect(applyGanttDrag(span, 'resize-start', 1).endDay).toBe('2026-03-06');
    expect(applyGanttDrag(span, 'resize-end', 2).endDay).toBe('2026-03-08');
  });

  it('refuses to invert the bar when a handle crosses the other edge', () => {
    expect(applyGanttDrag(span, 'resize-start', 10)).toEqual({
      startDay: '2026-03-06',
      endDay: '2026-03-06',
    });
    expect(applyGanttDrag(span, 'resize-end', -10)).toEqual({
      startDay: '2026-03-03',
      endDay: '2026-03-03',
    });
  });

  it('is a no-op for a zero delta', () => {
    expect(applyGanttDrag(span, 'move', 0)).toBe(span);
  });
});
