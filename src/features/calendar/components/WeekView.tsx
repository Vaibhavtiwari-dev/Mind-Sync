"use client";

import { cn } from "@/lib/utils";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { useEvents } from "@/store/selectors";
import { useMemo, useRef, useState, useEffect } from "react";
import { calculateEventLayout, EVENT_STYLES } from "./calendar-utils";
import { GridEvent } from "./TimeGrid";

interface WeekViewProps {
  date: Date;
  onAddEvent?: (date: Date, timeStr: string) => void;
  onEditEvent?: (id: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function WeekView({ date, onAddEvent, onEditEvent }: WeekViewProps) {
  const events = useEvents();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Scroll to 9 AM on mount
  useEffect(() => {
    if (scrollRef.current) {
      // 9 AM = 9 * 60 = 540 minutes
      scrollRef.current.scrollTop = 500;
    }

    // Update current time indicator
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const weekDays = useMemo(() => {
    const start = startOfWeek(date);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [date]);

  const weekEvents = useMemo(() => {
    return events.filter((e) => {
      const eDate = new Date(e.start);
      const start = weekDays[0];
      const end = addDays(weekDays[6], 1); // Comparing up to end of week
      return eDate >= start && eDate < end;
    });
  }, [events, weekDays]);

  // Group events by day
  const eventsByDay = useMemo(() => {
    const map = new Map<string, GridEvent[]>();
    weekDays.forEach((day) => map.set(day.toISOString(), []));

    weekEvents.forEach((e) => {
      const start = new Date(e.start);
      const end = new Date(e.end);
      const startMinutes = start.getHours() * 60 + start.getMinutes();
      const duration = Math.max(15, (end.getTime() - start.getTime()) / (1000 * 60));

      // Find which day this belongs to
      const dayKey = weekDays.find((d) => isSameDay(d, start))?.toISOString();

      if (dayKey) {
        const gridEvent: GridEvent = {
          id: e.id,
          title: e.title,
          start: startMinutes,
          duration,
          timeString: `${format(start, "h:mm")} - ${format(end, "h:mm")}`,
          type: e.type as GridEvent["type"],
        };
        const current = map.get(dayKey) || [];
        map.set(dayKey, [...current, gridEvent]);
      }
    });
    return map;
  }, [weekEvents, weekDays]);

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const isCurrentWeek = weekDays.some((d) => isSameDay(d, currentTime));

  return (
    <div className="flex h-full flex-col overflow-hidden bg-transparent">
      {/* Header Row */}
      <div className="bg-white/5 dark:bg-white/[0.02] backdrop-blur-md flex border-b border-white/10 dark:border-white/5">
        <div className="w-16 flex-shrink-0 border-r border-white/10 dark:border-white/5" /> {/* Time axis placeholder */}
        <div className="grid flex-1 grid-cols-7 divide-x divide-white/10 dark:divide-white/5">
          {weekDays.map((day) => {
            const isToday = isSameDay(day, new Date());
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-2 text-center transition-all duration-300",
                  isToday && "bg-brand-purple/10 dark:bg-brand-purple/20 shadow-[inset_0_0_12px_rgba(139,92,246,0.06)]"
                )}
              >
                <div
                  className={cn(
                    "text-muted-foreground text-xs font-bold uppercase tracking-wider",
                    isToday && "text-brand-purple dark:text-brand-purple/90 font-extrabold"
                  )}
                >
                  {format(day, "EEE")}
                </div>
                <div
                  className={cn(
                    "mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
                    isToday
                      ? "bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-md shadow-brand-purple/25 scale-105"
                      : "text-muted-foreground/80 hover:bg-white/20 dark:hover:bg-white/10"
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scrollable Grid */}
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto scroll-smooth">
        <div className="relative flex min-h-[1440px]">
          {/* Time Axis */}
          <div className="bg-white/5 dark:bg-black/35 backdrop-blur-md sticky left-0 z-30 w-16 flex-shrink-0 border-r border-white/10 dark:border-white/5">
            {HOURS.map((hour) => (
              <div key={hour} className="relative h-[60px]">
                <div className="text-muted-foreground/80 absolute -top-3 right-2.5 text-xs font-bold opacity-80 select-none">
                  {hour === 0
                    ? "12 AM"
                    : hour < 12
                      ? `${hour} AM`
                      : hour === 12
                        ? "12 PM"
                        : `${hour - 12} PM`}
                </div>
              </div>
            ))}
          </div>

          {/* Days Columns */}
          <div className="relative grid flex-1 grid-cols-7 divide-x divide-white/10 dark:divide-white/5">
            {/* Horizontal Grid Lines Background */}
            <div className="pointer-events-none absolute inset-0 z-0">
              {HOURS.map((hour) => (
                <div key={hour} className="border-b border-white/10 dark:border-white/5 h-[60px] w-full" />
              ))}
            </div>

            {/* Current Time Line */}
            {isCurrentWeek &&
              weekDays.map((day, i) => {
                if (!isSameDay(day, currentTime)) return null;
                return (
                  <div
                    key="current-time"
                    className="pointer-events-none absolute z-40 flex w-[calc(100%/7)] items-center"
                    style={{
                      top: `${currentMinutes}px`,
                      left: `${(i * 100) / 7}%`,
                    }}
                  >
                    <div className="-ml-1.5 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
                    <div className="h-[2px] w-full bg-gradient-to-r from-red-500 to-transparent shadow-[0_0_4px_rgba(239,68,68,0.4)]" />
                  </div>
                );
              })}

            {weekDays.map((day) => {
              const events = eventsByDay.get(day.toISOString()) || [];
              const layout = calculateEventLayout(events);

              return (
                <div
                  key={day.toISOString()}
                  className="group/col hover:bg-white/5 dark:hover:bg-white/[0.015] relative h-full transition-colors duration-200"
                  onClick={(e) => {
                    const offsetY = (e.nativeEvent as MouseEvent).offsetY;
                    const hour = Math.floor(offsetY / 60);
                    const minute = Math.floor(offsetY % 60);
                    const timeStr = `${hour.toString().padStart(2, "0")}:${minute < 30 ? "00" : "30"}`;
                    onAddEvent?.(day, timeStr);
                  }}
                >
                  {events.map((event) => {
                    const pos = layout.get(event.id) || { column: 0, totalColumns: 1 };
                    const styles = EVENT_STYLES[event.type || "work"];

                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute z-10 cursor-pointer rounded-lg p-2 text-xs shadow-sm transition-all duration-300",
                          "hover:z-20 hover:scale-[1.02] hover:shadow-md backdrop-blur-[6px] flex flex-col justify-between overflow-hidden",
                          styles.bg,
                          styles.border,
                          styles.text
                        )}
                        style={{
                          top: `${event.start}px`,
                          height: `${event.duration}px`,
                          left: `calc(${(pos.column / pos.totalColumns) * 100}% + 2px)`,
                          width: `calc(${(1 / pos.totalColumns) * 100}% - 4px)`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditEvent?.(event.id);
                        }}
                      >
                        <div>
                          <div className="truncate font-bold leading-snug tracking-wide text-[10.5px]">{event.title}</div>
                          {event.duration > 30 && (
                            <div className="opacity-85 text-[9px] mt-0.5 font-medium">{event.timeString}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
