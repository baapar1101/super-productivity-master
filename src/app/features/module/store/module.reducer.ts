import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import {
  createFeatureSelector,
  createReducer,
  createSelector,
  MemoizedSelector,
  on,
} from '@ngrx/store';
import { Module, ModuleState } from '../module.model';
import { loadAllData } from '../../../root-store/meta/load-all-data.action';
import { AppDataComplete } from '../../../op-log/model/model-config';
import { addModule, deleteModule, updateModule } from './module.actions';

export const MODULE_FEATURE_NAME = 'module';

export const moduleAdapter: EntityAdapter<Module> = createEntityAdapter<Module>();

export const initialModuleState: ModuleState = moduleAdapter.getInitialState();

export const selectModuleFeatureState =
  createFeatureSelector<ModuleState>(MODULE_FEATURE_NAME);

const { selectAll, selectEntities, selectIds } = moduleAdapter.getSelectors();

export const selectAllModules = createSelector(selectModuleFeatureState, selectAll);
export const selectModuleEntities = createSelector(
  selectModuleFeatureState,
  selectEntities,
);
export const selectAllModuleIds = createSelector(selectModuleFeatureState, selectIds);

export const selectModulesForProject = (
  projectId: string,
): MemoizedSelector<object, Module[]> =>
  createSelector(selectAllModules, (modules) =>
    modules.filter((module) => module.projectId === projectId),
  );

export const moduleReducer = createReducer<ModuleState>(
  initialModuleState,

  on(loadAllData, (state, { appDataComplete }) => {
    const loaded = (appDataComplete as Partial<AppDataComplete>).module;
    return loaded ?? state;
  }),

  on(addModule, (state, { module }) => moduleAdapter.addOne(module, state)),
  on(updateModule, (state, { module }) => moduleAdapter.updateOne(module, state)),
  on(deleteModule, (state, { id }) => moduleAdapter.removeOne(id, state)),
);
