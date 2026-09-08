import { Routes } from '@angular/router';
import { HistoryComponent } from '../features/history/history.component';
import { DailySummaryComponent } from '../pages/daily-summary/daily-summary.component';
import { MetricPageComponent } from '../pages/metric-page/metric-page.component';
import { ProjectTaskPageComponent } from '../pages/project-task-page/project-task-page.component';
import { ProjectShellComponent } from '../pages/project-shell/project-shell.component';
import { ProjectCyclesPageComponent } from '../pages/project-cycles-page/project-cycles-page.component';
import { ProjectModulesPageComponent } from '../pages/project-modules-page/project-modules-page.component';
import { ProjectViewsPageComponent } from '../pages/project-views-page/project-views-page.component';
import { ProjectPagesPageComponent } from '../pages/project-pages-page/project-pages-page.component';
import { ProjectIntakePageComponent } from '../pages/project-intake-page/project-intake-page.component';

const SHARED_CONTEXT_ROUTES: Routes = [
  {
    path: 'history',
    component: HistoryComponent,
    data: { page: 'history' },
  },
  // legacy routes: both old pages now redirect to the unified History view
  {
    path: 'worklog',
    component: HistoryComponent,
    data: { page: 'history' },
  },
  {
    path: 'quick-history',
    component: HistoryComponent,
    data: { page: 'history' },
  },
  {
    path: 'daily-summary',
    component: DailySummaryComponent,
    data: { page: 'daily-summary' },
  },
  {
    path: 'daily-summary/:dayStr',
    component: DailySummaryComponent,
    data: { page: 'daily-summary' },
  },
  {
    path: 'metrics',
    component: MetricPageComponent,
    data: { page: 'metrics' },
  },
];

export const TAG_CHILD_ROUTES: Routes = [...SHARED_CONTEXT_ROUTES];

// Project children render inside ProjectShellComponent, which owns the
// Plane-style tab row (Work Items / Cycles / Modules / …) and its own outlet.
// Path strings are unchanged, so every existing `/project/:id/...` URL and
// bookmark still resolves exactly as before.
export const PROJECT_CHILD_ROUTES: Routes = [
  {
    path: '',
    component: ProjectShellComponent,
    children: [
      {
        path: 'tasks',
        component: ProjectTaskPageComponent,
        data: { page: 'project-tasks' },
      },
      {
        path: 'cycles',
        component: ProjectCyclesPageComponent,
        data: { page: 'project-cycles' },
      },
      {
        path: 'cycles/:cycleId',
        component: ProjectCyclesPageComponent,
        data: { page: 'project-cycles' },
      },
      {
        path: 'modules',
        component: ProjectModulesPageComponent,
        data: { page: 'project-modules' },
      },
      {
        path: 'modules/:moduleId',
        component: ProjectModulesPageComponent,
        data: { page: 'project-modules' },
      },
      {
        path: 'views',
        component: ProjectViewsPageComponent,
        data: { page: 'project-views' },
      },
      {
        path: 'pages',
        component: ProjectPagesPageComponent,
        data: { page: 'project-pages' },
      },
      {
        path: 'intake',
        component: ProjectIntakePageComponent,
        data: { page: 'project-intake' },
      },
      ...SHARED_CONTEXT_ROUTES,
    ],
  },
];
