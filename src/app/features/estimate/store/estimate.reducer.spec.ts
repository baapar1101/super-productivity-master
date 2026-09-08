import {
  estimateReducer,
  initialEstimateState,
  selectEstimateForProject,
} from './estimate.reducer';
import { addEstimate, deleteEstimate, updateEstimate } from './estimate.actions';
import { loadAllData } from '../../../root-store/meta/load-all-data.action';
import { Estimate } from '../estimate.model';

const mkEstimate = (id: string, overrides: Partial<Estimate> = {}): Estimate => ({
  id,
  projectId: 'P1',
  type: 'points',
  points: [{ id: 'p1', value: '1', sortOrder: 0 }],
  ...overrides,
});

describe('estimateReducer', () => {
  it('adds, updates and removes an estimate scale', () => {
    let state = estimateReducer(
      initialEstimateState,
      addEstimate({ estimate: mkEstimate('e1') }),
    );
    expect(state.ids).toEqual(['e1']);

    state = estimateReducer(
      state,
      updateEstimate({ estimate: { id: 'e1', changes: { type: 'categories' } } }),
    );
    expect(state.entities['e1']?.type).toBe('categories');

    state = estimateReducer(state, deleteEstimate({ id: 'e1' }));
    expect(state.ids).toEqual([]);
  });

  it('keeps current state when a legacy payload has no estimate collection', () => {
    const current = estimateReducer(
      initialEstimateState,
      addEstimate({ estimate: mkEstimate('keep') }),
    );
    const state = estimateReducer(current, loadAllData({ appDataComplete: {} as never }));
    expect(state.ids).toEqual(['keep']);
  });
});

describe('selectEstimateForProject', () => {
  it('returns the scale belonging to the project', () => {
    const all = [mkEstimate('a'), mkEstimate('b', { projectId: 'P2' })];
    expect(selectEstimateForProject('P1').projector(all)?.id).toBe('a');
  });
});
