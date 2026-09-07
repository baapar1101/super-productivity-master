import { EntityState } from '@ngrx/entity';

/**
 * A freeform, possibly-overlapping work grouping (Plane's `IModule` — an
 * epic/initiative).
 *
 * Unlike a Cycle it is not time-boxed, and its `status` is set manually by
 * the user rather than derived from dates.
 */
export type ModuleStatus =
  | 'backlog'
  | 'planned'
  | 'in-progress'
  | 'paused'
  | 'completed'
  | 'cancelled';

export interface ModuleCopy {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  status: ModuleStatus;
  leadId?: string | null;
  memberIds: string[];
}

export type Module = Readonly<ModuleCopy>;

export type ModuleState = EntityState<Module>;
