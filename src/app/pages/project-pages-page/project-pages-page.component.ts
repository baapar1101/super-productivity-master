import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProjectPagePlaceholderComponent } from '../project-shell/project-page-placeholder.component';

@Component({
  selector: 'project-pages-page',
  standalone: true,
  imports: [ProjectPagePlaceholderComponent],
  template: `
    <project-page-placeholder
      title="Pages"
      icon="description"
      description="Rich-text documents living alongside this project's work items. Its data model is not designed yet."
    ></project-page-placeholder>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectPagesPageComponent {}
