import { WorkflowState, WorkflowStateGroup } from './workflow-state.model';

/**
 * Virtual fallback states used when a project has not configured its own.
 *
 * They are NOT written to the store — `resolveWorkflowStatesForProject` returns
 * them so grouping works out of the box, and a project that later defines real
 * states simply overrides them. The ids are prefixed so they can never collide
 * with a user-created state id (nanoid).
 */
export const DEFAULT_WORKFLOW_STATE_ID_PREFIX = '__wfs_default_';

const mk = (
  group: WorkflowStateGroup,
  name: string,
  color: string,
  sortOrder: number,
): WorkflowState => ({
  id: `${DEFAULT_WORKFLOW_STATE_ID_PREFIX}${group}`,
  projectId: '',
  name,
  color,
  group,
  sortOrder,
  isDefault: group === 'unstarted',
});

export const DEFAULT_WORKFLOW_STATES: readonly WorkflowState[] = [
  mk('backlog', 'Backlog', 'var(--state-group-backlog)', 0),
  mk('unstarted', 'Todo', 'var(--state-group-unstarted)', 1),
  mk('started', 'In Progress', 'var(--state-group-started)', 2),
  mk('completed', 'Done', 'var(--state-group-completed)', 3),
  mk('cancelled', 'Cancelled', 'var(--state-group-cancelled)', 4),
];

export const DEFAULT_STATE_FOR_GROUP = (group: WorkflowStateGroup): WorkflowState =>
  DEFAULT_WORKFLOW_STATES.find((s) => s.group === group) as WorkflowState;
