import { TASK_FEATURE_NAME } from '../features/tasks/store/task.reducer';
import { TaskState } from '../features/tasks/task.model';
import { PROJECT_FEATURE_NAME } from '../features/project/store/project.reducer';
import { NOTE_FEATURE_NAME } from '../features/note/store/note.reducer';
import { LAYOUT_FEATURE_NAME, LayoutState } from '../core-ui/layout/store/layout.reducer';
import { CONFIG_FEATURE_NAME } from '../features/config/store/global-config.reducer';
import { GlobalConfigState } from '../features/config/global-config.model';
import { WorkContextState } from '../features/work-context/work-context.model';
import { TAG_FEATURE_NAME } from '../features/tag/store/tag.reducer';
import { TagState } from '../features/tag/tag.model';
import { WORK_CONTEXT_FEATURE_NAME } from '../features/work-context/store/work-context.selectors';
import { ProjectState } from '../features/project/project.model';
import { menuTreeFeatureKey } from '../features/menu-tree/store/menu-tree.reducer';
import { NoteState } from '../features/note/note.model';
import {
  BOARDS_FEATURE_NAME,
  BoardsState,
} from '../features/boards/store/boards.reducer';
import * as fromPlanner from '../features/planner/store/planner.reducer';
import { PlannerState } from '../features/planner/store/planner.reducer';
import { AppState, appStateFeatureKey } from './app-state/app-state.reducer';
import { MenuTreeState } from '../features/menu-tree/store/menu-tree.model';
import { TIME_TRACKING_FEATURE_KEY } from '../features/time-tracking/store/time-tracking.reducer';
import { TimeTrackingState } from '../features/time-tracking/time-tracking.model';
import { WORKFLOW_STATE_FEATURE_NAME } from '../features/workflow-state/store/workflow-state.reducer';
import { WorkflowStateState } from '../features/workflow-state/workflow-state.model';
import { ISSUE_LABEL_FEATURE_NAME } from '../features/issue-label/store/issue-label.reducer';
import { IssueLabelState } from '../features/issue-label/issue-label.model';
import { CYCLE_FEATURE_NAME } from '../features/cycle/store/cycle.reducer';
import { CycleState } from '../features/cycle/cycle.model';
import { MODULE_FEATURE_NAME } from '../features/module/store/module.reducer';
import { ModuleState } from '../features/module/module.model';
import { ESTIMATE_FEATURE_NAME } from '../features/estimate/store/estimate.reducer';
import { EstimateState } from '../features/estimate/estimate.model';

export interface RootState {
  [TASK_FEATURE_NAME]: TaskState;
  [WORK_CONTEXT_FEATURE_NAME]: WorkContextState;
  [PROJECT_FEATURE_NAME]: ProjectState;
  [menuTreeFeatureKey]: MenuTreeState;
  [TAG_FEATURE_NAME]: TagState;
  [NOTE_FEATURE_NAME]: NoteState;
  [LAYOUT_FEATURE_NAME]: LayoutState;
  [CONFIG_FEATURE_NAME]: GlobalConfigState;
  [BOARDS_FEATURE_NAME]: BoardsState;
  [fromPlanner.plannerFeatureKey]: PlannerState;
  [appStateFeatureKey]: AppState;
  [TIME_TRACKING_FEATURE_KEY]: TimeTrackingState;
  [WORKFLOW_STATE_FEATURE_NAME]: WorkflowStateState;
  [ISSUE_LABEL_FEATURE_NAME]: IssueLabelState;
  [CYCLE_FEATURE_NAME]: CycleState;
  [MODULE_FEATURE_NAME]: ModuleState;
  [ESTIMATE_FEATURE_NAME]: EstimateState;
}
