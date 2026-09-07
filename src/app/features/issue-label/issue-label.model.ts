import { EntityState } from '@ngrx/entity';

/**
 * A project-scoped classification chip (Plane's `IIssueLabel`).
 *
 * Deliberately NOT reusing SP's `Tag`: a Tag is a routable WorkContext with
 * its own theme and task list, while a Label is only a colored marker that
 * can nest under another label via `parentId`.
 */
export interface IssueLabelCopy {
  id: string;
  projectId: string;
  name: string;
  /** Hex color. */
  color: string;
  /** Parent label id for nested label groups; null/undefined = top level. */
  parentId?: string | null;
  sortOrder: number;
}

export type IssueLabel = Readonly<IssueLabelCopy>;

export type IssueLabelState = EntityState<IssueLabel>;
