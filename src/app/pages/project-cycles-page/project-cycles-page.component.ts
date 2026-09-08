import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProjectPagePlaceholderComponent } from '../project-shell/project-page-placeholder.component';

@Component({
  selector: 'project-cycles-page',
  standalone: true,
  imports: [ProjectPagePlaceholderComponent],
  template: `
    <project-page-placeholder
      title="Cycles"
      icon="autorenew"
      description="Time-boxed sprints for this project. The cycle list, progress stats and burndown chart arrive in a later phase."
    ></project-page-placeholder>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCyclesPageComponent {}
