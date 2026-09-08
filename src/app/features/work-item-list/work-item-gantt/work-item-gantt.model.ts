import { WorkItemVm } from '../work-item-list.model';

/** Column width per zoom level, in px per day. */
export type GanttZoom = 'week' | 'month' | 'quarter';

export const GANTT_DAY_WIDTH: Record<GanttZoom, number> = {
  week: 40,
  month: 20,
  quarter: 8,
};

export interface GanttDayVm {
  dayStr: string;
  dayOfMonth: number;
  isToday: boolean;
  isWeekend: boolean;
  /** Set on the first day of each month so the header can label it. */
  monthLabel?: string;
}

export interface GanttBarVm {
  item: WorkItemVm;
  /** Offset from the timeline start, in days. */
  startOffset: number;
  /** Inclusive span, in days (always >= 1). */
  lengthDays: number;
}

/** A bar edit in progress: which item, which handle, and the day delta so far. */
export type GanttDragMode = 'move' | 'resize-start' | 'resize-end';

export interface GanttDragChange {
  taskId: string;
  startDay: string | null;
  dueDay: string;
}
