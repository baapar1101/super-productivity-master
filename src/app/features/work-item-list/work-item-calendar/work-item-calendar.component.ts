import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateTimeFormatService } from '../../../core/date-time-format/date-time-format.service';
import { getDbDateStr } from '../../../util/get-db-date-str';
import { PlaneStateDotComponent } from '../../../ui/plane-state-dot/plane-state-dot.component';
import { PlanePriorityIconComponent } from '../../../ui/plane-priority-icon/plane-priority-icon.component';
import { WorkItemVm } from '../work-item-list.model';
import { CalendarDayVm } from './work-item-calendar.model';
import {
  buildMonthGrid,
  buildWeekdayLabels,
  groupItemsByDay,
} from './work-item-calendar.util';

export interface WorkItemCalendarDrop {
  taskId: string;
  /** Destination day as YYYY-MM-DD. */
  toDayStr: string;
}

/** Chips beyond this per cell collapse into a "+N more" affordance. */
const MAX_CHIPS_PER_DAY = 3;

@Component({
  selector: 'work-item-calendar',
  standalone: true,
  imports: [
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    MatIconModule,
    MatTooltipModule,
    PlaneStateDotComponent,
    PlanePriorityIconComponent,
  ],
  templateUrl: './work-item-calendar.component.html',
  styleUrls: ['./work-item-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkItemCalendarComponent {
  private readonly _dateTimeFormatService = inject(DateTimeFormatService);

  readonly items = input.required<readonly WorkItemVm[]>();
  readonly selectedTaskId = input<string | null>(null);

  readonly itemSelected = output<string>();
  readonly itemDropped = output<WorkItemCalendarDrop>();

  readonly maxChips = MAX_CHIPS_PER_DAY;

  /** First day of the displayed month. */
  private readonly _anchor = signal<Date>(new Date());
  private readonly _expandedDays = signal<ReadonlySet<string>>(new Set());

  readonly todayStr = getDbDateStr();

  readonly weekdayLabels = computed(() =>
    buildWeekdayLabels(this._dateTimeFormatService.textLocale()),
  );

  readonly monthLabel = computed(() =>
    this._anchor().toLocaleDateString(this._dateTimeFormatService.textLocale(), {
      month: 'long',
      year: 'numeric',
    }),
  );

  readonly weeks = computed(() =>
    buildMonthGrid(this._anchor(), groupItemsByDay(this.items()), this.todayStr),
  );

  /** Items with no due date at all — invisible on a calendar, so surfaced separately. */
  readonly unscheduledCount = computed(
    () => this.items().filter((i) => !i.task.dueDay && !i.task.dueWithTime).length,
  );

  goToPrevMonth(): void {
    const a = this._anchor();
    this._anchor.set(new Date(a.getFullYear(), a.getMonth() - 1, 1));
  }

  goToNextMonth(): void {
    const a = this._anchor();
    this._anchor.set(new Date(a.getFullYear(), a.getMonth() + 1, 1));
  }

  goToToday(): void {
    this._anchor.set(new Date());
  }

  isExpanded(dayStr: string): boolean {
    return this._expandedDays().has(dayStr);
  }

  toggleExpanded(dayStr: string, ev: Event): void {
    ev.stopPropagation();
    const next = new Set(this._expandedDays());
    if (next.has(dayStr)) {
      next.delete(dayStr);
    } else {
      next.add(dayStr);
    }
    this._expandedDays.set(next);
  }

  visibleItems(day: CalendarDayVm): WorkItemVm[] {
    return this.isExpanded(day.dayStr)
      ? day.items
      : day.items.slice(0, MAX_CHIPS_PER_DAY);
  }

  hiddenCount(day: CalendarDayVm): number {
    return this.isExpanded(day.dayStr)
      ? 0
      : Math.max(0, day.items.length - MAX_CHIPS_PER_DAY);
  }

  onSelect(taskId: string): void {
    this.itemSelected.emit(taskId);
  }

  onDrop(event: CdkDragDrop<CalendarDayVm>, toDay: CalendarDayVm): void {
    if (event.previousContainer === event.container) {
      return;
    }
    const item = event.item.data as WorkItemVm;
    this.itemDropped.emit({ taskId: item.task.id, toDayStr: toDay.dayStr });
  }
}
