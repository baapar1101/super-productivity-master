/**
 * The spreadsheet's per-field columns, mirroring Plane's
 * `issue-layouts/spreadsheet/columns/*` (one component per field there, one
 * entry here — the cell rendering lives in the template's `@switch`).
 */
export type SpreadsheetColumnId =
  | 'state'
  | 'priority'
  | 'labels'
  | 'dueDate'
  | 'estimate'
  | 'subItems'
  | 'created';

export interface SpreadsheetColumn {
  id: SpreadsheetColumnId;
  label: string;
  /** Right-aligned numeric columns get tabular figures. */
  isNumeric?: boolean;
}

export const SPREADSHEET_COLUMNS: readonly SpreadsheetColumn[] = [
  { id: 'state', label: 'State' },
  { id: 'priority', label: 'Priority' },
  { id: 'labels', label: 'Labels' },
  { id: 'dueDate', label: 'Due date' },
  { id: 'estimate', label: 'Estimate', isNumeric: true },
  { id: 'subItems', label: 'Sub-items', isNumeric: true },
  { id: 'created', label: 'Created' },
];

export type SpreadsheetSortDir = 'asc' | 'desc';

export interface SpreadsheetSort {
  columnId: SpreadsheetColumnId | 'title';
  dir: SpreadsheetSortDir;
}
