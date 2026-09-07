import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Estimate, EstimateState } from '../estimate.model';
import { loadAllData } from '../../../root-store/meta/load-all-data.action';
import { AppDataComplete } from '../../../op-log/model/model-config';
import { addEstimate, deleteEstimate, updateEstimate } from './estimate.actions';

export const ESTIMATE_FEATURE_NAME = 'estimate';

export const estimateAdapter: EntityAdapter<Estimate> = createEntityAdapter<Estimate>();

export const initialEstimateState: EstimateState = estimateAdapter.getInitialState();

export const selectEstimateFeatureState =
  createFeatureSelector<EstimateState>(ESTIMATE_FEATURE_NAME);

const { selectAll, selectEntities, selectIds } = estimateAdapter.getSelectors();

export const selectAllEstimates = createSelector(selectEstimateFeatureState, selectAll);
export const selectEstimateEntities = createSelector(
  selectEstimateFeatureState,
  selectEntities,
);
export const selectAllEstimateIds = createSelector(selectEstimateFeatureState, selectIds);

export const selectEstimateForProject = (projectId: string) =>
  createSelector(selectAllEstimates, (estimates) =>
    estimates.find((estimate) => estimate.projectId === projectId),
  );

export const estimateReducer = createReducer<EstimateState>(
  initialEstimateState,

  on(loadAllData, (state, { appDataComplete }) => {
    const loaded = (appDataComplete as Partial<AppDataComplete>).estimate;
    return loaded ?? state;
  }),

  on(addEstimate, (state, { estimate }) => estimateAdapter.addOne(estimate, state)),
  on(updateEstimate, (state, { estimate }) => estimateAdapter.updateOne(estimate, state)),
  on(deleteEstimate, (state, { id }) => estimateAdapter.removeOne(id, state)),
);
