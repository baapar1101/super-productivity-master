import { createAction } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Module } from '../module.model';
import { PersistentActionMeta } from '../../../op-log/core/persistent-action.interface';
import { OpType } from '../../../op-log/core/operation.types';

export const addModule = createAction('[Module] Add', (props: { module: Module }) => ({
  ...props,
  meta: {
    isPersistent: true,
    entityType: 'MODULE',
    entityId: props.module.id,
    opType: OpType.Create,
  } satisfies PersistentActionMeta,
}));

export const updateModule = createAction(
  '[Module] Update',
  (props: { module: Update<Module> }) => ({
    ...props,
    meta: {
      isPersistent: true,
      entityType: 'MODULE',
      entityId: props.module.id as string,
      opType: OpType.Update,
    } satisfies PersistentActionMeta,
  }),
);

export const deleteModule = createAction('[Module] Delete', (props: { id: string }) => ({
  ...props,
  meta: {
    isPersistent: true,
    entityType: 'MODULE',
    entityId: props.id,
    opType: OpType.Delete,
  } satisfies PersistentActionMeta,
}));
