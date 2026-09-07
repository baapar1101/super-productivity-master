import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Cycle, CycleState } from '../cycle.model';
import { loadAllData } from '../../../root-store/meta/load-all-data.action';
import { AppDataComplete } from '../../../op-log/model/model-config';
import { addCycle, deleteCycle, updateCycle } from './cycle.actions';

export const CYCLE_FEATURE_NAME = 'cycle';

export const cycleAdapter: EntityAdapter<Cycle> = createEntityAdapter<Cycle>();

export const initialCycleState: CycleState = cycleAdapter.getInitialState();

export const selectCycleFeatureState =
  createFeatureSelector<CycleState>(CYCLE_FEATURE_NAME);

const { selectAll, selectEntities, selectIds } = cycleAdapter.getSelectors();

export const selectAllCycles = createSelector(selectCycleFeatureState, selectAll);
export const selectCycleEntities = createSelector(
  selectCycleFeatureState,
  selectEntities,
);
export const selectAllCycleIds = createSelector(selectCycleFeatureState, selectIds);

export const selectCyclesForProject = (projectId: string) =>
  createSelector(selectAllCycles, (cycles) =>
    cycles.filter((cycle) => cycle.projectId === projectId),
  );

export const cycleReducer = createReducer<CycleState>(
  initialCycleState,

  on(loadAllData, (state, { appDataComplete }) => {
    const loaded = (appDataComplete as Partial<AppDataComplete>).cycle;
    return loaded ?? state;
  }),

  on(addCycle, (state, { cycle }) => cycleAdapter.addOne(cycle, state)),
  on(updateCycle, (state, { cycle }) => cycleAdapter.updateOne(cycle, state)),
  on(deleteCycle, (state, { id }) => cycleAdapter.removeOne(id, state)),
);
