"use client";

import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { useEffect, useRef, useState, useCallback } from "react";
import { Plus } from "lucide-react";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

import { calculateEventLayout, EVENT_STYLES } from "./calendar-utils";

export interface GridEvent {
  id: string;
  title: string;
  start: number; // minutes from midnight
  duration: number; // minutes
  timeString: string;
  type?: "work" | "personal" | "meeting" | "break" | "shallow";
}

interface TimeGridProps {
  events?: GridEvent[];
  onAddEvent?: (time: string) => void;
  onEditEvent?: (event: GridEvent) => void;
  onResizeEvent?: (eventId: string, newDuration: number) => void;
}

export function TimeGrid({ events = [], onAddEvent, onEditEvent, onResizeEvent }: TimeGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [resizing, setResizing] = useState<{
    eventId: string;
    startY: number;
    startDuration: number;
  } | null>(null);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to current time on mount
  useEffect(() => {
    if (scrollRef.current) {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      scrollRef.current.scrollTop = Math.max(0, minutes - 100);
    }
  }, []);

  const { setNodeRef, isOver } = useDroppable({
    id: "time-grid",
  });

  // Handle resize drag
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, eventId: string, currentDuration: number) => {
      e.stopPropagation();
      e.preventDefault();
      setResizing({ eventId, startY: e.clientY, startDuration: currentDuration });
    },
    []
  );

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = () => {
      // Visual feedback handled by state
    };

    const handleMouseUp = (e: globalThis.MouseEvent) => {
      const deltaY = e.clientY - resizing.startY;
      const deltaMinutes = Math.round(deltaY);
      const newDuration = Math.max(15, resizing.startDuration + deltaMinutes);
      onResizeEvent?.(resizing.eventId, newDuration);
      setResizing(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing, onResizeEvent]);

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // Calculate event layout for overlapping
  const eventLayout = calculateEventLayout(events);

  // Identify free time slots (gaps > 30 min)
  const getFreeSlots = () => {
    if (events.length === 0) return [];

    const sorted = [...events].sort((a, b) => a.start - b.start);
    const freeSlots: { start: number; end: number }[] = [];

    // Check gap before first event (from 8 AM)
    const dayStart = 8 * 60; // 8 AM
    if (sorted[0].start > dayStart + 30) {
      freeSlots.push({ start: dayStart, end: sorted[0].start });
    }

    // Check gaps between events
    for (let i = 0; i < sorted.length - 1; i++) {
      const currentEnd = sorted[i].start + sorted[i].duration;
      const nextStart = sorted[i + 1].start;
      if (nextStart - currentEnd > 30) {
        freeSlots.push({ start: currentEnd, end: nextStart });
      }
    }

    return freeSlots;
  };

  const freeSlots = getFreeSlots();

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-transparent">
      {/* Header */}
      <div className="bg-white/5 dark:bg-white/[0.02] backdrop-blur-md flex flex-shrink-0 items-center justify-between border-b border-white/10 dark:border-white/5 p-4">
        <h2 className="text-sm font-bold tracking-wide">Schedule</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {Object.entries(EVENT_STYLES)
              .slice(0, 3)
              .map(([key, style]) => (
                <div key={key} className="flex items-center gap-1.5" title={style.label}>
                  <div
                    className={cn("h-2.5 w-2.5 rounded-full border shadow-sm", style.bg, style.border)}
                  />
                  <span className="text-[10px] font-bold text-muted-foreground capitalize mr-1">
                    {key}
                  </span>
                </div>
              ))}
          </div>
          <span className="text-muted-foreground bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/10 px-2.5 py-1 font-mono text-xs font-semibold shadow-sm tracking-wide">
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto scroll-smooth"
        style={{ scrollBehavior: "smooth" }}
      >
        <div
          ref={setNodeRef}
          className={cn("bg-transparent relative min-h-[1440px] transition-colors duration-300", isOver && "bg-brand-purple/[0.02]")}
        >
          {/* Grid Lines */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className={cn(
                "border-b border-white/10 dark:border-white/5 group absolute h-[60px] w-full cursor-pointer transition-colors duration-200",
                hoveredHour === hour && "bg-white/5 dark:bg-white/[0.015]"
              )}
              style={{ top: `${hour * 60}px` }}
              onClick={() => onAddEvent?.(`${hour.toString().padStart(2, "0")}:00`)}
              onMouseEnter={() => setHoveredHour(hour)}
              onMouseLeave={() => setHoveredHour(null)}
            >
              {/* Time Label */}
              <div className="text-muted-foreground/80 absolute -top-3 left-0 w-16 pr-4 text-right text-xs font-bold select-none opacity-90">
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                      ? "12 PM"
                      : `${hour - 12} PM`}
              </div>

              {/* Half-hour dashed line */}
              <div className="border-white/10 dark:border-white/5 absolute top-[30px] right-0 left-16 border-t border-dashed" />

              {/* Add event hint on hover */}
              {hoveredHour === hour && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100 scale-95 group-hover:scale-100 z-30">
                  <div className="text-muted-foreground bg-white/15 dark:bg-white/10 backdrop-blur-lg flex items-center gap-1.5 rounded-full border border-white/15 dark:border-white/10 px-3 py-1 text-xs font-bold shadow-lg tracking-wide hover:bg-white/20 hover:scale-105 transition-all">
                    <Plus className="h-3 w-3 text-brand-purple" />
                    Add Event
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Free Time Slots */}
          {freeSlots.map((slot, i) => (
            <div
              key={`free-${i}`}
              className="absolute right-4 left-16 z-10 cursor-pointer rounded-xl border-2 border-dashed border-emerald-500/20 bg-emerald-500/[0.02] dark:border-emerald-400/15 dark:bg-emerald-400/[0.01] transition-all duration-300 hover:bg-emerald-500/[0.08] dark:hover:bg-emerald-400/[0.06] hover:border-emerald-500/40 dark:hover:border-emerald-400/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center"
              style={{
                top: `${slot.start}px`,
                height: `${slot.end - slot.start}px`,
              }}
              onClick={() => {
                const hours = Math.floor(slot.start / 60);
                const mins = slot.start % 60;
                onAddEvent?.(
                  `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
                );
              }}
            >
              <div className="text-xs font-bold tracking-widest text-emerald-500 dark:text-emerald-400 uppercase opacity-90 select-none">
                Free Time
              </div>
            </div>
          ))}

          {/* Current Time Indicator - Enhanced */}
          <div
            className="pointer-events-none absolute right-0 left-16 z-40 flex items-center animate-pulse"
            style={{ top: `${currentMinutes}px` }}
          >
            <div className="relative">
              <div className="absolute -left-1.5 -top-1.5 h-3.5 w-3.5 animate-ping rounded-full bg-red-500/40" />
              <div className="absolute -left-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-red-500 via-red-400 to-transparent shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          </div>

          {/* Events Layer */}
          {events.map((event) => {
            const layout = eventLayout.get(event.id) || { column: 0, totalColumns: 1 };
            const styles = EVENT_STYLES[event.type || "work"];
            const widthPercent = 100 / layout.totalColumns;
            const leftOffset = layout.column * widthPercent;

            return (
              <div
                key={event.id}
                className={cn(
                  "group absolute z-20 cursor-pointer overflow-hidden rounded-xl p-2.5 text-xs shadow-sm transition-all duration-300",
                  "hover:z-30 hover:scale-[1.01] hover:shadow-md backdrop-blur-[6px] flex flex-col justify-between",
                  styles.bg,
                  styles.border,
                  styles.text
                )}
                style={{
                  top: `${event.start}px`,
                  height: `${event.duration}px`,
                  minHeight: "30px",
                  left: `calc(4rem + ${leftOffset}% + 2px)`,
                  width: `calc(${widthPercent}% - 5rem - 4px)`,
                  right: layout.totalColumns === 1 ? "1rem" : "auto",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditEvent?.(event);
                }}
              >
                <div>
                  <div className="truncate font-bold leading-snug tracking-wide text-xs">{event.title}</div>
                  {event.duration > 30 && (
                    <div className="truncate text-[10px] opacity-85 mt-0.5 font-medium">{event.timeString}</div>
                  )}
                </div>

                {/* Resize Handle */}
                {onResizeEvent && (
                  <div
                    className="absolute right-0 bottom-0 left-0 h-2.5 cursor-s-resize rounded-b-xl bg-gradient-to-t from-black/5 dark:from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center"
                    onMouseDown={(e) => handleResizeStart(e, event.id, event.duration)}
                  >
                    <div className="h-1 w-6 rounded-full bg-current opacity-40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
