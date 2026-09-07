import { EntityState } from '@ngrx/entity';

/**
 * A per-project configurable estimation scale (Plane's `IEstimate`).
 *
 * `Task.estimatePointId` stores an `EstimatePoint.id`, not a raw number —
 * the displayed value comes from the point, so a project can switch between
 * story points, t-shirt categories, or time without rewriting its work items.
 */
export type EstimateType = 'categories' | 'points' | 'time';

export interface EstimatePoint {
  id: string;
  value: string;
  sortOrder: number;
}

export interface EstimateCopy {
  id: string;
  projectId: string;
  type: EstimateType;
  points: EstimatePoint[];
}

export type Estimate = Readonly<EstimateCopy>;

export type EstimateState = EntityState<Estimate>;
