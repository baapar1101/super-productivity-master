import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateTimeFormatService } from '../../../core/date-time-format/date-time-format.service';
import { PlaneStateDotComponent } from '../../../ui/plane-state-dot/plane-state-dot.component';
import { PlanePriorityIconComponent } from '../../../ui/plane-priority-icon/plane-priority-icon.component';
import { PlanePillComponent } from '../../../ui/plane-pill/plane-pill.component';
import { WorkItemVm } from '../work-item-list.model';
import { SPREADSHEET_COLUMNS, SpreadsheetSort } from './work-item-spreadsheet.model';
import { nextSort, sortWorkItems } from './work-item-spreadsheet.util';
import { workItemDayStr } from '../work-item-calendar/work-item-calendar.util';

@Component({
  selector: 'work-item-spreadsheet',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    PlaneStateDotComponent,
    PlanePriorityIconComponent,
    PlanePillComponent,
  ],
  templateUrl: './work-item-spreadsheet.component.html',
  styleUrls: ['./work-item-spreadsheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkItemSpreadsheetComponent {
  private readonly _dateTimeFormatService = inject(DateTimeFormatService);

  readonly items = input.required<readonly WorkItemVm[]>();
  readonly selectedTaskId = input<string | null>(null);

  readonly itemSelected = output<string>();

  readonly columns = SPREADSHEET_COLUMNS;
  readonly sort = signal<SpreadsheetSort | null>(null);

  readonly rows = computed(() => sortWorkItems(this.items(), this.sort()));

  toggleSort(columnId: SpreadsheetSort['columnId']): void {
    this.sort.set(nextSort(this.sort(), columnId));
  }

  sortIcon(columnId: SpreadsheetSort['columnId']): string | null {
    const s = this.sort();
    if (!s || s.columnId !== columnId) {
      return null;
    }
    return s.dir === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  onSelect(taskId: string): void {
    this.itemSelected.emit(taskId);
  }

  dueDate(item: WorkItemVm): string | null {
    const day = workItemDayStr(item);
    if (!day) {
      return null;
    }
    return new Date(day).toLocaleDateString(this._dateTimeFormatService.textLocale(), {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  createdDate(item: WorkItemVm): string | null {
    const created = item.task.created;
    if (!created) {
      return null;
    }
    return new Date(created).toLocaleDateString(
      this._dateTimeFormatService.textLocale(),
      { month: 'short', day: 'numeric', year: 'numeric' },
    );
  }

  /** Estimates are stored as ms; the grid shows whole hours like the rest of SP. */
  estimateHours(item: WorkItemVm): string | null {
    const ms = item.task.timeEstimate;
    if (!ms) {
      return null;
    }
    return `${Math.round((ms / 1000 / 60 / 60) * 10) / 10}h`;
  }
}
