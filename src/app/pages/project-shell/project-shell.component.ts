import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectService } from '../../features/project/project.service';
import { PlaneFeatureFlags } from '../../features/project/project.model';

interface ProjectTab {
  key: string;
  label: string;
  icon: string;
  /** Route segment relative to `project/:id`. */
  route: string;
}

@Component({
  selector: 'project-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './project-shell.component.html',
  styleUrls: ['./project-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectShellComponent {
  private readonly _projectService = inject(ProjectService);

  private readonly _project = toSignal(this._projectService.currentProject$, {
    initialValue: null,
  });

  // Links are absolute: the shell sits on a pathless (`path: ''`) route, so a
  // relative `['../', …]` climbs past the `:id` segment and drops it.
  readonly projectId = computed(() => this._project()?.id ?? null);

  readonly tabs = computed<ProjectTab[]>(() => {
    const flags: PlaneFeatureFlags = this._project()?.planeFeatureFlags ?? {};

    // Work items is always present; the rest mirror Plane's per-project
    // `*_view` gating.
    return [
      { key: 'work-items', label: 'Work Items', icon: 'checklist', route: 'tasks' },
      ...(flags.cyclesEnabled
        ? [{ key: 'cycles', label: 'Cycles', icon: 'autorenew', route: 'cycles' }]
        : []),
      ...(flags.modulesEnabled
        ? [{ key: 'modules', label: 'Modules', icon: 'widgets', route: 'modules' }]
        : []),
      ...(flags.viewsEnabled
        ? [{ key: 'views', label: 'Views', icon: 'visibility', route: 'views' }]
        : []),
      ...(flags.pagesEnabled
        ? [{ key: 'pages', label: 'Pages', icon: 'description', route: 'pages' }]
        : []),
      ...(flags.intakeEnabled
        ? [{ key: 'intake', label: 'Intake', icon: 'inbox', route: 'intake' }]
        : []),
    ];
  });

  // A lone "Work Items" tab carries no information — hide the bar entirely
  // until the project opts into at least one Plane sub-page.
  readonly isShowTabs = computed(() => this.tabs().length > 1);
}
