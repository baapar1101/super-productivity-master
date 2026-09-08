import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Shared "not built yet" body for the Plane sub-pages that are routable but
 * still awaiting their real implementation in a later phase.
 */
@Component({
  selector: 'project-page-placeholder',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="placeholder">
      <mat-icon class="placeholder-icon">{{ icon() }}</mat-icon>
      <h2 class="placeholder-title">{{ title() }}</h2>
      <p class="placeholder-text">{{ description() }}</p>
    </div>
  `,
  styleUrls: ['./project-page-placeholder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectPagePlaceholderComponent {
  readonly title = input.required<string>();
  readonly icon = input<string>('construction');
  readonly description = input<string>('Coming soon.');
}
