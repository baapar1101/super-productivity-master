import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProjectPagePlaceholderComponent } from '../project-shell/project-page-placeholder.component';

@Component({
  selector: 'project-intake-page',
  standalone: true,
  imports: [ProjectPagePlaceholderComponent],
  template: `
    <project-page-placeholder
      title="Intake"
      icon="inbox"
      description="Triage queue for incoming work items before they join the project. Arrives in a later phase."
    ></project-page-placeholder>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectIntakePageComponent {}
