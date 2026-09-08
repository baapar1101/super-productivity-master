import {
  buildWorkItemVm,
  groupWorkItems,
  resolveProjectStates,
  resolveTaskPriority,
  resolveTaskState,
} from './work-item-list.util';
import { DEFAULT_WORKFLOW_STATES } from '../workflow-state/workflow-state.const';
import { Task } from '../tasks/task.model';
import { WorkflowState } from '../workflow-state/workflow-state.model';
import { IssueLabel } from '../issue-label/issue-label.model';

const mkTask = (id: string, overrides: Partial<Task> = {}): Task =>
  ({ id, title: `Task ${id}`, isDone: false, subTaskIds: [], ...overrides }) as Task;

const mkState = (
  id: string,
  group: WorkflowState['group'],
  sortOrder: number,
): WorkflowState => ({
  id,
  projectId: 'P1',
  name: id,
  color: '#fff',
  group,
  sortOrder,
});

const mkLabel = (id: string): IssueLabel => ({
  id,
  projectId: 'P1',
  name: `Label ${id}`,
  color: '#f00',
  sortOrder: 0,
});

describe('resolveProjectStates', () => {
  it('falls back to the shared defaults when a project has none', () => {
    expect(resolveProjectStates([])).toBe(DEFAULT_WORKFLOW_STATES);
  });

  it('sorts a project’s own states by sortOrder', () => {
    const states = [mkState('b', 'started', 2), mkState('a', 'backlog', 1)];
    expect(resolveProjectStates(states).map((s) => s.id)).toEqual(['a', 'b']);
  });
});

describe('resolveTaskState', () => {
  const states = DEFAULT_WORKFLOW_STATES;

  it('uses the explicit workflowStateId when it resolves', () => {
    const task = mkTask('t1', { workflowStateId: states[2].id });
    expect(resolveTaskState(task, states).id).toBe(states[2].id);
  });

  it('falls back to isDone for tasks predating the Plane fields', () => {
    expect(resolveTaskState(mkTask('t2'), states).group).toBe('unstarted');
    expect(resolveTaskState(mkTask('t3', { isDone: true }), states).group).toBe(
      'completed',
    );
  });

  it('falls back when the referenced state no longer exists', () => {
    const task = mkTask('t4', { workflowStateId: 'deleted-state', isDone: true });
    expect(resolveTaskState(task, states).group).toBe('completed');
  });
});

describe('resolveTaskPriority', () => {
  it('treats an absent priority as none', () => {
    expect(resolveTaskPriority(mkTask('t'))).toBe('none');
    expect(resolveTaskPriority(mkTask('t', { priority: 'high' }))).toBe('high');
  });
});

describe('groupWorkItems', () => {
  const states = DEFAULT_WORKFLOW_STATES;
  const labels = [mkLabel('l1'), mkLabel('l2')];
  const labelsById = Object.fromEntries(labels.map((l) => [l.id, l]));
  const items = [
    buildWorkItemVm(mkTask('a', { labelIds: ['l1'] }), states, labelsById),
    buildWorkItemVm(
      mkTask('b', { isDone: true, priority: 'urgent' }),
      states,
      labelsById,
    ),
    buildWorkItemVm(mkTask('c'), states, labelsById),
  ];

  it('keeps every state group, including empty ones', () => {
    const groups = groupWorkItems(items, 'state', states, labels);
    expect(groups.length).toBe(states.length);
    expect(groups.find((g) => g.title === 'Todo')?.items.length).toBe(2);
    expect(groups.find((g) => g.title === 'Done')?.items.length).toBe(1);
  });

  it('keeps every priority bucket in fixed order', () => {
    const groups = groupWorkItems(items, 'priority', states, labels);
    expect(groups.map((g) => g.key)).toEqual(['urgent', 'high', 'medium', 'low', 'none']);
    expect(groups[0].items.length).toBe(1);
    expect(groups[4].items.length).toBe(2);
  });

  it('only renders labels actually in use, plus a No label bucket', () => {
    const groups = groupWorkItems(items, 'label', states, labels);
    expect(groups.map((g) => g.key)).toEqual(['l1', '__none']);
    expect(groups[1].items.length).toBe(2);
  });

  it('returns a single group when grouping is off', () => {
    const groups = groupWorkItems(items, 'none', states, labels);
    expect(groups.length).toBe(1);
    expect(groups[0].items.length).toBe(3);
  });
});
