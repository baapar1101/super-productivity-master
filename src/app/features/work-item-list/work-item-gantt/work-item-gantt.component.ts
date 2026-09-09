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
import { getDbDateStr } from '../../../util/get-db-date-str';
import { DateTimeFormatService } from '../../../core/date-time-format/date-time-format.service';
import { PlaneStateDotComponent } from '../../../ui/plane-state-dot/plane-state-dot.component';
import { PlanePriorityIconComponent } from '../../../ui/plane-priority-icon/plane-priority-icon.component';
import { WorkItemVm } from '../work-item-list.model';
import {
  GANTT_DAY_WIDTH,
  GanttDragChange,
  GanttDragMode,
  GanttZoom,
} from './work-item-gantt.model';
import {
  applyGanttDrag,
  buildBars,
  buildDayColumns,
  diffDays,
  itemSpan,
  timelineRange,
} from './work-item-gantt.util';

interface ActiveDrag {
  taskId: string;
  mode: GanttDragMode;
  startClientX: number;
  span: { startDay: string; endDay: string };
  deltaDays: number;
}

@Component({
  selector: 'work-item-gantt',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    PlaneStateDotComponent,
    PlanePriorityIconComponent,
  ],
  templateUrl: './work-item-gantt.component.html',
  styleUrls: ['./work-item-gantt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkItemGanttComponent {
  private readonly _dateTimeFormatService = inject(DateTimeFormatService);

  readonly items = input.required<readonly WorkItemVm[]>();
  readonly selectedTaskId = input<string | null>(null);

  readonly itemSelected = output<string>();
  readonly datesChanged = output<GanttDragChange>();

  readonly zoom = signal<GanttZoom>('month');
  readonly zoomLevels: readonly GanttZoom[] = ['week', 'month', 'quarter'];

  private readonly _drag = signal<ActiveDrag | null>(null);

  readonly todayStr = getDbDateStr();
  readonly dayWidth = computed(() => GANTT_DAY_WIDTH[this.zoom()]);

  /** Only dated items get a row; undated ones are reported in the header. */
  readonly datedItems = computed(() => this.items().filter((i) => !!itemSpan(i)));
  readonly undatedCount = computed(() => this.items().length - this.datedItems().length);

  private readonly _range = computed(() =>
    timelineRange(this.datedItems(), this.todayStr),
  );

  readonly days = computed(() => {
    const { startDay, endDay } = this._range();
    return buildDayColumns(
      startDay,
      endDay,
      this.todayStr,
      this._dateTimeFormatService.textLocale(),
    );
  });

  readonly bars = computed(() => buildBars(this.datedItems(), this._range().startDay));

  readonly timelineWidth = computed(() => this.days().length * this.dayWidth());

  /** Live preview offset while dragging, so the bar tracks the pointer. */
  previewDelta(taskId: string): number {
    const d = this._drag();
    return d && d.taskId === taskId ? d.deltaDays : 0;
  }

  previewMode(taskId: string): GanttDragMode | null {
    const d = this._drag();
    return d && d.taskId === taskId ? d.mode : null;
  }

  setZoom(zoom: GanttZoom): void {
    this.zoom.set(zoom);
  }

  onSelect(taskId: string): void {
    // Suppress the click that ends a drag.
    if (this._drag()) {
      return;
    }
    this.itemSelected.emit(taskId);
  }

  onDragStart(ev: PointerEvent, item: WorkItemVm, mode: GanttDragMode): void {
    const span = itemSpan(item);
    if (!span) {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    (ev.target as HTMLElement).setPointerCapture?.(ev.pointerId);
    this._drag.set({
      taskId: item.task.id,
      mode,
      startClientX: ev.clientX,
      span,
      deltaDays: 0,
    });
  }

  onDragMove(ev: PointerEvent): void {
    const d = this._drag();
    if (!d) {
      return;
    }
    const deltaDays = Math.round((ev.clientX - d.startClientX) / this.dayWidth());
    if (deltaDays !== d.deltaDays) {
      this._drag.set({ ...d, deltaDays });
    }
  }

  onDragEnd(): void {
    const d = this._drag();
    if (!d) {
      return;
    }
    this._drag.set(null);

    if (d.deltaDays === 0) {
      return;
    }
    const next = applyGanttDrag(d.span, d.mode, d.deltaDays);
    this.datesChanged.emit({
      taskId: d.taskId,
      // A single-day item keeps its start implicit, matching how items with no
      // explicit start are stored.
      startDay: diffDays(next.startDay, next.endDay) === 0 ? null : next.startDay,
      dueDay: next.endDay,
    });
  }
}
