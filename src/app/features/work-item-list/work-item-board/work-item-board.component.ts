import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { PlaneStateDotComponent } from '../../../ui/plane-state-dot/plane-state-dot.component';
import { PlanePriorityIconComponent } from '../../../ui/plane-priority-icon/plane-priority-icon.component';
import { WorkItemCardComponent } from '../work-item-card/work-item-card.component';
import { WorkItemGroupVm, WorkItemVm } from '../work-item-list.model';

/** Emitted when a card is dropped into a different column. */
export interface WorkItemBoardDrop {
  taskId: string;
  /** The destination group's key — a workflow-state id or a priority. */
  toGroupKey: string;
}

@Component({
  selector: 'work-item-board',
  standalone: true,
  imports: [
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    MatIconModule,
    PlaneStateDotComponent,
    PlanePriorityIconComponent,
    WorkItemCardComponent,
  ],
  templateUrl: './work-item-board.component.html',
  styleUrls: ['./work-item-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkItemBoardComponent {
  readonly groups = input.required<WorkItemGroupVm[]>();
  readonly selectedTaskId = input<string | null>(null);
  /** Columns only carry a state when grouping by state — hide the per-card dot then. */
  readonly isGroupedByState = input<boolean>(true);
  /** Dragging is meaningless when everything sits in one ungrouped column. */
  readonly isDragEnabled = input<boolean>(true);

  readonly itemSelected = output<string>();
  readonly itemDropped = output<WorkItemBoardDrop>();

  onDrop(event: CdkDragDrop<WorkItemGroupVm>, toGroup: WorkItemGroupVm): void {
    const item = event.item.data as WorkItemVm;
    // Reordering inside the same column has no persisted meaning yet (there is
    // no per-state manual order), so only cross-column moves are emitted.
    if (event.previousContainer === event.container) {
      return;
    }
    this.itemDropped.emit({ taskId: item.task.id, toGroupKey: toGroup.key });
  }

  onSelect(taskId: string): void {
    this.itemSelected.emit(taskId);
  }
}
