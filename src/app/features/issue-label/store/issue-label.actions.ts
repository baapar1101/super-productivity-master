import { createAction } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { IssueLabel } from '../issue-label.model';
import { PersistentActionMeta } from '../../../op-log/core/persistent-action.interface';
import { OpType } from '../../../op-log/core/operation.types';

export const addIssueLabel = createAction(
  '[IssueLabel] Add',
  (props: { issueLabel: IssueLabel }) => ({
    ...props,
    meta: {
      isPersistent: true,
      entityType: 'ISSUE_LABEL',
      entityId: props.issueLabel.id,
      opType: OpType.Create,
    } satisfies PersistentActionMeta,
  }),
);

export const updateIssueLabel = createAction(
  '[IssueLabel] Update',
  (props: { issueLabel: Update<IssueLabel> }) => ({
    ...props,
    meta: {
      isPersistent: true,
      entityType: 'ISSUE_LABEL',
      entityId: props.issueLabel.id as string,
      opType: OpType.Update,
    } satisfies PersistentActionMeta,
  }),
);

export const deleteIssueLabel = createAction(
  '[IssueLabel] Delete',
  (props: { id: string }) => ({
    ...props,
    meta: {
      isPersistent: true,
      entityType: 'ISSUE_LABEL',
      entityId: props.id,
      opType: OpType.Delete,
    } satisfies PersistentActionMeta,
  }),
);
