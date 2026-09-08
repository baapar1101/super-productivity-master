import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateTimeFormatService } from '../../../core/date-time-format/date-time-format.service';
import { PlaneStateDotComponent } from '../../../ui/plane-state-dot/plane-state-dot.component';
import { PlanePriorityIconComponent } from '../../../ui/plane-priority-icon/plane-priority-icon.component';
import { PlanePillComponent } from '../../../ui/plane-pill/plane-pill.component';
import { WorkItemVm } from '../work-item-list.model';

@Component({
  selector: 'work-item-card',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    PlaneStateDotComponent,
    PlanePriorityIconComponent,
    PlanePillComponent,
  ],
  templateUrl: './work-item-card.component.html',
  styleUrls: ['./work-item-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkItemCardComponent {
  private readonly _dateTimeFormatService = inject(DateTimeFormatService);

  readonly item = input.required<WorkItemVm>();
  readonly isSelected = input<boolean>(false);
  /** Hidden inside a state column, where every card shares the same state. */
  readonly isShowStateDot = input<boolean>(true);

  readonly selected = output<string>();

  onSelect(): void {
    this.selected.emit(this.item().task.id);
  }

  formatDue(dueDay?: string | null, dueWithTime?: number | null): string | null {
    const d = dueWithTime ? new Date(dueWithTime) : dueDay ? new Date(dueDay) : null;
    if (!d || isNaN(d.getTime())) {
      return null;
    }
    return d.toLocaleDateString(this._dateTimeFormatService.textLocale(), {
      month: 'short',
      day: 'numeric',
    });
  }
}
