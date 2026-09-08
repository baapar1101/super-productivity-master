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
  buildWorkItemVm,
  groupWorkItems,
  resolveProjectStates,
} from './work-item-list.util';

interface LayoutOption {
  id: WorkItemLayout;
  icon: string;
  label: string;
  /** Layouts still to be built get a disabled button rather than being hidden. */
  isEnabled: boolean;
}

const LAYOUTS: readonly LayoutOption[] = [
  { id: 'list', icon: 'view_list', label: 'List', isEnabled: true },
  { id: 'kanban', icon: 'view_kanban', label: 'Board', isEnabled: false },
  { id: 'calendar', icon: 'calendar_month', label: 'Calendar', isEnabled: false },
  { id: 'spreadsheet', icon: 'table_chart', label: 'Spreadsheet', isEnabled: false },
  { id: 'gantt', icon: 'timeline', label: 'Timeline', isEnabled: false },
];

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

  readonly activeLayout = signal<WorkItemLayout>('list');
  readonly groupBy = signal<WorkItemGroupBy>('state');
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

  setLayout(layout: LayoutOption): void {
    if (layout.isEnabled) {
      this.activeLayout.set(layout.id);
    }
  }

  setGroupBy(groupBy: WorkItemGroupBy): void {
    this.groupBy.set(groupBy);
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
}
