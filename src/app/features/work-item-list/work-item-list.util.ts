import { Task } from '../tasks/task.model';
import { WorkflowState } from '../workflow-state/workflow-state.model';
import { IssueLabel } from '../issue-label/issue-label.model';
import {
  DEFAULT_STATE_FOR_GROUP,
  DEFAULT_WORKFLOW_STATES,
} from '../workflow-state/workflow-state.const';
import { IssuePriority } from '../../ui/plane-priority-icon/plane-priority-icon.component';
import {
  PRIORITY_LABEL,
  PRIORITY_ORDER,
  WorkItemGroupBy,
  WorkItemGroupVm,
  WorkItemVm,
} from './work-item-list.model';

/**
 * The states a project renders with: its own if it has configured any,
 * otherwise the shared virtual defaults so grouping works before a project
 * ever opens the (future) state-management UI.
 */
export const resolveProjectStates = (
  projectStates: readonly WorkflowState[],
): readonly WorkflowState[] =>
  projectStates.length
    ? [...projectStates].sort((a, b) => a.sortOrder - b.sortOrder)
    : DEFAULT_WORKFLOW_STATES;

/**
 * Which state a task belongs to.
 *
 * Tasks created before the Plane fields existed have no `workflowStateId`, so
 * fall back to SP's own notion of doneness — that keeps every existing task
 * meaningfully grouped instead of dumping them all in a "no state" bucket.
 */
export const resolveTaskState = (
  task: Task,
  states: readonly WorkflowState[],
): WorkflowState => {
  if (task.workflowStateId) {
    const found = states.find((s) => s.id === task.workflowStateId);
    if (found) {
      return found;
    }
  }
  const group = task.isDone ? 'completed' : 'unstarted';
  return states.find((s) => s.group === group) ?? DEFAULT_STATE_FOR_GROUP(group);
};

export const resolveTaskPriority = (task: Task): IssuePriority => task.priority ?? 'none';

/**
 * The task changes a board drop implies.
 *
 * Moving between state columns writes `workflowStateId`, and additionally
 * syncs SP's own `isDone` whenever the move crosses the completed boundary —
 * otherwise a card parked in "Done" would still count as open everywhere else
 * in the app (today list, classic view, time tracking).
 *
 * Returns `null` when the drop is a no-op.
 */
export const buildStateDropChanges = (
  task: Task,
  targetState: WorkflowState,
  states: readonly WorkflowState[],
): { changes: Partial<Task>; isDoneChange: boolean | null } | null => {
  const current = resolveTaskState(task, states);
  if (current.id === targetState.id) {
    return null;
  }

  const shouldBeDone = targetState.group === 'completed';
  return {
    changes: { workflowStateId: targetState.id },
    isDoneChange: shouldBeDone === !!task.isDone ? null : shouldBeDone,
  };
};

/** Priority-column drop: only writes `priority`, nothing else. */
export const buildPriorityDropChanges = (
  task: Task,
  targetPriority: IssuePriority,
): Partial<Task> | null =>
  resolveTaskPriority(task) === targetPriority ? null : { priority: targetPriority };

export const buildWorkItemVm = (
  task: Task,
  states: readonly WorkflowState[],
  labelsById: Record<string, IssueLabel>,
): WorkItemVm => ({
  task,
  state: resolveTaskState(task, states),
  priority: resolveTaskPriority(task),
  labels: (task.labelIds ?? [])
    .map((id) => labelsById[id])
    .filter((l): l is IssueLabel => !!l),
  subTaskCount: task.subTaskIds?.length ?? 0,
});

/**
 * Groups work items for the list layout. Empty groups are kept for `state` and
 * `priority` (Plane shows every column/section even when empty, so the set of
 * groups is stable while dragging/filtering); `label` only renders labels that
 * are actually used, plus a "No label" bucket when needed.
 */
export const groupWorkItems = (
  items: readonly WorkItemVm[],
  groupBy: WorkItemGroupBy,
  states: readonly WorkflowState[],
  labels: readonly IssueLabel[],
): WorkItemGroupVm[] => {
  if (groupBy === 'none') {
    return [{ key: 'all', title: 'All work items', items: [...items] }];
  }

  if (groupBy === 'state') {
    return states.map((state) => ({
      key: state.id,
      title: state.name,
      color: state.color,
      items: items.filter((i) => i.state.id === state.id),
    }));
  }

  if (groupBy === 'priority') {
    return PRIORITY_ORDER.map((priority) => ({
      key: priority,
      title: PRIORITY_LABEL[priority],
      priority,
      items: items.filter((i) => i.priority === priority),
    }));
  }

  // groupBy === 'label'
  const used = labels.filter((label) =>
    items.some((i) => i.labels.some((l) => l.id === label.id)),
  );
  const groups: WorkItemGroupVm[] = used.map((label) => ({
    key: label.id,
    title: label.name,
    color: label.color,
    items: items.filter((i) => i.labels.some((l) => l.id === label.id)),
  }));

  const unlabeled = items.filter((i) => i.labels.length === 0);
  if (unlabeled.length) {
    groups.push({ key: '__none', title: 'No label', items: unlabeled });
  }
  return groups;
};
