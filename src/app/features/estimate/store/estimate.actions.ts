import { createAction } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Estimate } from '../estimate.model';
import { PersistentActionMeta } from '../../../op-log/core/persistent-action.interface';
import { OpType } from '../../../op-log/core/operation.types';

export const addEstimate = createAction(
  '[Estimate] Add',
  (props: { estimate: Estimate }) => ({
    ...props,
    meta: {
      isPersistent: true,
      entityType: 'ESTIMATE',
      entityId: props.estimate.id,
      opType: OpType.Create,
    } satisfies PersistentActionMeta,
  }),
);

export const updateEstimate = createAction(
  '[Estimate] Update',
  (props: { estimate: Update<Estimate> }) => ({
    ...props,
    meta: {
      isPersistent: true,
      entityType: 'ESTIMATE',
      entityId: props.estimate.id as string,
      opType: OpType.Update,
    } satisfies PersistentActionMeta,
  }),
);

export const deleteEstimate = createAction(
  '[Estimate] Delete',
  (props: { id: string }) => ({
    ...props,
    meta: {
      isPersistent: true,
      entityType: 'ESTIMATE',
      entityId: props.id,
      opType: OpType.Delete,
    } satisfies PersistentActionMeta,
  }),
);
