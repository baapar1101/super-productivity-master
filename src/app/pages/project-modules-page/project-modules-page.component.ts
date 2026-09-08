import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProjectPagePlaceholderComponent } from '../project-shell/project-page-placeholder.component';

@Component({
  selector: 'project-modules-page',
  standalone: true,
  imports: [ProjectPagePlaceholderComponent],
  template: `
    <project-page-placeholder
      title="Modules"
      icon="widgets"
      description="Freeform groupings of work items — epics and initiatives. The module list and its progress view arrive in a later phase."
    ></project-page-placeholder>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectModulesPageComponent {}
