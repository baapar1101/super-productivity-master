import {
  initialWorkflowStateState,
  selectWorkflowStatesForProject,
  workflowStateReducer,
} from './workflow-state.reducer';
import {
  addWorkflowState,
  deleteWorkflowState,
  updateWorkflowState,
} from './workflow-state.actions';
import { loadAllData } from '../../../root-store/meta/load-all-data.action';
import { WorkflowState } from '../workflow-state.model';

const mkState = (id: string, overrides: Partial<WorkflowState> = {}): WorkflowState => ({
  id,
  projectId: 'P1',
  name: `State ${id}`,
  color: '#888888',
  group: 'unstarted',
  sortOrder: 0,
  ...overrides,
});

describe('workflowStateReducer', () => {
  it('adds, updates and removes a state', () => {
    let state = workflowStateReducer(
      initialWorkflowStateState,
      addWorkflowState({ workflowState: mkState('a') }),
    );
    expect(state.ids).toEqual(['a']);

    state = workflowStateReducer(
      state,
      updateWorkflowState({ workflowState: { id: 'a', changes: { name: 'Renamed' } } }),
    );
    expect(state.entities['a']?.name).toBe('Renamed');

    state = workflowStateReducer(state, deleteWorkflowState({ id: 'a' }));
    expect(state.ids).toEqual([]);
  });

  it('hydrates from loadAllData when the collection is present', () => {
    const loaded = workflowStateReducer(
      initialWorkflowStateState,
      addWorkflowState({ workflowState: mkState('x') }),
    );
    const state = workflowStateReducer(
      initialWorkflowStateState,
      loadAllData({ appDataComplete: { workflowState: loaded } as never }),
    );
    expect(state.ids).toEqual(['x']);
  });

  it('keeps current state when a legacy payload has no workflowState', () => {
    const current = workflowStateReducer(
      initialWorkflowStateState,
      addWorkflowState({ workflowState: mkState('keep') }),
    );
    const state = workflowStateReducer(
      current,
      loadAllData({ appDataComplete: {} as never }),
    );
    expect(state.ids).toEqual(['keep']);
  });
});

describe('selectWorkflowStatesForProject', () => {
  it('returns only the project’s states, ordered by sortOrder', () => {
    const all = [
      mkState('b', { sortOrder: 2 }),
      mkState('a', { sortOrder: 1 }),
      mkState('other', { projectId: 'P2', sortOrder: 0 }),
    ];
    const result = selectWorkflowStatesForProject('P1').projector(all);
    expect(result.map((s) => s.id)).toEqual(['a', 'b']);
  });
});
