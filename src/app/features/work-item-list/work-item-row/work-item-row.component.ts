import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlaneStateDotComponent } from '../../../ui/plane-state-dot/plane-state-dot.component';
import { PlanePriorityIconComponent } from '../../../ui/plane-priority-icon/plane-priority-icon.component';
import { PlanePillComponent } from '../../../ui/plane-pill/plane-pill.component';
import { WorkItemVm } from '../work-item-list.model';

@Component({
  selector: 'work-item-row',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    PlaneStateDotComponent,
    PlanePriorityIconComponent,
    PlanePillComponent,
  ],
  templateUrl: './work-item-row.component.html',
  styleUrls: ['./work-item-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkItemRowComponent {
  readonly item = input.required<WorkItemVm>();
  readonly isSelected = input<boolean>(false);

  readonly selected = output<string>();
  readonly doneToggled = output<string>();

  onSelect(): void {
    this.selected.emit(this.item().task.id);
  }

  onToggleDone(ev: Event): void {
    ev.stopPropagation();
    this.doneToggled.emit(this.item().task.id);
  }

  /** Plane shows a short due-date chip; keep it terse (e.g. "Mar 4"). */
  formatDue(dueDay?: string | null, dueWithTime?: number | null): string | null {
    const d = dueWithTime ? new Date(dueWithTime) : dueDay ? new Date(dueDay) : null;
    if (!d || isNaN(d.getTime())) {
      return null;
    }
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
}
