import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map } from 'rxjs/operators';
import { WorkContextService } from '../work-context/work-context.service';
import { TaskService } from '../tasks/task.service';
import { selectAllWorkflowStates } from '../workflow-state/store/workflow-state.reducer';
import { selectAllIssueLabels } from '../issue-label/store/issue-label.reducer';
import { PlaneStateDotComponent } from '../../ui/plane-state-dot/plane-state-dot.component';
import { PlanePriorityIconComponent } from '../../ui/plane-priority-icon/plane-priority-icon.component';
import { WorkItemRowComponent } from './work-item-row/work-item-row.component';
import { WorkItemGroupBy, WorkItemGroupVm, WorkItemLayout } from './work-item-list.model';
import {
  buildPriorityDropChanges,
  buildStateDropChanges,
  buildWorkItemVm,
  groupWorkItems,
  resolveProjectStates,
} from './work-item-list.util';
import {
  WorkItemBoardComponent,
  WorkItemBoardDrop,
} from './work-item-board/work-item-board.component';
import {
  WorkItemCalendarComponent,
  WorkItemCalendarDrop,
} from './work-item-calendar/work-item-calendar.component';
import { WorkItemSpreadsheetComponent } from './work-item-spreadsheet/work-item-spreadsheet.component';
import { WorkItemGanttComponent } from './work-item-gantt/work-item-gantt.component';
import { GanttDragChange } from './work-item-gantt/work-item-gantt.model';
import { PlannerActions } from '../planner/store/planner.actions';
import { IssuePriority } from '../../ui/plane-priority-icon/plane-priority-icon.component';

interface LayoutOption {
  id: WorkItemLayout;
  icon: string;
  label: string;
  /** Layouts still to be built get a disabled button rather than being hidden. */
  isEnabled: boolean;
}

const LAYOUTS: readonly LayoutOption[] = [
  { id: 'list', icon: 'view_list', label: 'List', isEnabled: true },
  { id: 'kanban', icon: 'view_kanban', label: 'Board', isEnabled: true },
  { id: 'calendar', icon: 'calendar_month', label: 'Calendar', isEnabled: true },
  { id: 'spreadsheet', icon: 'table_chart', label: 'Spreadsheet', isEnabled: true },
  { id: 'gantt', icon: 'timeline', label: 'Timeline', isEnabled: true },
];

const LS_LAYOUT = 'SP_WORK_ITEM_LAYOUT';
const LS_GROUP_BY = 'SP_WORK_ITEM_GROUP_BY';

const GROUP_BY_OPTIONS: readonly { id: WorkItemGroupBy; label: string }[] = [
  { id: 'state', label: 'State' },
  { id: 'priority', label: 'Priority' },
  { id: 'label', label: 'Label' },
  { id: 'none', label: 'None' },
];

@Component({
  selector: 'work-item-list',
  standalone: true,
  imports: [
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    PlaneStateDotComponent,
    PlanePriorityIconComponent,
    WorkItemRowComponent,
    WorkItemBoardComponent,
    WorkItemCalendarComponent,
    WorkItemSpreadsheetComponent,
    WorkItemGanttComponent,
  ],
  templateUrl: './work-item-list.component.html',
  styleUrls: ['./work-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkItemListComponent {
  private readonly _store = inject(Store);
  private readonly _workContextService = inject(WorkContextService);
  private readonly _taskService = inject(TaskService);

  readonly layouts = LAYOUTS;
  readonly groupByOptions = GROUP_BY_OPTIONS;

  // Layout + grouping are view preferences, not synced data — Plane persists
  // them per view; per device is close enough until saved Views exist.
  readonly activeLayout = signal<WorkItemLayout>(
    (localStorage.getItem(LS_LAYOUT) as WorkItemLayout | null) ?? 'list',
  );
  readonly groupBy = signal<WorkItemGroupBy>(
    (localStorage.getItem(LS_GROUP_BY) as WorkItemGroupBy | null) ?? 'state',
  );
  readonly collapsedGroups = signal<ReadonlySet<string>>(new Set());

  private readonly _tasks = toSignal(
    this._workContextService.allTasksForCurrentContext$,
    { initialValue: [] },
  );
  private readonly _projectId = toSignal(
    this._workContextService.activeWorkContext$.pipe(map((ctx) => ctx?.id ?? null)),
    { initialValue: null },
  );
  private readonly _allStates = toSignal(this._store.select(selectAllWorkflowStates), {
    initialValue: [],
  });
  private readonly _allLabels = toSignal(this._store.select(selectAllIssueLabels), {
    initialValue: [],
  });
  readonly selectedTaskId = this._taskService.selectedTaskId;

  private readonly _projectStates = computed(() => {
    const projectId = this._projectId();
    return resolveProjectStates(
      this._allStates().filter((s) => s.projectId === projectId),
    );
  });

  private readonly _projectLabels = computed(() => {
    const projectId = this._projectId();
    return this._allLabels().filter((l) => l.projectId === projectId);
  });

  readonly groups = computed<WorkItemGroupVm[]>(() => {
    const states = this._projectStates();
    const labels = this._projectLabels();
    const labelsById = Object.fromEntries(labels.map((l) => [l.id, l]));
    const items = this._tasks().map((task) => buildWorkItemVm(task, states, labelsById));
    return groupWorkItems(items, this.groupBy(), states, labels);
  });

  readonly totalCount = computed(() => this._tasks().length);

  /** The calendar buckets by date itself, so it takes a flat, ungrouped list. */
  readonly flatItems = computed(() => {
    const states = this._projectStates();
    const labels = this._projectLabels();
    const labelsById = Object.fromEntries(labels.map((l) => [l.id, l]));
    return this._tasks().map((task) => buildWorkItemVm(task, states, labelsById));
  });

  setLayout(layout: LayoutOption): void {
    if (layout.isEnabled) {
      this.activeLayout.set(layout.id);
      localStorage.setItem(LS_LAYOUT, layout.id);
    }
  }

  setGroupBy(groupBy: WorkItemGroupBy): void {
    this.groupBy.set(groupBy);
    localStorage.setItem(LS_GROUP_BY, groupBy);
  }

  isCollapsed(key: string): boolean {
    return this.collapsedGroups().has(key);
  }

  toggleGroup(key: string): void {
    const next = new Set(this.collapsedGroups());
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    this.collapsedGroups.set(next);
  }

  onSelectTask(taskId: string): void {
    this._taskService.setSelectedId(taskId);
  }

  onToggleDone(taskId: string): void {
    const task = this._tasks().find((t) => t.id === taskId);
    if (!task) {
      return;
    }
    if (task.isDone) {
      this._taskService.setUnDone(taskId);
    } else {
      this._taskService.setDone(taskId);
    }
  }

  /**
   * A timeline drag/resize sets the item's span. The end date goes through the
   * planner action (same as the calendar), while `startDay` is a Plane-only
   * field the planner knows nothing about, so it is patched separately.
   */
  onGanttDatesChanged({ taskId, startDay, dueDay }: GanttDragChange): void {
    const task = this._tasks().find((t) => t.id === taskId);
    if (!task) {
      return;
    }
    this._taskService.update(taskId, { startDay });
    this._store.dispatch(
      PlannerActions.planTaskForDay({ task, day: dueDay, isShowSnack: false }),
    );
  }

  /** Dropping onto a calendar day reschedules the work item to that day. */
  onCalendarDropped({ taskId, toDayStr }: WorkItemCalendarDrop): void {
    const task = this._tasks().find((t) => t.id === taskId);
    if (!task) {
      return;
    }
    // Go through the planner action rather than writing `dueDay` directly: it
    // owns today-tag membership, ordering and the confirmation snack.
    this._store.dispatch(
      PlannerActions.planTaskForDay({ task, day: toDayStr, isShowSnack: true }),
    );
  }

  /**
   * A board drop is the first place `workflowStateId` / `priority` are actually
   * written — every other view only reads them.
   */
  onItemDropped({ taskId, toGroupKey }: WorkItemBoardDrop): void {
    const task = this._tasks().find((t) => t.id === taskId);
    if (!task) {
      return;
    }

    if (this.groupBy() === 'priority') {
      const changes = buildPriorityDropChanges(task, toGroupKey as IssuePriority);
      if (changes) {
        this._taskService.update(taskId, changes);
      }
      return;
    }

    const states = this._projectStates();
    const targetState = states.find((s) => s.id === toGroupKey);
    if (!targetState) {
      return;
    }

    const result = buildStateDropChanges(task, targetState, states);
    if (!result) {
      return;
    }

    this._taskService.update(taskId, result.changes);
    // setDone/setUnDone carry SP's own side effects (time tracking, today list),
    // so go through them rather than patching isDone directly.
    if (result.isDoneChange === true) {
      this._taskService.setDone(taskId);
    } else if (result.isDoneChange === false) {
      this._taskService.setUnDone(taskId);
    }
  }
}
