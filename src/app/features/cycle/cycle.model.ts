import { EntityState } from '@ngrx/entity';

/**
 * A fixed-duration, non-overlapping time-box for a project (Plane's `ICycle`
 * — a sprint).
 *
 * Note what is deliberately absent: Plane's `status`
 * (draft/upcoming/current/completed) and its progress-snapshot counters are
 * DERIVED — from the dates and from the work items linked via
 * `Task.cycleId` — so they belong in selectors, not in stored state.
 */
export interface CycleCopy {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  /** ISO date (YYYY-MM-DD). */
  startDate: string | null;
  endDate: string | null;
  ownerId?: string | null;
  /** Opaque saved filter payload; shaped in a later phase. */
  viewProps?: Record<string, unknown>;
}

export type Cycle = Readonly<CycleCopy>;

export type CycleState = EntityState<Cycle>;
