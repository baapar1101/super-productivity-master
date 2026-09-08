import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProjectPagePlaceholderComponent } from '../project-shell/project-page-placeholder.component';

@Component({
  selector: 'project-views-page',
  standalone: true,
  imports: [ProjectPagePlaceholderComponent],
  template: `
    <project-page-placeholder
      title="Views"
      icon="visibility"
      description="Saved filter/group/sort combinations for this project's work items. Needs the filter system, so it arrives after the list layouts."
    ></project-page-placeholder>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectViewsPageComponent {}
