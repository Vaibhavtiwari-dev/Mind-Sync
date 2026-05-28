"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvents, useEventActions, useViewActions } from "@/store/selectors";
import { useCalendarSync } from "@/hooks/use-calendar-sync";
// Import new components
import {
  CalendarViewTabs,
  CalendarViewType,
} from "@/features/calendar/components/CalendarViewTabs";
import { WeekView } from "@/features/calendar/components/WeekView";
import { DayView } from "@/features/calendar/components/DayView";
import { AgendaView } from "@/features/calendar/components/AgendaView";
import { QuickAddPopover } from "@/features/calendar/components/QuickAddPopover";
import { EVENT_STYLES } from "@/features/calendar/components/calendar-utils";
import { CalendarSyncStatus } from "@/components/calendar/calendar-sync-status";
import { GlassCard } from "@/components/ui/card";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useEffect } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  // const router = useRouter();
  const events = useEvents();
  const { addEvent } = useEventActions();
  const { setSelectedDate } = useViewActions();
  useCalendarSync();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>("month");
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Automatically switch to Agenda/Day view on mobile if in Month view
  useEffect(() => {
    if (isMobile && view === "month") {
      setView("agenda");
    }
  }, [isMobile, view]);

  // Dialog & Popover State
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddData, setQuickAddData] = useState<{ date: Date; time: string } | null>(null);

  const hydrated = useHydrated();

  // Form State
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventStart, setNewEventStart] = useState("09:00");
  const [newEventEnd, setNewEventEnd] = useState("10:00");
  const [newEventType, setNewEventType] = useState("work");
  const [recurrenceFreq, setRecurrenceFreq] = useState("none");

  // Navigation handlers
  const navigate = (direction: "prev" | "next") => {
    if (view === "month") {
      setCurrentDate((curr) => (direction === "next" ? addMonths(curr, 1) : subMonths(curr, 1)));
    } else if (view === "week") {
      setCurrentDate((curr) => (direction === "next" ? addWeeks(curr, 1) : subWeeks(curr, 1)));
    } else if (view === "day") {
      setCurrentDate((curr) => (direction === "next" ? addDays(curr, 1) : subDays(curr, 1)));
    }
  };

  const goToToday = () => setCurrentDate(new Date());

  // Month Grid Generation
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const calendarDays = eachDayOfInterval({
    start: new Date(startTime),
    end: new Date(endTime),
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // Switch to day view for that date instead of dashboard
    setCurrentDate(date);
    setView("day");
  };

  const handleQuickAddTrigger = (date: Date, timeStr: string) => {
    setQuickAddData({ date, time: timeStr });
    setQuickAddOpen(true);
  };

  const handleQuickAddSave = (event: { title: string; start: Date; end: Date; type: string }) => {
    const newEvent = {
      title: event.title,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
      type: event.type as "work" | "meeting" | "personal",
    };
    addEvent(newEvent);
    setQuickAddOpen(false);
  };

  const handleSaveEvent = () => {
    if (!newEventTitle) return;

    const [startH, startM] = newEventStart.split(":").map(Number);
    const [endH, endM] = newEventEnd.split(":").map(Number);

    const start = new Date(currentDate);
    start.setHours(startH, startM);

    const end = new Date(currentDate);
    end.setHours(endH, endM);

    // Basic validation
    if (end < start) end.setHours(startH + 1);

    const recurrence =
      recurrenceFreq !== "none"
        ? {
            frequency: recurrenceFreq as "daily" | "weekly" | "monthly" | "yearly",
            interval: 1,
          }
        : null;

    const newEvent = {
      title: newEventTitle,
      start: start.toISOString(),
      end: end.toISOString(),
      type: newEventType as "work" | "meeting" | "personal",
      recurrence,
    };

    addEvent(newEvent);

    setNewEventOpen(false);
    setNewEventTitle("");
    setRecurrenceFreq("none");
  };

  if (!hydrated) return null;

  return (
    <div className="flex h-full flex-col space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight gradient-text w-fit truncate">
            {view === "agenda"
              ? "Agenda"
              : format(currentDate, view === "day" ? "MMMM d, yyyy" : "MMMM yyyy")}
            {view === "week" && (
              <span className="text-muted-foreground ml-2 hidden text-lg font-normal lg:inline">
                Week of {format(startOfWeek(currentDate), "MMM d")}
              </span>
            )}
          </h1>
          <div className="bg-white/30 dark:bg-white/5 backdrop-blur-md flex items-center gap-1 rounded-lg border border-white/40 dark:border-white/10 p-0.5 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md hover:bg-white/40 dark:hover:bg-white/10"
              onClick={() => navigate("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md hover:bg-white/40 dark:hover:bg-white/10"
              onClick={() => navigate("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="hidden sm:flex bg-white/30 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10"
          >
            Today
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <CalendarSyncStatus />
          <CalendarViewTabs currentView={view} onViewChange={setView} />

          <Dialog open={newEventOpen} onOpenChange={setNewEventOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">New Event</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>Add a new event to your calendar.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="Marketing Sync"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start">Start Time</Label>
                    <Input
                      id="start"
                      type="time"
                      value={newEventStart}
                      onChange={(e) => setNewEventStart(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end">End Time</Label>
                    <Input
                      id="end"
                      type="time"
                      value={newEventEnd}
                      onChange={(e) => setNewEventEnd(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Type</Label>
                    <Select value={newEventType} onValueChange={setNewEventType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work">Deep Work</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Repeat</Label>
                    <Select value={recurrenceFreq} onValueChange={setRecurrenceFreq}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Does not repeat</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveEvent}>Save Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <QuickAddPopover
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSave={handleQuickAddSave}
        initialDate={quickAddData?.date}
        initialTime={quickAddData?.time}
      />

      {/* View Rendering */}
      <GlassCard hover="none" className="flex-1 overflow-hidden shadow-md p-0 flex flex-col glass-card border border-white/10">
        {view === "month" && (
          <div className="flex h-full flex-col overflow-x-auto">
            <div className="flex h-full min-w-[600px] flex-col">
              {/* Month Header */}
              <div className="bg-white/10 dark:bg-white/[0.03] backdrop-blur-lg grid grid-cols-7 border-b border-white/15 dark:border-white/10 py-3.5 text-center">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="text-muted-foreground text-xs font-bold tracking-widest uppercase opacity-90"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Month Grid */}
              <div className="grid flex-1 grid-cols-7 grid-rows-5 lg:grid-rows-6 divide-x divide-y divide-white/10 dark:divide-white/5">
                {calendarDays.map((day) => {
                  const isCurrentMonth = isSameMonth(day, monthStart);
                  const isDayToday = isToday(day);
                  const dayEvents = events.filter((e) => isSameDay(parseISO(e.start), day));

                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "group relative flex min-h-[110px] cursor-pointer flex-col gap-1.5 p-2.5 transition-all duration-300",
                        !isCurrentMonth 
                          ? "bg-black/[0.03] dark:bg-white/[0.002] opacity-35 hover:opacity-75 hover:bg-white/5 dark:hover:bg-white/[0.01]" 
                          : "hover:bg-white/[0.06] dark:hover:bg-white/[0.03] bg-white/[0.01] backdrop-blur-[2px]",
                        isDayToday && "bg-brand-purple/10 dark:bg-brand-purple/20 shadow-[0_0_20px_rgba(139,92,246,0.2)] border-2 border-brand-purple/40 dark:border-brand-purple/30 z-10 scale-[1.002]"
                      )}
                      onClick={() => handleDateClick(day)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                            isDayToday
                              ? "bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-md shadow-brand-purple/35 scale-110"
                              : "text-muted-foreground/80 group-hover:text-foreground group-hover:bg-white/10 group-hover:scale-105"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                        {dayEvents.length > 0 && !isDayToday && (
                          <span className="relative flex h-1.5 w-1.5 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-purple/60 opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-purple/80 dark:bg-brand-purple/95" />
                          </span>
                        )}
                      </div>

                      {/* Render Events */}
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => {
                          const styles = EVENT_STYLES[event.type || "work"];
                          return (
                            <div
                              key={event.id}
                              className={cn(
                                "cursor-pointer truncate rounded-lg border py-1 px-2 text-[10px] font-semibold transition-all hover:translate-x-1 shadow-sm",
                                styles.bg,
                                styles.text,
                                styles.border
                              )}
                            >
                              <span className="mr-1 font-bold opacity-75">
                                {format(parseISO(event.start), "h:mma")}
                              </span>
                              {event.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <div className="text-muted-foreground/80 pl-1 text-[9.5px] font-bold flex items-center gap-1.5 mt-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-purple animate-pulse" />
                            + {dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {view === "week" && (
          <WeekView
            date={currentDate}
            onAddEvent={handleQuickAddTrigger}
            onEditEvent={(id) => console.log("Edit", id)}
          />
        )}

        {view === "day" && (
          <DayView
            date={currentDate}
            onAddEvent={(time) => handleQuickAddTrigger(currentDate, time)}
          />
        )}

        {view === "agenda" && <AgendaView />}
      </GlassCard>
    </div>
  );
}
