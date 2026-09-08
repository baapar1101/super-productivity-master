import { WorkItemVm } from '../work-item-list.model';

export interface CalendarDayVm {
  /** YYYY-MM-DD — also the cdkDropList id for this cell. */
  dayStr: string;
  dayOfMonth: number;
  isToday: boolean;
  /** Days spilling in from the neighbouring months are dimmed. */
  isOtherMonth: boolean;
  items: WorkItemVm[];
}

export interface CalendarWeekVm {
  key: string;
  days: CalendarDayVm[];
}
