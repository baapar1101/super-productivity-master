import { EntityState } from '@ngrx/entity';

/**
 * The five fixed groups every workflow state belongs to. Mirrors Plane's
 * `TStateGroups` — groups are fixed, but the states within them are a
 * per-project configurable, ordered list.
 */
export type WorkflowStateGroup =
  | 'backlog'
  | 'unstarted'
  | 'started'
  | 'completed'
  | 'cancelled';

export interface WorkflowStateCopy {
  id: string;
  projectId: string;
  name: string;
  /** Hex color; falls back to the group's default when absent. */
  color: string;
  group: WorkflowStateGroup;
  /** The state new work items land in for this project. */
  isDefault?: boolean;
  sortOrder: number;
}

export type WorkflowState = Readonly<WorkflowStateCopy>;

export type WorkflowStateState = EntityState<WorkflowState>;
