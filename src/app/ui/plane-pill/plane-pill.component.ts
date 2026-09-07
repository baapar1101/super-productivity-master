import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type PlanePillVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type PlanePillSize = 'xs' | 'sm' | 'md' | 'lg';
export type PlanePillRadius = 'square' | 'circle';

@Component({
  selector: 'plane-pill',
  standalone: true,
  templateUrl: './plane-pill.component.html',
  styleUrls: ['./plane-pill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanePillComponent {
  readonly variant = input<PlanePillVariant>('default');
  readonly size = input<PlanePillSize>('sm');
  readonly radius = input<PlanePillRadius>('square');
}
