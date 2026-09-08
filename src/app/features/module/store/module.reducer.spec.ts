import {
  initialModuleState,
  moduleReducer,
  selectModulesForProject,
} from './module.reducer';
import { addModule, deleteModule, updateModule } from './module.actions';
import { loadAllData } from '../../../root-store/meta/load-all-data.action';
import { Module } from '../module.model';

const mkModule = (id: string, overrides: Partial<Module> = {}): Module => ({
  id,
  projectId: 'P1',
  name: `Module ${id}`,
  status: 'planned',
  memberIds: [],
  ...overrides,
});

describe('moduleReducer', () => {
  it('adds, updates and removes a module', () => {
    let state = moduleReducer(initialModuleState, addModule({ module: mkModule('m1') }));
    expect(state.ids).toEqual(['m1']);

    state = moduleReducer(
      state,
      updateModule({ module: { id: 'm1', changes: { status: 'completed' } } }),
    );
    expect(state.entities['m1']?.status).toBe('completed');

    state = moduleReducer(state, deleteModule({ id: 'm1' }));
    expect(state.ids).toEqual([]);
  });

  it('keeps current state when a legacy payload has no module collection', () => {
    const current = moduleReducer(
      initialModuleState,
      addModule({ module: mkModule('keep') }),
    );
    const state = moduleReducer(current, loadAllData({ appDataComplete: {} as never }));
    expect(state.ids).toEqual(['keep']);
  });
});

describe('selectModulesForProject', () => {
  it('filters by project', () => {
    const all = [mkModule('a'), mkModule('b', { projectId: 'P2' })];
    expect(selectModulesForProject('P1').projector(all).map((m) => m.id)).toEqual(['a']);
  });
});
