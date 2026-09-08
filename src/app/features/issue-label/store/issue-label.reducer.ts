import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import {
  createFeatureSelector,
  createReducer,
  createSelector,
  MemoizedSelector,
  on,
} from '@ngrx/store';
import { IssueLabel, IssueLabelState } from '../issue-label.model';
import { loadAllData } from '../../../root-store/meta/load-all-data.action';
import { AppDataComplete } from '../../../op-log/model/model-config';
import { addIssueLabel, deleteIssueLabel, updateIssueLabel } from './issue-label.actions';

export const ISSUE_LABEL_FEATURE_NAME = 'issueLabel';

export const issueLabelAdapter: EntityAdapter<IssueLabel> =
  createEntityAdapter<IssueLabel>();

export const initialIssueLabelState: IssueLabelState =
  issueLabelAdapter.getInitialState();

export const selectIssueLabelFeatureState = createFeatureSelector<IssueLabelState>(
  ISSUE_LABEL_FEATURE_NAME,
);

const { selectAll, selectEntities, selectIds } = issueLabelAdapter.getSelectors();

export const selectAllIssueLabels = createSelector(
  selectIssueLabelFeatureState,
  selectAll,
);
export const selectIssueLabelEntities = createSelector(
  selectIssueLabelFeatureState,
  selectEntities,
);
export const selectAllIssueLabelIds = createSelector(
  selectIssueLabelFeatureState,
  selectIds,
);

export const selectIssueLabelsForProject = (
  projectId: string,
): MemoizedSelector<object, IssueLabel[]> =>
  createSelector(selectAllIssueLabels, (labels) =>
    labels
      .filter((label) => label.projectId === projectId)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  );

export const issueLabelReducer = createReducer<IssueLabelState>(
  initialIssueLabelState,

  on(loadAllData, (state, { appDataComplete }) => {
    const loaded = (appDataComplete as Partial<AppDataComplete>).issueLabel;
    return loaded ?? state;
  }),

  on(addIssueLabel, (state, { issueLabel }) =>
    issueLabelAdapter.addOne(issueLabel, state),
  ),
  on(updateIssueLabel, (state, { issueLabel }) =>
    issueLabelAdapter.updateOne(issueLabel, state),
  ),
  on(deleteIssueLabel, (state, { id }) => issueLabelAdapter.removeOne(id, state)),
);
