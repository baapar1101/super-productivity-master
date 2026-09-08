import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type WorkflowStateGroup =
  | 'backlog'
  | 'unstarted'
  | 'started'
  | 'completed'
  | 'cancelled';

const GROUP_FALLBACK_VAR: Record<WorkflowStateGroup, string> = {
  backlog: 'var(--state-group-backlog)',
  unstarted: 'var(--state-group-unstarted)',
  started: 'var(--state-group-started)',
  completed: 'var(--state-group-completed)',
  cancelled: 'var(--state-group-cancelled)',
};

@Component({
  selector: 'plane-state-dot',
  standalone: true,
  templateUrl: './plane-state-dot.component.html',
  styleUrls: ['./plane-state-dot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaneStateDotComponent {
  // Explicit hex/rgb color (e.g. a per-project WorkflowState.color) takes
  // precedence; falls back to the group's default color when absent.
  readonly color = input<string | null>(null);
  readonly group = input<WorkflowStateGroup>('backlog');

  readonly resolvedColor = computed(
    () => this.color() || GROUP_FALLBACK_VAR[this.group()],
  );
}
