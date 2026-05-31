/**
 * Unified types for Mind-Sync.
 *
 * All canonical types live in src/store/types.ts and are re-exported here
 * for convenience. Importing from "@/types" or "@/store/useStore" resolves
 * to the same definitions.
 *
 * @deprecated Import directly from "@/store/types" or "@/store/useStore"
 * instead of from "@/types". This barrel re-export exists for backward
 * compatibility and will be removed in a future milestone.
 */

export type {
  Priority,
  ViewMode,
  Density,
  TimerMode,
  Attachment,
  Task,
  CalendarEvent,
  Note,
  Notification,
  Column,
  ViewSettings,
  TimerSettings,
  HistoryEntry,
  AppState,
} from "@/store/types";

export {
  MAX_HISTORY,
  DEFAULT_TIMER_SETTINGS,
  DEFAULT_COLUMNS,
  DEFAULT_VIEW_SETTINGS,
} from "@/store/types";
