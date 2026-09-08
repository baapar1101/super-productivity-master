import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import {
  createFeatureSelector,
  createReducer,
  createSelector,
  MemoizedSelector,
  on,
} from '@ngrx/store';
import { WorkflowState, WorkflowStateState } from '../workflow-state.model';
import { loadAllData } from '../../../root-store/meta/load-all-data.action';
import { AppDataComplete } from '../../../op-log/model/model-config';
import {
  addWorkflowState,
  deleteWorkflowState,
  updateWorkflowState,
} from './workflow-state.actions';

export const WORKFLOW_STATE_FEATURE_NAME = 'workflowState';

export const workflowStateAdapter: EntityAdapter<WorkflowState> =
  createEntityAdapter<WorkflowState>();

export const initialWorkflowStateState: WorkflowStateState =
  workflowStateAdapter.getInitialState();

export const selectWorkflowStateFeatureState = createFeatureSelector<WorkflowStateState>(
  WORKFLOW_STATE_FEATURE_NAME,
);

const { selectAll, selectEntities, selectIds } = workflowStateAdapter.getSelectors();

export const selectAllWorkflowStates = createSelector(
  selectWorkflowStateFeatureState,
  selectAll,
);
export const selectWorkflowStateEntities = createSelector(
  selectWorkflowStateFeatureState,
  selectEntities,
);
export const selectAllWorkflowStateIds = createSelector(
  selectWorkflowStateFeatureState,
  selectIds,
);

/** States for one project, in their configured order. */
export const selectWorkflowStatesForProject = (
  projectId: string,
): MemoizedSelector<object, WorkflowState[]> =>
  createSelector(selectAllWorkflowStates, (states) =>
    states
      .filter((state) => state.projectId === projectId)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  );

export const workflowStateReducer = createReducer<WorkflowStateState>(
  initialWorkflowStateState,

  // Legacy import payloads predate this collection, so read it defensively
  // rather than widening AppDataCompleteLegacy with a field old files never had.
  on(loadAllData, (state, { appDataComplete }) => {
    const loaded = (appDataComplete as Partial<AppDataComplete>).workflowState;
    return loaded ?? state;
  }),

  on(addWorkflowState, (state, { workflowState }) =>
    workflowStateAdapter.addOne(workflowState, state),
  ),
  on(updateWorkflowState, (state, { workflowState }) =>
    workflowStateAdapter.updateOne(workflowState, state),
  ),
  on(deleteWorkflowState, (state, { id }) => workflowStateAdapter.removeOne(id, state)),
);
