import { nextSort, sortWorkItems } from './work-item-spreadsheet.util';
import { WorkItemVm } from '../work-item-list.model';
import { Task } from '../../tasks/task.model';
import { DEFAULT_WORKFLOW_STATES } from '../../workflow-state/workflow-state.const';
import { IssuePriority } from '../../../ui/plane-priority-icon/plane-priority-icon.component';

const mkItem = (
  id: string,
  opts: { priority?: IssuePriority; title?: string; dueDay?: string; subs?: number } = {},
): WorkItemVm => ({
  task: {
    id,
    title: opts.title ?? id,
    isDone: false,
    subTaskIds: Array.from({ length: opts.subs ?? 0 }, (_, i) => `${id}-${i}`),
    dueDay: opts.dueDay,
  } as Task,
  state: DEFAULT_WORKFLOW_STATES[1],
  priority: opts.priority ?? 'none',
  labels: [],
  subTaskCount: opts.subs ?? 0,
});

describe('sortWorkItems', () => {
  it('returns the input order when unsorted', () => {
    const items = [mkItem('b'), mkItem('a')];
    expect(sortWorkItems(items, null).map((i) => i.task.id)).toEqual(['b', 'a']);
  });

  it('sorts titles alphabetically both ways', () => {
    const items = [mkItem('2', { title: 'beta' }), mkItem('1', { title: 'alpha' })];
    expect(
      sortWorkItems(items, { columnId: 'title', dir: 'asc' }).map((i) => i.task.title),
    ).toEqual(['alpha', 'beta']);
    expect(
      sortWorkItems(items, { columnId: 'title', dir: 'desc' }).map((i) => i.task.title),
    ).toEqual(['beta', 'alpha']);
  });

  it('sorts priority by severity, not alphabetically', () => {
    const items = [
      mkItem('low', { priority: 'low' }),
      mkItem('urgent', { priority: 'urgent' }),
      mkItem('medium', { priority: 'medium' }),
    ];
    expect(
      sortWorkItems(items, { columnId: 'priority', dir: 'asc' }).map((i) => i.task.id),
    ).toEqual(['urgent', 'medium', 'low']);
  });

  it('sinks empty cells to the bottom regardless of direction', () => {
    const items = [mkItem('none'), mkItem('dated', { dueDay: '2026-03-04' })];
    expect(
      sortWorkItems(items, { columnId: 'dueDate', dir: 'asc' }).map((i) => i.task.id),
    ).toEqual(['dated', 'none']);
    expect(
      sortWorkItems(items, { columnId: 'dueDate', dir: 'desc' }).map((i) => i.task.id),
    ).toEqual(['dated', 'none']);
  });

  it('sorts numeric columns numerically', () => {
    const items = [mkItem('a', { subs: 2 }), mkItem('b', { subs: 10 })];
    expect(
      sortWorkItems(items, { columnId: 'subItems', dir: 'desc' }).map((i) => i.task.id),
    ).toEqual(['b', 'a']);
  });
});

describe('nextSort', () => {
  it('cycles asc → desc → unsorted for the same column', () => {
    const asc = nextSort(null, 'title');
    expect(asc).toEqual({ columnId: 'title', dir: 'asc' });
    const desc = nextSort(asc, 'title');
    expect(desc).toEqual({ columnId: 'title', dir: 'desc' });
    expect(nextSort(desc, 'title')).toBeNull();
  });

  it('restarts at asc when switching column', () => {
    expect(nextSort({ columnId: 'title', dir: 'desc' }, 'state')).toEqual({
      columnId: 'state',
      dir: 'asc',
    });
  });
});
