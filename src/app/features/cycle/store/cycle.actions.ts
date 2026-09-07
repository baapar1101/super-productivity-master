import { createAction } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Cycle } from '../cycle.model';
import { PersistentActionMeta } from '../../../op-log/core/persistent-action.interface';
import { OpType } from '../../../op-log/core/operation.types';

export const addCycle = createAction('[Cycle] Add', (props: { cycle: Cycle }) => ({
  ...props,
  meta: {
    isPersistent: true,
    entityType: 'CYCLE',
    entityId: props.cycle.id,
    opType: OpType.Create,
  } satisfies PersistentActionMeta,
}));

export const updateCycle = createAction(
  '[Cycle] Update',
  (props: { cycle: Update<Cycle> }) => ({
    ...props,
    meta: {
      isPersistent: true,
      entityType: 'CYCLE',
      entityId: props.cycle.id as string,
      opType: OpType.Update,
    } satisfies PersistentActionMeta,
  }),
);

export const deleteCycle = createAction('[Cycle] Delete', (props: { id: string }) => ({
  ...props,
  meta: {
    isPersistent: true,
    entityType: 'CYCLE',
    entityId: props.id,
    opType: OpType.Delete,
  } satisfies PersistentActionMeta,
}));
