import { Task } from '../tasks/task.model';
import { WorkflowState } from '../workflow-state/workflow-state.model';
import { IssueLabel } from '../issue-label/issue-label.model';
import { IssuePriority } from '../../ui/plane-priority-icon/plane-priority-icon.component';

/** Which property the list is grouped by (Plane's `group_by` display filter). */
export type WorkItemGroupBy = 'state' | 'priority' | 'label' | 'none';

export type WorkItemLayout = 'list' | 'kanban' | 'calendar' | 'spreadsheet' | 'gantt';

/** A task joined with the entities its id fields point at, ready to render. */
export interface WorkItemVm {
  task: Task;
  state: WorkflowState;
  priority: IssuePriority;
  labels: IssueLabel[];
  subTaskCount: number;
}

export interface WorkItemGroupVm {
  /** Stable key for tracking / the group's identity (state id, priority, label id…). */
  key: string;
  title: string;
  /** Rendered as the group header's leading dot; absent for non-state groups. */
  color?: string;
  /** Priority shown as an icon instead of a dot, for priority grouping. */
  priority?: IssuePriority;
  items: WorkItemVm[];
}

export const PRIORITY_ORDER: readonly IssuePriority[] = [
  'urgent',
  'high',
  'medium',
  'low',
  'none',
];

export const PRIORITY_LABEL: Record<IssuePriority, string> = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'None',
};
