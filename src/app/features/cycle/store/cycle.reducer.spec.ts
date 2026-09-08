import { cycleReducer, initialCycleState, selectCyclesForProject } from './cycle.reducer';
import { addCycle, deleteCycle, updateCycle } from './cycle.actions';
import { loadAllData } from '../../../root-store/meta/load-all-data.action';
import { Cycle } from '../cycle.model';

const mkCycle = (id: string, overrides: Partial<Cycle> = {}): Cycle => ({
  id,
  projectId: 'P1',
  name: `Cycle ${id}`,
  startDate: '2026-01-01',
  endDate: '2026-01-14',
  ...overrides,
});

describe('cycleReducer', () => {
  it('adds, updates and removes a cycle', () => {
    let state = cycleReducer(initialCycleState, addCycle({ cycle: mkCycle('c1') }));
    expect(state.ids).toEqual(['c1']);

    state = cycleReducer(
      state,
      updateCycle({ cycle: { id: 'c1', changes: { name: 'Sprint 1' } } }),
    );
    expect(state.entities['c1']?.name).toBe('Sprint 1');

    state = cycleReducer(state, deleteCycle({ id: 'c1' }));
    expect(state.ids).toEqual([]);
  });

  it('keeps current state when a legacy payload has no cycle collection', () => {
    const current = cycleReducer(initialCycleState, addCycle({ cycle: mkCycle('keep') }));
    const state = cycleReducer(current, loadAllData({ appDataComplete: {} as never }));
    expect(state.ids).toEqual(['keep']);
  });
});

describe('selectCyclesForProject', () => {
  it('filters by project', () => {
    const all = [mkCycle('a'), mkCycle('b', { projectId: 'P2' })];
    expect(
      selectCyclesForProject('P1')
        .projector(all)
        .map((c) => c.id),
    ).toEqual(['a']);
  });
});
