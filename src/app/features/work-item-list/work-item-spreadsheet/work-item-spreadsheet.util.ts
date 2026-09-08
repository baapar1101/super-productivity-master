import { PRIORITY_ORDER, WorkItemVm } from '../work-item-list.model';
import { SpreadsheetSort } from './work-item-spreadsheet.model';
import { workItemDayStr } from '../work-item-calendar/work-item-calendar.util';

/** Sort key per column. `null` sorts last regardless of direction. */
const sortValue = (
  item: WorkItemVm,
  columnId: SpreadsheetSort['columnId'],
): string | number | null => {
  switch (columnId) {
    case 'title':
      return item.task.title.toLocaleLowerCase();
    case 'state':
      return item.state.sortOrder;
    case 'priority':
      // Fixed severity order, not alphabetical: urgent first.
      return PRIORITY_ORDER.indexOf(item.priority);
    case 'labels':
      return item.labels.length ? item.labels[0].name.toLocaleLowerCase() : null;
    case 'dueDate':
      return workItemDayStr(item);
    case 'estimate':
      return item.task.timeEstimate || null;
    case 'subItems':
      return item.subTaskCount;
    case 'created':
      return item.task.created ?? null;
    default:
      return null;
  }
};

export const sortWorkItems = (
  items: readonly WorkItemVm[],
  sort: SpreadsheetSort | null,
): WorkItemVm[] => {
  if (!sort) {
    return [...items];
  }

  const factor = sort.dir === 'asc' ? 1 : -1;
  return [...items].sort((a, b) => {
    const av = sortValue(a, sort.columnId);
    const bv = sortValue(b, sort.columnId);

    // Empty cells always sink to the bottom so a sort never hides real values.
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;

    if (typeof av === 'number' && typeof bv === 'number') {
      return (av - bv) * factor;
    }
    return String(av).localeCompare(String(bv)) * factor;
  });
};

/** Click cycles asc → desc → unsorted, like Plane's spreadsheet headers. */
export const nextSort = (
  current: SpreadsheetSort | null,
  columnId: SpreadsheetSort['columnId'],
): SpreadsheetSort | null => {
  if (!current || current.columnId !== columnId) {
    return { columnId, dir: 'asc' };
  }
  return current.dir === 'asc' ? { columnId, dir: 'desc' } : null;
};
