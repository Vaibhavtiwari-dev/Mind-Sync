import { GridEvent } from "./TimeGrid";

// Activity type colors - high-fidelity glass style with border accents
export const EVENT_STYLES = {
  work: {
    bg: "bg-blue-500/10 dark:bg-blue-400/12 backdrop-blur-[6px] hover:bg-blue-500/18 dark:hover:bg-blue-400/20 shadow-[0_2px_8px_rgba(59,130,246,0.08)] hover:shadow-[0_4px_16px_rgba(59,130,246,0.16)] transition-all duration-300",
    border: "border border-blue-500/20 border-l-[3.5px] border-l-blue-500 dark:border-blue-400/15 dark:border-l-blue-400",
    text: "text-blue-700 dark:text-blue-300 font-semibold tracking-wide text-[10.5px] antialiased",
    label: "Deep Work",
  },
  meeting: {
    bg: "bg-purple-500/10 dark:bg-purple-400/12 backdrop-blur-[6px] hover:bg-purple-500/18 dark:hover:bg-purple-400/20 shadow-[0_2px_8px_rgba(168,85,247,0.08)] hover:shadow-[0_4px_16px_rgba(168,85,247,0.16)] transition-all duration-300",
    border: "border border-purple-500/20 border-l-[3.5px] border-l-purple-500 dark:border-purple-400/15 dark:border-l-purple-400",
    text: "text-purple-700 dark:text-purple-300 font-semibold tracking-wide text-[10.5px] antialiased",
    label: "Meeting",
  },
  personal: {
    bg: "bg-emerald-500/10 dark:bg-emerald-400/12 backdrop-blur-[6px] hover:bg-emerald-500/18 dark:hover:bg-emerald-400/20 shadow-[0_2px_8px_rgba(16,185,129,0.08)] hover:shadow-[0_4px_16px_rgba(16,185,129,0.16)] transition-all duration-300",
    border: "border border-emerald-500/20 border-l-[3.5px] border-l-emerald-500 dark:border-emerald-400/15 dark:border-l-emerald-400",
    text: "text-emerald-700 dark:text-emerald-300 font-semibold tracking-wide text-[10.5px] antialiased",
    label: "Personal",
  },
  break: {
    bg: "bg-amber-500/10 dark:bg-amber-400/12 backdrop-blur-[6px] hover:bg-amber-500/18 dark:hover:bg-amber-400/20 shadow-[0_2px_8px_rgba(245,158,11,0.08)] hover:shadow-[0_4px_16px_rgba(245,158,11,0.16)] transition-all duration-300",
    border: "border border-amber-500/20 border-l-[3.5px] border-l-amber-500 dark:border-amber-400/15 dark:border-l-amber-400",
    text: "text-amber-700 dark:text-amber-300 font-semibold tracking-wide text-[10.5px] antialiased",
    label: "Break",
  },
  shallow: {
    bg: "bg-slate-500/10 dark:bg-slate-400/12 backdrop-blur-[6px] hover:bg-slate-500/18 dark:hover:bg-slate-400/20 shadow-[0_2px_8px_rgba(100,116,139,0.08)] hover:shadow-[0_4px_16px_rgba(100,116,139,0.16)] transition-all duration-300",
    border: "border border-slate-500/20 border-l-[3.5px] border-l-slate-500 dark:border-slate-400/15 dark:border-l-slate-400",
    text: "text-slate-700 dark:text-slate-300 font-semibold tracking-wide text-[10.5px] antialiased",
    label: "Shallow Work",
  },
};

// Calculate overlapping groups for side-by-side rendering
export function calculateEventLayout(
  events: GridEvent[]
): Map<string, { column: number; totalColumns: number }> {
  const layout = new Map<string, { column: number; totalColumns: number }>();

  if (events.length === 0) return layout;

  // Sort by start time
  const sorted = [...events].sort((a, b) => a.start - b.start);

  // Group overlapping events
  const groups: GridEvent[][] = [];
  let currentGroup: GridEvent[] = [];

  for (const event of sorted) {
    if (currentGroup.length === 0) {
      currentGroup.push(event);
    } else {
      // Check if overlaps with any event in current group
      const overlaps = currentGroup.some((e) => {
        const eEnd = e.start + e.duration;
        const eventEnd = event.start + event.duration;
        return event.start < eEnd && eventEnd > e.start;
      });

      if (overlaps) {
        currentGroup.push(event);
      } else {
        groups.push(currentGroup);
        currentGroup = [event];
      }
    }
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  // Assign columns within each group
  for (const group of groups) {
    const totalColumns = group.length;
    group.forEach((event, index) => {
      layout.set(event.id, { column: index, totalColumns });
    });
  }

  return layout;
}
