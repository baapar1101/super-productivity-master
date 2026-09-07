import { IssueIntegrationCfgs, IssueProviderKey } from '../issue/issue.model';
import {
  WorkContextAdvancedCfgKey,
  WorkContextCommon,
} from '../work-context/work-context.model';
import { EntityState } from '@ngrx/entity';
// Import the unified Project type from plugin-api
import { Project as PluginProject } from '@super-productivity/plugin-api';

export type RoundTimeOption = '5M' | 'QUARTER' | 'HALF' | 'HOUR' | null | undefined;

export interface ProjectBasicCfg {
  title: string;
  // TODO remove maybe
  isArchived?: boolean;
  // Completed projects are a celebrated finish; completing also sets isArchived
  // (so the project hides from the active menu), but isDone stays distinct so a
  // finish can be told apart from a quietly-shelved archive.
  isDone?: boolean;
  doneOn?: number | null;
  isHiddenFromMenu?: boolean;
  isEnableBacklog?: boolean;
  taskIds: string[];
  backlogTaskIds: string[];
  noteIds: string[];
}

/**
 * Which Plane-parity sub-pages this project exposes in its tab bar.
 *
 * Optional and nested so existing projects need no migration — an absent
 * block reads as "all off" (see `getPlaneFeatureFlags`), mirroring how the
 * global `appFeatures()` flags gate the top-level sidebar.
 */
export interface PlaneFeatureFlags {
  cyclesEnabled?: boolean;
  modulesEnabled?: boolean;
  viewsEnabled?: boolean;
  pagesEnabled?: boolean;
  intakeEnabled?: boolean;
}

// Omit conflicting properties from PluginProject when extending
export interface ProjectCopy
  extends
    Omit<PluginProject, 'advancedCfg' | 'theme'>,
    ProjectBasicCfg,
    WorkContextCommon {
  // Additional app-specific fields
  issueIntegrationCfgs?: IssueIntegrationCfgs;
  planeFeatureFlags?: PlaneFeatureFlags;
}

export type Project = Readonly<ProjectCopy>;

export type ProjectCfgFormKey =
  | WorkContextAdvancedCfgKey
  | IssueProviderKey
  | 'basic'
  | 'theme';

export type ProjectState = EntityState<Project>;
