import {
  initialIssueLabelState,
  issueLabelReducer,
  selectIssueLabelsForProject,
} from './issue-label.reducer';
import { addIssueLabel, deleteIssueLabel, updateIssueLabel } from './issue-label.actions';
import { loadAllData } from '../../../root-store/meta/load-all-data.action';
import { IssueLabel } from '../issue-label.model';

const mkLabel = (id: string, overrides: Partial<IssueLabel> = {}): IssueLabel => ({
  id,
  projectId: 'P1',
  name: `Label ${id}`,
  color: '#3b82f6',
  sortOrder: 0,
  ...overrides,
});

describe('issueLabelReducer', () => {
  it('adds, updates and removes a label', () => {
    let state = issueLabelReducer(
      initialIssueLabelState,
      addIssueLabel({ issueLabel: mkLabel('l1') }),
    );
    expect(state.ids).toEqual(['l1']);

    state = issueLabelReducer(
      state,
      updateIssueLabel({ issueLabel: { id: 'l1', changes: { color: '#ff0000' } } }),
    );
    expect(state.entities['l1']?.color).toBe('#ff0000');

    state = issueLabelReducer(state, deleteIssueLabel({ id: 'l1' }));
    expect(state.ids).toEqual([]);
  });

  it('keeps current state when a legacy payload has no issueLabel collection', () => {
    const current = issueLabelReducer(
      initialIssueLabelState,
      addIssueLabel({ issueLabel: mkLabel('keep') }),
    );
    const state = issueLabelReducer(
      current,
      loadAllData({ appDataComplete: {} as never }),
    );
    expect(state.ids).toEqual(['keep']);
  });
});

describe('selectIssueLabelsForProject', () => {
  it('returns only the project’s labels, ordered by sortOrder', () => {
    const all = [
      mkLabel('b', { sortOrder: 2 }),
      mkLabel('a', { sortOrder: 1 }),
      mkLabel('other', { projectId: 'P2' }),
    ];
    expect(selectIssueLabelsForProject('P1').projector(all).map((l) => l.id)).toEqual([
      'a',
      'b',
    ]);
  });
});
