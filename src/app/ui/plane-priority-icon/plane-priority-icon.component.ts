import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type IssuePriority = 'urgent' | 'high' | 'medium' | 'low' | 'none';

const PRIORITY_ICON: Record<IssuePriority, string> = {
  urgent: 'priority_high',
  high: 'signal_cellular_alt',
  medium: 'signal_cellular_alt_2_bar',
  low: 'signal_cellular_alt_1_bar',
  none: 'remove',
};

const PRIORITY_COLOR_VAR: Record<IssuePriority, string> = {
  urgent: 'var(--priority-urgent)',
  high: 'var(--priority-high)',
  medium: 'var(--priority-medium)',
  low: 'var(--priority-low)',
  none: 'var(--priority-none)',
};

@Component({
  selector: 'plane-priority-icon',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './plane-priority-icon.component.html',
  styleUrls: ['./plane-priority-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanePriorityIconComponent {
  readonly priority = input<IssuePriority | null>('none');

  readonly resolvedPriority = computed<IssuePriority>(() => this.priority() ?? 'none');
  readonly icon = computed(() => PRIORITY_ICON[this.resolvedPriority()]);
  readonly colorVar = computed(() => PRIORITY_COLOR_VAR[this.resolvedPriority()]);
}
