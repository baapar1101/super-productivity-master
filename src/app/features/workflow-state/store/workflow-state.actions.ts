import { createAction } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { WorkflowState } from '../workflow-state.model';
import { PersistentActionMeta } from '../../../op-log/core/persistent-action.interface';
import { OpType } from '../../../op-log/core/operation.types';

export const addWorkflowState = createAction(
  '[WorkflowState] Add',
  (props: { workflowState: WorkflowState }) => ({
    ...props,
    meta: {
      isPersistent: true,
      entityType: 'WORKFLOW_STATE',
      entityId: props.workflowState.id,
      opType: OpType.Create,
    } satisfies PersistentActionMeta,
  }),
);

export const updateWorkflowState = createAction(
  '[WorkflowState] Update',
  (props: { workflowState: Update<WorkflowState> }) => ({
    ...props,
    meta: {
      isPersistent: true,
      entityType: 'WORKFLOW_STATE',
      entityId: props.workflowState.id as string,
      opType: OpType.Update,
    } satisfies PersistentActionMeta,
  }),
);

export const deleteWorkflowState = createAction(
  '[WorkflowState] Delete',
  (props: { id: string }) => ({
    ...props,
    meta: {
      isPersistent: true,
      entityType: 'WORKFLOW_STATE',
      entityId: props.id,
      opType: OpType.Delete,
    } satisfies PersistentActionMeta,
  }),
);
