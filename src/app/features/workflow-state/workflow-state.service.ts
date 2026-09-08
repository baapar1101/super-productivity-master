import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { WorkflowState } from './workflow-state.model';
import {
  selectAllWorkflowStates,
  selectWorkflowStatesForProject,
} from './store/workflow-state.reducer';
import {
  addWorkflowState,
  deleteWorkflowState,
  updateWorkflowState,
} from './store/workflow-state.actions';

@Injectable({ providedIn: 'root' })
export class WorkflowStateService {
  private _store = inject(Store);

  readonly workflowStates$: Observable<WorkflowState[]> = this._store.select(
    selectAllWorkflowStates,
  );

  getForProject$(projectId: string): Observable<WorkflowState[]> {
    return this._store.select(selectWorkflowStatesForProject(projectId));
  }

  add(workflowState: WorkflowState): void {
    this._store.dispatch(addWorkflowState({ workflowState }));
  }

  update(workflowState: Update<WorkflowState>): void {
    this._store.dispatch(updateWorkflowState({ workflowState }));
  }

  remove(id: string): void {
    this._store.dispatch(deleteWorkflowState({ id }));
  }
}
